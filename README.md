# agent2llm

Agente de programação em **CLI com TUI** usando a biblioteca [`llm2router` / `@purecore/one-llm-4-all`](https://github.com/vibe2founder/llm2router).

## Requisitos

- Node.js 18+

## Instalação

```bash
npm install
```

## Executar

```bash
npm start
```

Ou direto pelo binário local:

```bash
npx agent2llm
```

## Configuração

Você pode definir variáveis de ambiente:

- `LLM_PROVIDER` (ex: `auto`, `groq`, `openai`, `ollama`)
- `LLM_MODEL` (ex: `llama-3.1-8b-instant`)
- `LLM_API_KEY` (ou `GROQ_API_KEY`, `OPENAI_API_KEY`, etc.)

Exemplo:

```bash
LLM_PROVIDER=groq LLM_MODEL=llama-3.1-8b-instant GROQ_API_KEY=sua_chave npm start
```

## Comandos no TUI

- `/help` mostra ajuda
- `/provider <nome>` troca provedor
- `/model <nome>` troca modelo
- `/apikey <chave>` define chave na sessão
- `/clear` limpa histórico de conversa
- `/exit` sai da aplicação
- `q` ou `Ctrl+C` também encerram

## Observação

Quando `provider=auto`, a biblioteca tenta selecionar o provedor automaticamente.
