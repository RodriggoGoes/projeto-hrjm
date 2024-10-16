const mongoose = require('mongoose');

const TriagemSchema = new mongoose.Schema({
  peso: Number,
  altura: Number,
  saturacao: Number,
  alergias: String,
  FC: Number, 
  FR: Number,
  temperatura: Number,
  HAS: Boolean, 
  DM: Boolean 
});

const AtendimentoMedicoSchema = new mongoose.Schema({
  queixas: String,
  diagnostico: String,
  prescricao: String,
  observacoes: String
});

// Adicionar a estrutura de exames complementares
const ExamesComplementaresSchema = new mongoose.Schema({
  raioX: { type: Boolean, default: false },
  ultrassonografia: { type: Boolean, default: false },
  exameSangue: { type: Boolean, default: false },
  ecg: { type: Boolean, default: false },
  exameUrina: { type: Boolean, default: false },
  tomografia: { type: Boolean, default: false },
  dextro: { type: Boolean, default: false }
});

const AtendimentoSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico' },
  triagem: TriagemSchema,
  atendimento_medico: AtendimentoMedicoSchema,
  exames_complementares: ExamesComplementaresSchema, // Novos exames complementares
  status: { type: String, enum: ['pronto para atendimento', 'atendido'], default: 'pronto para atendimento' },
  data_atendimento: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Atendimento', AtendimentoSchema);
