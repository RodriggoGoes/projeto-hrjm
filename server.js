require('dotenv').config();
console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/hospitalDB')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes); 

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

