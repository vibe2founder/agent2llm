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


  it('rejeita provider inválido', () => {
    handleCommand('/provider shell', state, deps);
    expect(state.provider).toBe('auto');
    expect(deps.logLine).toHaveBeenCalledWith(
      'Sistema',
      'Provider inválido. Permitidos: openai, groq, openrouter, anthropic, gemini, ollama, auto'
    );
  });

  it('rejeita model inválido', () => {
    handleCommand('/model rm -rf /', state, deps);
    expect(state.model).toBe('m1');
    expect(deps.logLine).toHaveBeenCalledWith(
      'Sistema',
      'Modelo inválido. Use apenas letras, números e . _ : / -'
    );
  });

  it('encerra com /exit', () => {
    handleCommand('/exit', state, deps);
    expect(deps.exit).toHaveBeenCalledWith(0);
  });

  it('retorna false para comandos desconhecidos', () => {
    expect(handleCommand('/abc', state, deps)).toBe(false);
  });
});
