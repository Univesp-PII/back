const bcrypt = require('bcryptjs');
const pool = require('../database/pool');

async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query(
    'SELECT id, nome, email, senha_hash FROM porteiros WHERE LOWER(email) = $1',
    [normalizedEmail]
  );
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.senha_hash))) {
    return null;
  }

  return { id: user.id, nome: user.nome, email: user.email };
}

module.exports = { login };