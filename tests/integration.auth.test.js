const request = require('supertest');
const { app } = require('../server');
const authService = require('../services/authService');
const dataService = require('../services/dataService');

jest.mock('../services/authService', () => ({
  login: jest.fn()
}));

jest.mock('../services/dataService', () => ({
  list: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}));

describe('Integração de autenticação JWT', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/login retorna 200 e token JWT', async () => {
    authService.login.mockResolvedValue({
      id: 4,
      nome: 'Porteiro Teste',
      email: 'porteiro@test.com',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibm9tZSI6IlBvcnRlaXJvIFRlc3RlIiwiZW1haWwiOiJwb3J0ZWlyb0Wd0ZXN0LmNvbSJ9.signature'
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'porteiro@test.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login realizado com sucesso.');
    expect(response.body.user.email).toBe('porteiro@test.com');
    expect(response.body.token).toEqual(expect.any(String));
  });

  test('GET /api/morador sem token retorna 401', async () => {
    const response = await request(app).get('/api/morador');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token de autenticação ausente.');
  });

  test('GET /api/morador com token válido retorna 200', async () => {
    dataService.list.mockResolvedValue([]);

    const token = require('../utils/jwt').signToken({ id: 9, nome: 'Teste', email: 'teste@email.com' });

    const response = await request(app)
      .get('/api/morador')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.message).toBe('Dados carregados com sucesso.');
  });
});
