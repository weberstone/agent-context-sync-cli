import type { Architecture } from '../config/config.types.js';

export interface AgentOption {
  value: string;
  label: string;
}

export const AVAILABLE_AGENTS: readonly AgentOption[] = [
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'gemini-cli', label: 'Gemini CLI' },
  { value: 'codex', label: 'OpenAI Codex' },
  { value: 'continue', label: 'Continue' },
];

export interface Answers {
  architecture: Architecture;
  hasUserprompt: boolean;
  userpromptSource: 'project' | 'general' | null;
  frameworks: string[];
  packages: string[];
  workflowSource: 'project' | 'general' | null;
  agents: string[];
}
