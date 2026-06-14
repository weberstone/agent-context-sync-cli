import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceDir = path.dirname(fileURLToPath(import.meta.url));

export function getSourceDir(): string {
  return sourceDir;
}

export function getTargetDir(): string {
  return process.cwd();
}

export function getProjectName(): string {
  return path.basename(process.cwd());
}

export function getRulesDir(): string {
  return path.join(sourceDir, '..', '..', 'rules');
}
