#!/usr/bin/env node
import blessed from 'blessed';
import { sendPrompt } from '../node_modules/@purecore/one-llm-4-all/dist/src/index.js';

const SYSTEM_PROMPT = `Você é um agente de programação para terminal.
Regras:
- Responda em português do Brasil.
- Seja prático e objetivo.
- Ao sugerir código, explique rapidamente como executar.
- Se faltarem dados, peça o mínimo necessário.`;

const state = {
  provider: process.env.LLM_PROVIDER || 'auto',
  model: process.env.LLM_MODEL || 'llama-3.1-8b-instant',
  apiKey:
    process.env.LLM_API_KEY ||
    process.env.GROQ_API_KEY ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GEMINI_API_KEY ||
    '',
  messages: []
};

const screen = blessed.screen({
  smartCSR: true,
  title: 'agent2llm'
});

const header = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  tags: true,
  style: { fg: 'white', bg: 'blue' },
  content: ''
});

const chatBox = blessed.log({
  top: 3,
  left: 0,
  width: '100%',
  height: '100%-6',
  border: 'line',
  tags: true,
  label: ' Conversa ',
  keys: true,
  mouse: true,
  scrollback: 1000,
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

const input = blessed.textbox({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: 'line',
  label: ' Prompt (Enter envia | /help) ',
  inputOnFocus: true,
  keys: true,
  mouse: true,
  style: {
    fg: 'white',
    bg: 'black',
    border: { fg: 'cyan' }
  }
});

screen.append(header);
screen.append(chatBox);
screen.append(input);

const updateHeader = () => {
  header.setContent(
    ` agent2llm | provider: {bold}${state.provider}{/bold} | model: {bold}${state.model}{/bold} | q para sair `
  );
};

const logLine = (who, text) => {
  const color = who === 'Você' ? 'green' : who === 'Sistema' ? 'yellow' : 'cyan';
  chatBox.add(`{bold}{${color}-fg}${who}:{/${color}-fg}{/bold} ${text}`);
  screen.render();
};

const help = () => {
  logLine(
    'Sistema',
    'Comandos: /help, /exit, /clear, /model <nome>, /provider <nome>, /apikey <chave>'
  );
};

const handleCommand = (value) => {
  const [cmd, ...rest] = value.trim().split(/\s+/);
  const arg = rest.join(' ');

  switch (cmd) {
    case '/help':
      help();
      return true;
    case '/exit':
      process.exit(0);
      return true;
    case '/clear':
      state.messages = [];
      chatBox.setContent('');
      logLine('Sistema', 'Histórico limpo.');
      return true;
    case '/model':
      if (!arg) {
        logLine('Sistema', 'Uso: /model <nome-do-modelo>');
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
      state.provider = arg;
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

const askLLM = async (content) => {
  state.messages.push({ role: 'user', content });

  const typing = '{gray-fg}Gerando resposta...{/gray-fg}';
  chatBox.add(typing);
  screen.render();

  try {
    const response = await sendPrompt(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        ...state.messages
      ],
      {
        model: state.model,
        provider: state.provider,
        apiKey: state.apiKey || undefined,
        temperature: 0.2,
        max_tokens: 1200
      }
    ).getText();

    const lines = chatBox.getLines();
    if (lines[lines.length - 1]?.includes('Gerando resposta...')) {
      lines.pop();
      chatBox.setContent(lines.join('\n'));
    }

    state.messages.push({ role: 'assistant', content: response });
    logLine('Agente', response);
  } catch (error) {
    const lines = chatBox.getLines();
    if (lines[lines.length - 1]?.includes('Gerando resposta...')) {
      lines.pop();
      chatBox.setContent(lines.join('\n'));
    }
    logLine('Sistema', `Erro ao consultar LLM: ${error?.message || String(error)}`);
  }
};

input.on('submit', async (value) => {
  const prompt = value.trim();
  input.clearValue();
  screen.render();

  if (!prompt) return;

  if (prompt.startsWith('/')) {
    handleCommand(prompt);
    input.focus();
    return;
  }

  logLine('Você', prompt);
  await askLLM(prompt);
  input.focus();
});

screen.key(['q', 'C-c'], () => process.exit(0));
chatBox.key(['up', 'down', 'pageup', 'pagedown'], () => {});

updateHeader();
help();
logLine('Sistema', 'Digite sua solicitação de programação e pressione Enter.');

input.focus();
screen.render();
