import { describe, it, expect, vi, beforeEach } from 'vitest';

const CANCEL = Symbol('cancel');

vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  note: vi.fn(),
  cancel: vi.fn(),
  confirm: vi.fn(),
  select: vi.fn(),
  multiselect: vi.fn(),
  spinner: vi.fn(() => ({ start: vi.fn(), stop: vi.fn() })),
  isCancel: vi.fn((value: unknown) => value === CANCEL),
}));

import * as mockClackRaw from '@clack/prompts';
import { SkillsPromptService } from './skills-prompts.service.js';
import type { ParsedSkill } from './skills.types.js';

const mockClack = mockClackRaw as unknown as {
  intro: ReturnType<typeof vi.fn>;
  outro: ReturnType<typeof vi.fn>;
  cancel: ReturnType<typeof vi.fn>;
  confirm: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
  multiselect: ReturnType<typeof vi.fn>;
  isCancel: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  (mockClack.confirm as ReturnType<typeof vi.fn>).mockReset();
  (mockClack.select as ReturnType<typeof vi.fn>).mockReset();
  (mockClack.multiselect as ReturnType<typeof vi.fn>).mockReset();
  (mockClack.cancel as ReturnType<typeof vi.fn>).mockReset();
  (mockClack.isCancel as ReturnType<typeof vi.fn>).mockImplementation(
    (value: unknown) => value === CANCEL,
  );
});

function skill(overrides: Partial<ParsedSkill> = {}): ParsedSkill {
  return {
    name: 'test-skill',
    description: 'A test skill',
    source: 'general',
    type: 'file',
    diskPath: '/fake/test-skill.md',
    ...overrides,
  };
}

function makeDiscovery(overrides: Record<string, unknown> = {}) {
  return {
    listGeneralSkills: vi.fn().mockResolvedValue([]),
    listProjectSkills: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe('run', () => {
  it('selects general skills and includes project skills', async () => {
    const discovery = makeDiscovery({
      listGeneralSkills: vi
        .fn()
        .mockResolvedValue([skill({ name: 'skill-a', description: 'First skill' })]),
      listProjectSkills: vi.fn().mockResolvedValue([
        skill({
          name: 'proj-skill',
          description: 'Project skill',
          source: 'project',
        }),
      ]),
    });

    (mockClack.multiselect as ReturnType<typeof vi.fn>).mockResolvedValue(['skill-a']);

    const service = new SkillsPromptService(discovery as any);
    const answers = await service.run('my-app');

    expect(answers).not.toBe(null);
    expect(answers!.selectedSkills).toContain('skill-a');
    expect(answers!.selectedSkills).toContain('proj-skill');
  });

  it('returns only project skills when none selected from general', async () => {
    const discovery = makeDiscovery({
      listGeneralSkills: vi.fn().mockResolvedValue([skill({ name: 'skill-a' })]),
      listProjectSkills: vi
        .fn()
        .mockResolvedValue([skill({ name: 'proj-skill', source: 'project' })]),
    });

    (mockClack.multiselect as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const service = new SkillsPromptService(discovery as any);
    const answers = await service.run('my-app');

    expect(answers!.selectedSkills).toEqual(['proj-skill']);
  });

  it('asks confirmation when no general skills but project skills exist', async () => {
    const discovery = makeDiscovery({
      listGeneralSkills: vi.fn().mockResolvedValue([]),
      listProjectSkills: vi
        .fn()
        .mockResolvedValue([skill({ name: 'proj-skill', source: 'project' })]),
    });

    (mockClack.confirm as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const service = new SkillsPromptService(discovery as any);
    const answers = await service.run('my-app');

    expect(answers!.selectedSkills).toEqual(['proj-skill']);
    expect(mockClack.confirm).toHaveBeenCalled();
  });

  it('returns empty when no skills at all', async () => {
    const discovery = makeDiscovery();

    const service = new SkillsPromptService(discovery as any);
    const answers = await service.run('my-app');

    expect(answers!.selectedSkills).toEqual([]);
  });

  it('resolves project vs general name conflict', async () => {
    const discovery = makeDiscovery({
      listGeneralSkills: vi
        .fn()
        .mockResolvedValue([skill({ name: 'shared-skill', description: 'General version' })]),
      listProjectSkills: vi.fn().mockResolvedValue([
        skill({
          name: 'shared-skill',
          description: 'Project version',
          source: 'project',
        }),
      ]),
    });

    // select for conflict resolution (project vs general)
    (mockClack.select as ReturnType<typeof vi.fn>).mockResolvedValue('project');
    // confirm for "no general, project exists" message
    (mockClack.confirm as ReturnType<typeof vi.fn>).mockResolvedValue(true);

    const service = new SkillsPromptService(discovery as any);
    const answers = await service.run('my-app');

    // Project version wins, general skipped
    expect(answers!.selectedSkills).toEqual(['shared-skill']);
    expect(mockClack.select).toHaveBeenCalled();
  });
});
