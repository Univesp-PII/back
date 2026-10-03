function criarMorador(dados, id = dados.id) {
  const nome = dados.nomeMorador || dados.nome || '';
  const bloco = dados.blocoMorador || dados.bloco || '';
  const apartamento = dados.apartamento || dados.unidade || '';
  const telefone = dados.telefoneMorador || dados.telefone || '';

  return {
    ...dados,
    id,
    nome,
    nomeMorador: nome,
    bloco,
    blocoMorador: bloco,
    apartamento,
    unidade: apartamento,
    telefone,
    telefoneMorador: telefone
  };
}

module.exports = { criarMorador };