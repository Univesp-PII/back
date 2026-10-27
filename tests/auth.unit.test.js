const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

jest.mock('pg', () => {
  const poolInstance = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn()
  };

  return {
    Pool: jest.fn(() => poolInstance)
  };
});

const { signToken, verifyToken } = require('../utils/jwt');
const authenticateToken = require('../middleware/authenticateToken');
const authController = require('../controllers/authController');
const authService = require('../services/authService');
const pool = require('../database/pool');
const { Pool } = require('pg');

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

describe('JWT e autenticação', () => {
  test('JWT gera e valida token corretamente', () => {
    const payload = { id: 1, nome: 'Porteiro', email: 'porteiro@email.com' };
    const token = signToken(payload);

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.nome).toBe(payload.nome);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.iss).toBe('receba-pii-api');
  });

  test('middleware rejeita requisição sem token', () => {
    const req = { headers: {} };
    const res = createRes();

    const next = jest.fn(() => {
      throw new Error('next() não deveria ser chamado');
    });

    const result = authenticateToken(req, res, next);

    expect(result.statusCode).toBe(401);
    expect(result.body).toEqual({ message: 'Token de autenticação ausente.' });
  });

  test('middleware aceita token válido e preenche req.user', () => {
    const token = signToken({ id: 7, nome: 'Teste', email: 'teste@email.com' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user.id).toBe(7);
    expect(req.user.nome).toBe('Teste');
    expect(req.headers['x-user-name']).toBe('Teste');
  });
});

describe('Login', () => {
  test('login rejeita dados incompletos', async () => {
    const req = { body: { email: '', password: '' } };
    const res = createRes();

    await authController.login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: 'Informe email e senha.' });
  });

  test('login retorna 401 para credenciais inválidas', async () => {
    const original = authService.login;
    authService.login = jest.fn(async () => null);

    const req = { body: { email: 'erro@email.com', password: 'x' } };
    const res = createRes();

    try {
      await authController.login(req, res);
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ message: 'Email ou senha inválidos.' });
    } finally {
      authService.login = original;
    }
  });

  test('login retorna 200 com token e dados do usuário', async () => {
    const original = authService.login;
    authService.login = jest.fn(async () => ({
      id: 10,
      nome: 'Porteiro',
      email: 'porteiro@email.com',
      token: signToken({ id: 10, nome: 'Porteiro', email: 'porteiro@email.com' })
    }));

    const req = { body: { email: 'porteiro@email.com', password: '123456' } };
    const res = createRes();

    try {
      await authController.login(req, res);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login realizado com sucesso.');
      expect(res.body.user.email).toBe('porteiro@email.com');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.length).toBeGreaterThan(20);
    } finally {
      authService.login = original;
    }
  });
});

describe('authService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.PGSSL = 'true';
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.PGSSL;
  });

  test('retorna null quando usuário não existe', async () => {
    pool.query = jest.fn().mockResolvedValue({ rows: [] });

    const result = await authService.login('naoexiste@email.com', '123');

    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id, nome, email, senha_hash FROM porteiros WHERE LOWER(email) = $1',
      ['naoexiste@email.com']
    );
  });

  test('retorna null quando a senha não bate', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ id: 2, nome: 'Porteiro', email: 'porteiro@email.com', senha_hash: 'hash' }]
    });

    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    const result = await authService.login('porteiro@email.com', 'errada');

    expect(result).toBeNull();
    expect(bcrypt.compare).toHaveBeenCalledWith('errada', 'hash');
  });

  test('retorna usuário com token quando login é válido', async () => {
    pool.query = jest.fn().mockResolvedValue({
      rows: [{ id: 3, nome: 'Porteiro', email: 'porteiro@email.com', senha_hash: 'hash' }]
    });

    const bcrypt = require('bcryptjs');
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await authService.login('porteiro@email.com', '123456');

    expect(result).toMatchObject({
      id: 3,
      nome: 'Porteiro',
      email: 'porteiro@email.com'
    });
    expect(result.token).toEqual(expect.any(String));
    expect(result.token.length).toBeGreaterThan(20);
  });
});

describe('database/pool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.DATABASE_URL;
    delete process.env.PGSSL;
  });

  test('lança erro quando DATABASE_URL não está definida', () => {
    jest.resetModules();
    const dbPool = require('../database/pool');

    expect(() => dbPool.query('SELECT 1')).toThrow('DATABASE_URL não está configurada');
  });

  test('cria pool com ssl quando PGSSL=true e executa query', async () => {
    jest.resetModules();
    process.env.DATABASE_URL = 'postgresql://user:pass@host:5432/db';
    process.env.PGSSL = 'true';

    const { Pool } = require('pg');
    const dbPool = require('../database/pool');

    await dbPool.query('SELECT 1', [1]);

    expect(Pool).toHaveBeenCalledWith({
      connectionString: 'postgresql://user:pass@host:5432/db',
      ssl: { rejectUnauthorized: false }
    });
  });

});
