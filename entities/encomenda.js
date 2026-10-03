function criarEncomenda(dados, id = dados.id) {
  const nomeMorador = dados.nomeMorador || dados.nome || dados.destinatario || '';
  const blocoMorador = dados.blocoMorador || dados.bloco || '';
  const apartamento = dados.apartamento || dados.unidade || '';

  return {
    ...dados,
    id,
    nome: nomeMorador,
    nomeMorador,
    destinatario: dados.destinatario || nomeMorador,
    bloco: blocoMorador,
    blocoMorador,
    apartamento,
    unidade: apartamento,
    status: dados.status || 'pendente',
    dataRegistro: dados.dataRegistro || new Date().toISOString(),
    dataRetirada: dados.dataRetirada || ''
  };
}

module.exports = { criarEncomenda };