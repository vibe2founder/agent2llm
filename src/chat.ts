import type { AgentState } from './config.js';

interface ChatBox {
  add: (line: string) => void;
  getLines: () => string[];
  setContent: (content: string) => void;
}

interface AskLLMParams {
  content: string;
  state: AgentState;
  sendPrompt: (...args: any[]) => { getText: () => Promise<string> };
  chatBox: ChatBox;
  render: () => void;
  logLine: (who: string, text: string) => void;
  systemPrompt: string;
}

export const removeTypingLine = (chatBox: ChatBox): void => {
  const lines = chatBox.getLines();
  if (lines[lines.length - 1]?.includes('Gerando resposta...')) {
    lines.pop();
    chatBox.setContent(lines.join('\n'));
  }
};

export const askLLM = async ({
  content,
  state,
  sendPrompt,
  chatBox,
  render,
  logLine,
  systemPrompt
}: AskLLMParams): Promise<string | null> => {
  state.messages.push({ role: 'user', content });

  chatBox.add('{gray-fg}Gerando resposta...{/gray-fg}');
  render();

  try {
    const response = await sendPrompt([{ role: 'system', content: systemPrompt }, ...state.messages], {
      model: state.model,
      provider: state.provider,
      apiKey: state.apiKey || undefined,
      temperature: 0.2,
      max_tokens: 1200
    }).getText();

    removeTypingLine(chatBox);
    state.messages.push({ role: 'assistant', content: response });
    logLine('Agente', response);
    return response;
  } catch (error) {
    removeTypingLine(chatBox);
    logLine('Sistema', `Erro ao consultar LLM: ${(error as Error)?.message || String(error)}`);
    return null;
  }
};
