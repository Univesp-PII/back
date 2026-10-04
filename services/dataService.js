const pool = require('../database/pool');
const entities = {
  morador: require('../entities/morador'),
  encomenda: require('../entities/encomenda'),
  historico: require('../entities/historico')
};

const resources = {
  morador: {
    table: 'moradores',
    fields: {
      nomeMorador: 'nome',
      blocoMorador: 'bloco',
      apartamento: 'apartamento',
      telefoneMorador: 'telefone'
    },
    entity: entities.morador.criarMorador
  },
  encomenda: {
    table: 'encomendas',
    fields: {
      moradorId: 'morador_id',
      codigo: 'codigo',
      empresa: 'empresa',
      entregador: 'entregador',
      nomeMorador: 'nome_morador',
      blocoMorador: 'bloco_morador',
      apartamento: 'apartamento',
      status: 'status',
      dataRegistro: 'data_registro',
      dataRetirada: 'data_retirada',
      porteiroRegistro: 'porteiro_registro',
      porteiroRetirada: 'porteiro_retirada'
    },
    entity: entities.encomenda.criarEncomenda
  },
  historico: {
    table: 'historico',
    fields: {
      cod: 'cod',
      empresa: 'empresa',
      entregador: 'entregador',
      morador_nome: 'morador_nome',
      porteiro_nome: 'porteiro_nome',
      retirada_porteiro_nome: 'retirada_porteiro_nome',
      porteiro_retirada: 'porteiro_retirada',
      status: 'status',
      data_registro: 'data_registro',
      data_retirada: 'data_retirada'
    },
    entity: entities.historico.criarHistorico
  }
};

function getResource(resource) {
  const config = resources[resource];

  if (!config) {
    throw new Error(`Recurso não suportado: ${resource}`);
  }

  return config;
}

function mapRow(resource, row) {
  const config = getResource(resource);
  const values = { id: row.id };

  for (const [property, column] of Object.entries(config.fields)) {
    values[property] = row[column];
  }

  return config.entity(values, row.id);
}

function normalizeValue(property, value) {
  const nullableProperties = ['moradorId', 'dataRetirada', 'data_retirada'];
  return value === '' && nullableProperties.includes(property) ? null : value;
}

async function list(resource) {
  const config = getResource(resource);
  const result = await pool.query(`SELECT * FROM ${config.table} ORDER BY id`);
  return result.rows.map((row) => mapRow(resource, row));
}

async function findById(resource, id) {
  const config = getResource(resource);
  const result = await pool.query(`SELECT * FROM ${config.table} WHERE id = $1`, [id]);
  return result.rows[0] ? mapRow(resource, result.rows[0]) : null;
}

async function create(resource, values) {
  const config = getResource(resource);
  const normalized = config.entity(values, values.id);
  const properties = Object.keys(config.fields).filter((property) => normalized[property] !== undefined);
  const columns = properties.map((property) => config.fields[property]);
  const parameters = properties.map((property) => normalizeValue(property, normalized[property]));

  if (values.id !== undefined) {
    columns.unshift('id');
    parameters.unshift(values.id);
  }

  const placeholders = parameters.map((_, index) => `$${index + 1}`);
  const query = columns.length
    ? `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
    : `INSERT INTO ${config.table} DEFAULT VALUES RETURNING *`;
  const result = await pool.query(query, parameters);
  return mapRow(resource, result.rows[0]);
}

async function update(resource, id, values) {
  const config = getResource(resource);
  const normalized = config.entity(values, id);
  const properties = Object.keys(config.fields).filter((property) => normalized[property] !== undefined);

  if (properties.length === 0) {
    return findById(resource, id);
  }

  const assignments = properties.map((property, index) => `${config.fields[property]} = $${index + 1}`);
  const parameters = properties.map((property) => normalizeValue(property, normalized[property]));
  parameters.push(id);

  const result = await pool.query(
    `UPDATE ${config.table} SET ${assignments.join(', ')} WHERE id = $${parameters.length} RETURNING *`,
    parameters
  );

  return result.rows[0] ? mapRow(resource, result.rows[0]) : null;
}

async function remove(resource, id) {
  const config = getResource(resource);
  const result = await pool.query(`DELETE FROM ${config.table} WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { list, findById, create, update, remove };