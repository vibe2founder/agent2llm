# Security Policy

## Reportar vulnerabilidades

Abra uma issue privada ou entre em contato com os mantenedores com:
- descrição da falha,
- impacto,
- passos para reproduzir,
- sugestão de mitigação.

## Proteções implementadas

- Sanitização de texto de entrada/saída na TUI para reduzir risco de escape/control chars no terminal.
- Validação de `provider` e `model` nos comandos de sessão.
- Auditoria de dependências em CI (`npm audit --audit-level=high`).
- Code scanning com CodeQL.
- Atualizações automáticas de dependências com Dependabot.

## Possíveis brechas e correções recomendadas

1. **Injeção de sequências de controle ANSI no terminal**
   - **Risco**: resposta do LLM pode incluir escapes que alteram terminal/log.
   - **Mitigação**: sanitizar saída removendo ANSI/control chars (já aplicado).

2. **Uso de provider/model inválidos para bypass de regras de execução**
   - **Risco**: entradas inesperadas podem quebrar fluxo ou forçar fallback inseguro.
   - **Mitigação**: whitelist de providers e regex de model (já aplicado).

3. **Exposição de API keys em logs/histórico**
   - **Risco**: vazamento em shell history, CI logs, gravações de sessão.
   - **Mitigação**: não exibir segredo em logs; preferir variáveis de ambiente e secret managers; nunca commitar `.env`.

4. **Dependências vulneráveis**
   - **Risco**: exploração via cadeia de suprimentos (supply chain).
   - **Mitigação**: rodar `npm audit`, ativar Dependabot e atualizar lockfile regularmente (já aplicado parcialmente).

5. **Publicação indevida no pipeline de release**
   - **Risco**: pacote malicioso publicado por workflow alterado.
   - **Mitigação**: proteger branch/tag, exigir reviews, limitar permissões do workflow, usar ambientes protegidos.

6. **Prompt injection retornando instruções inseguras ao usuário**
   - **Risco**: o agente pode sugerir comandos destrutivos.
   - **Mitigação**: adicionar camada de policy para bloquear comandos perigosos, exigir confirmação explícita para ações destrutivas.

7. **DoS por prompts/respostas muito grandes**
   - **Risco**: consumo excessivo de memória/render na TUI.
   - **Mitigação**: truncar texto e limitar tamanho de histórico/contexto (truncamento de texto já aplicado; limite de histórico recomendado para próxima iteração).
