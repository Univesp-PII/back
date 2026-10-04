require('dotenv').config();

const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const moradorRoutes = require('./routes/moradorRoutes');
const encomendaRoutes = require('./routes/encomendaRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const requestLogger = require('./middleware/requestLogger');
const pool = require('./database/pool');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/morador', moradorRoutes);
app.use('/api/encomenda', encomendaRoutes);
app.use('/api/historico', historicoRoutes);
app.use((error, req, res, next) => {
  console.error('Erro ao processar requisição:', error.message);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

async function start() {
  await pool.checkConnection();
  return app.listen(port, () => {
    console.log(`API Receba disponível em http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error(`Não foi possível iniciar a API: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = { app, start };