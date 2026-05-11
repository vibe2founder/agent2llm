export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AgentState {
  provider: string;
  model: string;
  apiKey: string;
  messages: ChatMessage[];
}

export const SYSTEM_PROMPT = `Você é um agente de programação para terminal.
Regras:
- Responda em português do Brasil.
- Seja prático e objetivo.
- Ao sugerir código, explique rapidamente como executar.
- Se faltarem dados, peça o mínimo necessário.`;

export const createInitialState = (env: NodeJS.ProcessEnv | Record<string, string> = process.env): AgentState => ({
  provider: env.LLM_PROVIDER || 'auto',
  model: env.LLM_MODEL || 'llama-3.1-8b-instant',
  apiKey:
    env.LLM_API_KEY ||
    env.GROQ_API_KEY ||
    env.OPENROUTER_API_KEY ||
    env.OPENAI_API_KEY ||
    env.ANTHROPIC_API_KEY ||
    env.GEMINI_API_KEY ||
    '',
  messages: []
});
