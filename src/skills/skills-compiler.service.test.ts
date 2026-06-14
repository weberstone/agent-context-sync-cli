import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { SkillsCompilerService } from './skills-compiler.service.js';
import type { ParsedSkill } from './skills.types.js';

let tmpDir: string;
let service: SkillsCompilerService;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'skills-compile-'));
  service = new SkillsCompilerService(tmpDir);
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

async function createFile(filePath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}

describe('compile', () => {
  it('copies a file-based skill to .agents/skills/', async () => {
    const srcDir = path.join(tmpDir, 'src-skills');
    await createFile(path.join(srcDir, 'my-skill.md'), '# My Skill');

    const skills: ParsedSkill[] = [
      {
        name: 'my-skill',
        description: 'Test skill',
        source: 'general',
        type: 'file',
        diskPath: path.join(srcDir, 'my-skill.md'),
      },
    ];

    const copied = await service.compile(skills);
    expect(copied).toEqual(['my-skill']);

    const destContent = await fs.readFile(
      path.join(tmpDir, '.agents', 'skills', 'my-skill.md'),
      'utf-8',
    );
    expect(destContent).toBe('# My Skill');
  });

  it('copies a folder-based skill recursively', async () => {
    const srcDir = path.join(tmpDir, 'src-skills', 'my-skill');
    await createFile(path.join(srcDir, 'SKILL.md'), '# Skill');
    await createFile(path.join(srcDir, 'script.sh'), '#!/bin/sh');

    const skills: ParsedSkill[] = [
      {
        name: 'my-skill',
        description: 'Folder skill',
        source: 'general',
        type: 'folder',
        diskPath: srcDir,
      },
    ];

    const copied = await service.compile(skills);
    expect(copied).toEqual(['my-skill']);

    const destDir = path.join(tmpDir, '.agents', 'skills', 'my-skill');
    expect(await fs.readFile(path.join(destDir, 'SKILL.md'), 'utf-8')).toBe('# Skill');
    expect(await fs.readFile(path.join(destDir, 'script.sh'), 'utf-8')).toBe('#!/bin/sh');
  });

  it('copies multiple skills', async () => {
    const srcDir = path.join(tmpDir, 'src-skills');
    await createFile(path.join(srcDir, 'a.md'), '# A');
    await createFile(path.join(srcDir, 'b.md'), '# B');

    const skills: ParsedSkill[] = [
      {
        name: 'a',
        description: 'A',
        source: 'general',
        type: 'file',
        diskPath: path.join(srcDir, 'a.md'),
      },
      {
        name: 'b',
        description: 'B',
        source: 'general',
        type: 'file',
        diskPath: path.join(srcDir, 'b.md'),
      },
    ];

    const copied = await service.compile(skills);
    expect(copied).toEqual(['a', 'b']);
  });

  it('skips skills that fail to copy, continues with others', async () => {
    const skills: ParsedSkill[] = [
      {
        name: 'missing',
        description: 'Does not exist',
        source: 'general',
        type: 'file',
        diskPath: '/nonexistent/path.md',
      },
    ];

    const copied = await service.compile(skills);
    // Should not throw, just return empty
    expect(copied).toEqual([]);
  });
});
