import { isValidModelName, isValidProvider } from './security.js';

export const showHelpText =
  'Comandos: /help, /exit, /clear, /model <nome>, /provider <nome>, /apikey <chave>';

export const handleCommand = (value, state, deps) => {
  const { logLine, updateHeader, clearChat, exit } = deps;
  const [cmd, ...rest] = value.trim().split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd) {
    case '/help':
      logLine('Sistema', showHelpText);
      return true;
    case '/exit':
      exit(0);
      return true;
    case '/clear':
      state.messages = [];
      clearChat();
      logLine('Sistema', 'Histórico limpo.');
      return true;
    case '/model':
      if (!arg) {
        logLine('Sistema', 'Uso: /model <nome-do-modelo>');
        return true;
      }
      if (!isValidModelName(arg)) {
        logLine('Sistema', 'Modelo inválido. Use apenas letras, números e . _ : / -');
        return true;
      }
      state.model = arg;
      updateHeader();
      logLine('Sistema', `Modelo atualizado para: ${state.model}`);
      return true;
    case '/provider':
      if (!arg) {
        logLine('Sistema', 'Uso: /provider <openai|groq|openrouter|anthropic|gemini|ollama|auto>');
        return true;
      }
      if (!isValidProvider(arg)) {
        logLine('Sistema', 'Provider inválido. Permitidos: openai, groq, openrouter, anthropic, gemini, ollama, auto');
        return true;
      }
      state.provider = arg.toLowerCase();
      updateHeader();
      logLine('Sistema', `Provider atualizado para: ${state.provider}`);
      return true;
    case '/apikey':
      if (!arg) {
        logLine('Sistema', 'Uso: /apikey <sua-chave>');
        return true;
      }
      state.apiKey = arg;
      logLine('Sistema', 'API key atualizada na sessão atual.');
      return true;
    default:
      return false;
  }
};
