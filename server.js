const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const moradorRoutes = require('./routes/moradorRoutes');
const encomendaRoutes = require('./routes/encomendaRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const port = 8000;

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/morador', moradorRoutes);
app.use('/api/encomenda', encomendaRoutes);
app.use('/api/historico', historicoRoutes);

app.listen(port, () => {
  console.log(`API Receba disponível em http://localhost:${port}`);
});