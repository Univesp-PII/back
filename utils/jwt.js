const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'receba-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'receba-pii-api'
  });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'receba-pii-api'
  });
}

module.exports = { signToken, verifyToken };
