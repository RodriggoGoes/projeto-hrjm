const mongoose = require('mongoose');


const MedicoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  crm: { type: String, required: true, unique: true },
  especialidade: { type: String, required: true },
  telefone: { type: String },
  email: { type: String }
});


module.exports = mongoose.model('Medico', MedicoSchema);
