const mongoose = require('mongoose');

const atendimentoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
  status: {
    type: String,
    enum: ['aguardando triagem', 'triagem em andamento', 'atendido', 'aguardando atendimento médico'],
    default: 'aguardando triagem',
  },
  triagem: {
    peso: String,
    altura: String,
    saturacao: String,
    alergias: String,
    FC: String,
    FR: String,
    temperatura: String,
    HAS: Boolean,
    DM: Boolean,
  },
});

module.exports = mongoose.model('Atendimento', atendimentoSchema);
