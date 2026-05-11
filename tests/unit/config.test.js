import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/config.js';

describe('createInitialState', () => {
  it('usa defaults quando não há env', () => {
    const state = createInitialState({});
    expect(state.provider).toBe('auto');
    expect(state.model).toBe('llama-3.1-8b-instant');
    expect(state.apiKey).toBe('');
    expect(state.messages).toEqual([]);
  });

  it('prioriza LLM_API_KEY sobre chaves de provider', () => {
    const state = createInitialState({
      LLM_API_KEY: 'llm-key',
      GROQ_API_KEY: 'groq-key'
    });
    expect(state.apiKey).toBe('llm-key');
  });
});
