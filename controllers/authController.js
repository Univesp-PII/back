const authService = require('../services/authService');

function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    console.info(`[atividade] ${new Date().toISOString()} login recusado motivo=dados_invalidos`);
    return res.status(400).json({ message: 'Informe email e senha.' });
  }

  const user = authService.login(email, password);

  if (!user) {
    console.info(`[atividade] ${new Date().toISOString()} login recusado`);
    return res.status(401).json({ message: 'Email ou senha inválidos.' });
  }

  console.info(`[atividade] ${new Date().toISOString()} login realizado userId=${user.id}`);
  return res.status(200).json({
    message: 'Login realizado com sucesso.',
    user
  });
}

module.exports = { login };