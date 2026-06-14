import pc from 'picocolors';

export function logSuccess(message: string): void {
  console.log(pc.green(`[SUCCESS] ${message}`));
}

export function logWarning(message: string): void {
  console.log(pc.yellow(`[WARNING] ${message}`));
}

export function logError(message: string): void {
  console.error(pc.red(`[ERROR] ${message}`));
}

export function logInfo(message: string): void {
  console.log(pc.blue(`[INFO] ${message}`));
}