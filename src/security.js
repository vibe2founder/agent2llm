const ANSI_ESCAPE_REGEX = /\x1B\[[0-?]*[ -/]*[@-~]/g;
const MAX_TEXT_LENGTH = 8000;

export const sanitizeTerminalText = (value) => {
  const text = String(value ?? '');
  const noAnsi = text.replace(ANSI_ESCAPE_REGEX, '');
  const trimmed = noAnsi.length > MAX_TEXT_LENGTH ? `${noAnsi.slice(0, MAX_TEXT_LENGTH)}...[truncated]` : noAnsi;
  return trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
};

export const ALLOWED_PROVIDERS = new Set([
  'openai',
  'groq',
  'openrouter',
  'anthropic',
  'gemini',
  'ollama',
  'auto'
]);

export const isValidProvider = (value) => ALLOWED_PROVIDERS.has(String(value || '').toLowerCase());

export const isValidModelName = (value) => {
  const model = String(value || '').trim();
  return model.length >= 2 && model.length <= 120 && /^[a-zA-Z0-9._:/-]+$/.test(model);
};
