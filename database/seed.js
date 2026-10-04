require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('./pool');
const users = require('../mocks/users');
const moradores = require('../mocks/moradores');
const encomendas = require('../mocks/encomendas');
const historico = require('../mocks/historico');

async function seed() {
  for (const user of users) {
    const senhaHash = await bcrypt.hash(user.password, 10);
    await pool.query(
      'INSERT INTO porteiros (id, nome, email, senha_hash) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [user.id, user.nome, user.email.toLowerCase(), senhaHash]
    );
  }

  for (const resident of moradores) {
    await pool.query(
      'INSERT INTO moradores (id, nome, bloco, apartamento, telefone) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
      [resident.id, resident.nomeMorador, resident.blocoMorador, resident.apartamento, resident.telefoneMorador]
    );
  }

  for (const packageItem of encomendas) {
    const resident = moradores.find((item) => item.nomeMorador === packageItem.nomeMorador
      && item.blocoMorador === packageItem.blocoMorador
      && item.apartamento === packageItem.apartamento);

    await pool.query(
      `INSERT INTO encomendas (
        id, morador_id, codigo, empresa, entregador, nome_morador,
        bloco_morador, apartamento, status, data_registro, data_retirada
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT DO NOTHING`,
      [packageItem.id, resident?.id || null, packageItem.codigo, packageItem.empresa,
        packageItem.entregador, packageItem.nomeMorador, packageItem.blocoMorador,
        packageItem.apartamento, packageItem.status, packageItem.dataRegistro,
        packageItem.dataRetirada || null]
    );
  }

  for (const historyItem of historico) {
    await pool.query(
      `INSERT INTO historico (
        id, cod, empresa, entregador, morador_nome, porteiro_nome,
        retirada_porteiro_nome, porteiro_retirada, status, data_registro, data_retirada
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT DO NOTHING`,
      [historyItem.id, historyItem.cod, historyItem.empresa, historyItem.entregador,
        historyItem.morador_nome, historyItem.porteiro_nome,
        historyItem.retirada_porteiro_nome, historyItem.porteiro_retirada,
        historyItem.status, historyItem.data_registro, historyItem.data_retirada || null]
    );
  }

  for (const table of ['porteiros', 'moradores', 'encomendas', 'historico']) {
    await pool.query(
      `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), EXISTS (SELECT 1 FROM ${table}))`,
      [table]
    );
  }

  console.log('Dados de demonstração inseridos sem sobrescrever registros existentes.');
}

seed()
  .catch((error) => {
    console.error(`Falha ao carregar dados de demonstração: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => pool.close());