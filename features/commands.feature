Feature: Comandos da CLI
  Como usuário da TUI
  Quero usar comandos de sessão
  Para controlar modelo, provider e histórico

  Scenario: Limpar histórico
    Given um estado com mensagens existentes
    When executo o comando "/clear"
    Then o histórico deve ficar vazio

  Scenario: Alterar modelo
    Given um estado com mensagens existentes
    When executo o comando "/model llama-3.3-70b"
    Then o modelo ativo deve ser "llama-3.3-70b"
