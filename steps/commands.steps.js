import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { handleCommand } from '../src/commands.js';

Given('um estado com mensagens existentes', function () {
  this.state = { provider: 'auto', model: 'base', apiKey: '', messages: [{ role: 'user', content: 'x' }] };
  this.deps = {
    logLine: () => {},
    updateHeader: () => {},
    clearChat: () => {},
    exit: () => {}
  };
});

When('executo o comando {string}', function (command) {
  handleCommand(command, this.state, this.deps);
});

Then('o histórico deve ficar vazio', function () {
  assert.equal(this.state.messages.length, 0);
});

Then('o modelo ativo deve ser {string}', function (model) {
  assert.equal(this.state.model, model);
});
