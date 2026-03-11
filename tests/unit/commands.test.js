import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleCommand } from '../../src/commands.js';

describe('handleCommand', () => {
  let state;
  let deps;

  beforeEach(() => {
    state = { provider: 'auto', model: 'm1', apiKey: '', messages: [{ role: 'user', content: 'x' }] };
    deps = {
      logLine: vi.fn(),
      updateHeader: vi.fn(),
      clearChat: vi.fn(),
      exit: vi.fn()
    };
  });

  it('limpa histórico com /clear', () => {
    const handled = handleCommand('/clear', state, deps);
    expect(handled).toBe(true);
    expect(state.messages).toEqual([]);
    expect(deps.clearChat).toHaveBeenCalled();
  });

  it('atualiza provider com /provider', () => {
    handleCommand('/provider groq', state, deps);
    expect(state.provider).toBe('groq');
    expect(deps.updateHeader).toHaveBeenCalled();
  });

  it('encerra com /exit', () => {
    handleCommand('/exit', state, deps);
    expect(deps.exit).toHaveBeenCalledWith(0);
  });

  it('retorna false para comandos desconhecidos', () => {
    expect(handleCommand('/abc', state, deps)).toBe(false);
  });
});
