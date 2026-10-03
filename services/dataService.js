const data = require('../mocks');
const entities = {
  morador: require('../entities/morador'),
  encomenda: require('../entities/encomenda'),
  historico: require('../entities/historico')
};

function list(resource) {
  return data[resource];
}

function findById(resource, id) {
  return data[resource].find((item) => String(item.id) === String(id)) || null;
}

function create(resource, values) {
  const nextId = data[resource].reduce((largestId, item) => {
    return Math.max(largestId, Number(item.id) || 0);
  }, 0) + 1;

  const item = entities[resource][`criar${resource[0].toUpperCase()}${resource.slice(1)}`](values, values.id ?? nextId);
  data[resource].push(item);
  return item;
}

function update(resource, id, values) {
  const index = data[resource].findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    return null;
  }

  const updated = { ...data[resource][index], ...values, id: data[resource][index].id };
  data[resource][index] = entities[resource][`criar${resource[0].toUpperCase()}${resource.slice(1)}`](updated, updated.id);
  return data[resource][index];
}

function remove(resource, id) {
  const index = data[resource].findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    return false;
  }

  data[resource].splice(index, 1);
  return true;
}

module.exports = { list, findById, create, update, remove };