const { verifyToken } = require('../utils/jwt');

function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice(7).trim()
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação ausente.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    req.headers['x-user-name'] = decoded.nome || decoded.email || req.headers['x-user-name'];
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authenticateToken;
