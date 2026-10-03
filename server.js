const cors = require('cors');
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`API Receba disponível em http://localhost:${port}`);
});