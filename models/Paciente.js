const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
  nome: {
     type: String, 
     required: true 
    },
    cartaoSus: {
      type: String,
      required: true,
      unique: true 
    },
  cpf: { 
    type: String, 
    required: true, 
    unique: true 
  },
  data_nascimento: { 
    type: Date, 
    required: true 
  },
  sexo: { 
    type: String, 
    required: true 
  },
  endereco: { 
    type: String 
  },
  telefone: { 
    type: String 
  }
});

module.exports = mongoose.model('Paciente', PacienteSchema);
