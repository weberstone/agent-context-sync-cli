import { describe, it, expect, vi } from 'vitest';
import { logSuccess, logWarning, logError, logInfo } from './log.js';

describe('logSuccess', () => {
  it('prints a green success message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logSuccess('done');
    expect(spy).toHaveBeenCalledTimes(1);
    const output = spy.mock.calls[0][0];
    expect(output).toContain('done');
    spy.mockRestore();
  });
});

describe('logWarning', () => {
  it('prints a yellow warning message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logWarning('careful');
    expect(spy).toHaveBeenCalledTimes(1);
    const output = spy.mock.calls[0][0];
    expect(output).toContain('careful');
    spy.mockRestore();
  });
});

describe('logError', () => {
  it('prints a red error message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logError('fail');
    expect(spy).toHaveBeenCalledTimes(1);
    const output = spy.mock.calls[0][0];
    expect(output).toContain('fail');
    spy.mockRestore();
  });
});

describe('logInfo', () => {
  it('prints a blue info message', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logInfo('info');
    expect(spy).toHaveBeenCalledTimes(1);
    const output = spy.mock.calls[0][0];
    expect(output).toContain('info');
    spy.mockRestore();
  });
});
