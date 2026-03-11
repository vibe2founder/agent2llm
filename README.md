# agent2llm

Agente de programação em **CLI com TUI** usando a biblioteca [`llm2router` / `@purecore/one-llm-4-all`](https://github.com/vibe2founder/llm2router).

## Requisitos

- Node.js 20+

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

## Testes (TDD + BDD)

### TDD (unit tests com Vitest)

```bash
npm run test:tdd
```

### BDD (cenários Gherkin com Cucumber)

```bash
npm run test:bdd
```

### Suite completa

```bash
npm test
```


## Segurança

- Consulte [`SECURITY.md`](./SECURITY.md) para política de segurança e lista de possíveis brechas + mitigação.
- A CLI sanitiza texto de entrada/saída para reduzir risco de sequências ANSI maliciosas.
- O CI inclui auditoria de dependências (`npm audit --audit-level=high`) e análise estática com CodeQL.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): roda lint + testes TDD e BDD em pull requests e pushes para `main`.
- **CD** (`.github/workflows/release.yml`): publica no npm quando uma tag semântica `v*.*.*` é enviada.

## Observação

Quando `provider=auto`, a biblioteca tenta selecionar o provedor automaticamente.
