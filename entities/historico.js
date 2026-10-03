function criarHistorico(dados, id = dados.id) {
  return {
    ...dados,
    id,
    cod: dados.cod || dados.codigo || '',
    morador_nome: dados.morador_nome || dados.nomeMorador || '',
    porteiro_nome: dados.porteiro_nome || dados.porteiroRegistro || '',
    porteiro_retirada: dados.porteiro_retirada || dados.retirada_porteiro_nome || dados.porteiroRetirada || '',
    status: dados.status || 'pendente',
    data_registro: dados.data_registro || dados.dataRegistro || new Date().toISOString(),
    data_retirada: dados.data_retirada || dados.dataRetirada || ''
  };
}

module.exports = { criarHistorico };