import { describe, it, expect } from 'vitest';
import { isValidModelName, isValidProvider, sanitizeTerminalText } from '../../src/security.js';

describe('security helpers', () => {
  it('remove escape ANSI e caracteres de controle', () => {
    const out = sanitizeTerminalText('\u001b[31mALERTA\u001b[0m\u0007');
    expect(out).toBe('ALERTA');
  });

  it('valida provider permitido', () => {
    expect(isValidProvider('groq')).toBe(true);
    expect(isValidProvider('shell')).toBe(false);
  });

  it('valida model seguro', () => {
    expect(isValidModelName('llama-3.1-8b-instant')).toBe(true);
    expect(isValidModelName('rm -rf /')).toBe(false);
  });
});
