

const mongoose = require('mongoose');

const AgendamentoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  data: { type: Date, required: true },
  causa: { type: String, required: true },
  status: { type: String, default: 'agendado' },
});

module.exports = mongoose.model('Agendamento', AgendamentoSchema);
