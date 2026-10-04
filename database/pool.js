const { Pool } = require('pg');

let pool;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não está configurada. Copie .env.example para .env e preencha a connection string.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined
    });

    pool.on('error', (error) => {
      console.error('Erro inesperado no pool PostgreSQL:', error.message);
    });
  }

  return pool;
}

module.exports = {
  query(text, parameters) {
    return getPool().query(text, parameters);
  },
  checkConnection() {
    return getPool().query('SELECT 1');
  },
  close() {
    return pool?.end();
  }
};