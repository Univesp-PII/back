const dataService = require('../services/dataService');
const logActivity = require('../utils/activityLogger');

const resourceNames = {
  morador: { singular: 'morador', plural: 'moradores' },
  encomenda: { singular: 'encomenda', plural: 'encomendas' },
  historico: { singular: 'registro do histórico', plural: 'histórico' }
};

function createDataController(resource) {
  const names = resourceNames[resource];

  return {
    async list(req, res) {
      const items = await dataService.list(resource);
      logActivity(`listou ${names.plural} quantidade=${items.length}`, req.get('X-User-Name'));

      return res.status(200).json({
        data: items,
        message: 'Dados carregados com sucesso.'
      });
    },

    async findById(req, res) {
      const item = await dataService.findById(resource, req.params.id);

      if (!item) {
        logActivity(`consultou ${names.singular} id=${req.params.id} resultado=nao_encontrado`, req.get('X-User-Name'));
        return res.status(404).json({ message: 'Registro não encontrado.' });
      }

      logActivity(`consultou ${names.singular} id=${item.id}`, req.get('X-User-Name'));
      return res.status(200).json({ data: item, message: 'Registro carregado com sucesso.' });
    },

    async create(req, res) {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ message: 'Envie os dados do registro em JSON.' });
      }

      const item = await dataService.create(resource, req.body);
      logActivity(`cadastrou ${names.singular} id=${item.id}`, req.get('X-User-Name'));
      return res.status(201).json({ data: item, message: 'Registro cadastrado com sucesso.' });
    },

    async update(req, res) {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ message: 'Envie os dados do registro em JSON.' });
      }

      const previousItem = await dataService.findById(resource, req.params.id);
      const item = await dataService.update(resource, req.params.id, req.body);

      if (!item) {
        logActivity(`tentou atualizar ${names.singular} id=${req.params.id} resultado=nao_encontrado`, req.get('X-User-Name'));
        return res.status(404).json({ message: 'Registro não encontrado.' });
      }

      const registrouRetirada = resource === 'encomenda'
        && String(previousItem.status || '').toLowerCase() !== 'retirada'
        && String(item.status || '').toLowerCase() === 'retirada';

      if (registrouRetirada) {
        logActivity(`registrou retirada encomenda id=${item.id}`, req.get('X-User-Name'));
      } else {
        logActivity(`atualizou ${names.singular} id=${item.id}`, req.get('X-User-Name'));
      }

      return res.status(200).json({ data: item, message: 'Registro atualizado com sucesso.' });
    },

    async remove(req, res) {
      const removed = await dataService.remove(resource, req.params.id);

      if (!removed) {
        logActivity(`tentou remover ${names.singular} id=${req.params.id} resultado=nao_encontrado`, req.get('X-User-Name'));
        return res.status(404).json({ message: 'Registro não encontrado.' });
      }

      logActivity(`removeu ${names.singular} id=${req.params.id}`, req.get('X-User-Name'));
      return res.status(200).json({ message: 'Registro removido com sucesso.' });
    }
  };
}

module.exports = { createDataController };