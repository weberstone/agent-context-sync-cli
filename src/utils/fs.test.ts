import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readTextFile, writeTextFile, ensureDir } from './fs.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-rules-test-'));
});

afterEach(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('writeTextFile', () => {
  it('writes content to a file', async () => {
    const filePath = path.join(tmpDir, 'test.md');
    await writeTextFile(filePath, '# Hello');
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('# Hello');
  });

  it('overwrites existing file', async () => {
    const filePath = path.join(tmpDir, 'test.md');
    await writeTextFile(filePath, 'first');
    await writeTextFile(filePath, 'second');
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('second');
  });
});

describe('readTextFile', () => {
  it('reads content from a file', async () => {
    const filePath = path.join(tmpDir, 'test.md');
    await fs.writeFile(filePath, '# Hello', 'utf-8');
    const content = await readTextFile(filePath);
    expect(content).toBe('# Hello');
  });

  it('throws when file does not exist', async () => {
    await expect(readTextFile(path.join(tmpDir, 'nonexistent.md'))).rejects.toThrow();
  });
});

describe('ensureDir', () => {
  it('creates a directory recursively', async () => {
    const dirPath = path.join(tmpDir, 'a', 'b', 'c');
    await ensureDir(dirPath);
    const stat = await fs.stat(dirPath);
    expect(stat.isDirectory()).toBe(true);
  });

  it('does not throw if directory already exists', async () => {
    const dirPath = path.join(tmpDir, 'existing');
    await fs.mkdir(dirPath);
    await expect(ensureDir(dirPath)).resolves.not.toThrow();
  });
});
