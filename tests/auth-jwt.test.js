const test = require('node:test');
const assert = require('node:assert/strict');

const { signToken, verifyToken } = require('../utils/jwt');

test('gera e valida JWT com dados do porteiro', () => {
  const payload = { id: 1, nome: 'Porteiro', email: 'porteiro@teste.com' };
  const token = signToken(payload);

  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
  assert.deepEqual(verifyToken(token), {
    ...payload,
    iat: verifyToken(token).iat,
    exp: verifyToken(token).exp,
    iss: 'receba-pii-api'
  });
});
