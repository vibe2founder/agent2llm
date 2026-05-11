import { describe, it, expect, vi } from 'vitest';
import { askLLM } from '../../src/chat.js';

const createChatBox = () => {
  const lines = [];
  return {
    add: vi.fn((line) => lines.push(line)),
    getLines: vi.fn(() => [...lines]),
    setContent: vi.fn((content) => {
      lines.length = 0;
      if (content) lines.push(...content.split('\n'));
    })
  };
};

describe('askLLM', () => {
  it('adiciona resposta do assistente em caso de sucesso', async () => {
    const state = { provider: 'auto', model: 'm1', apiKey: '', messages: [] };
    const chatBox = createChatBox();
    const logLine = vi.fn();
    const sendPrompt = vi.fn(() => ({ getText: () => Promise.resolve('ok resposta') }));

    const out = await askLLM({
      content: 'oi',
      state,
      sendPrompt,
      chatBox,
      render: vi.fn(),
      logLine,
      systemPrompt: 'sys'
    });

    expect(out).toBe('ok resposta');
    expect(state.messages).toEqual([
      { role: 'user', content: 'oi' },
      { role: 'assistant', content: 'ok resposta' }
    ]);
    expect(logLine).toHaveBeenCalledWith('Agente', 'ok resposta');
  });

  it('loga erro em caso de falha do provider', async () => {
    const state = { provider: 'auto', model: 'm1', apiKey: '', messages: [] };
    const chatBox = createChatBox();
    const logLine = vi.fn();
    const sendPrompt = vi.fn(() => ({ getText: () => Promise.reject(new Error('falhou')) }));

    const out = await askLLM({
      content: 'oi',
      state,
      sendPrompt,
      chatBox,
      render: vi.fn(),
      logLine,
      systemPrompt: 'sys'
    });

    expect(out).toBeNull();
    expect(logLine).toHaveBeenCalledWith('Sistema', 'Erro ao consultar LLM: falhou');
  });
});
