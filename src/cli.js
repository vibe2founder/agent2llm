#!/usr/bin/env node
import blessed from 'blessed';
import { sendPrompt } from '../node_modules/@purecore/one-llm-4-all/dist/src/index.js';
import { SYSTEM_PROMPT, createInitialState } from './config.js';
import { askLLM } from './chat.js';
import { handleCommand, showHelpText } from './commands.js';
import { sanitizeTerminalText } from './security.js';

const state = createInitialState();

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
  scrollbar: { ch: ' ', inverse: true }
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
  chatBox.add(`{bold}{${color}-fg}${who}:{/${color}-fg}{/bold} ${sanitizeTerminalText(text)}`);
  screen.render();
};

const showHelp = () => logLine('Sistema', showHelpText);

input.on('submit', async (value) => {
  const prompt = sanitizeTerminalText(value).trim();
  input.clearValue();
  screen.render();

  if (!prompt) return;

  if (prompt.startsWith('/')) {
    handleCommand(prompt, state, {
      logLine,
      updateHeader,
      clearChat: () => chatBox.setContent(''),
      exit: process.exit
    });
    input.focus();
    return;
  }

  logLine('Você', prompt);
  await askLLM({
    content: prompt,
    state,
    sendPrompt,
    chatBox,
    render: () => screen.render(),
    logLine,
    systemPrompt: SYSTEM_PROMPT
  });
  input.focus();
});

screen.key(['q', 'C-c'], () => process.exit(0));
updateHeader();
showHelp();
logLine('Sistema', 'Digite sua solicitação de programação e pressione Enter.');

input.focus();
screen.render();
