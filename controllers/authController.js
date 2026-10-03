const authService = require('../services/authService');

function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({ message: 'Informe email e senha.' });
  }

  const user = authService.login(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos.' });
  }

  return res.status(200).json({
    message: 'Login realizado com sucesso.',
    user
  });
}

module.exports = { login };