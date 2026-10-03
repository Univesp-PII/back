const authService = require('../services/authService');
const logActivity = require('../utils/activityLogger');

function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    logActivity('login recusado motivo=dados_invalidos');
    return res.status(400).json({ message: 'Informe email e senha.' });
  }

  const user = authService.login(email, password);

  if (!user) {
    logActivity('login recusado');
    return res.status(401).json({ message: 'Email ou senha inválidos.' });
  }

  logActivity(`login realizado userId=${user.id}`, user.nome);
  return res.status(200).json({
    message: 'Login realizado com sucesso.',
    user
  });
}

module.exports = { login };