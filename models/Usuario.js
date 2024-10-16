const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,  
    default: 'user',
  },
  data_criacao: {
    type: Date,
    default: Date.now,
  }
});


UsuarioSchema.pre('save', async function (next) {
  const usuario = this;
  if (usuario.isModified('senha')) {
    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(usuario.senha, salt);
  }
  next();
});


UsuarioSchema.methods.compararSenha = async function (senha) {
  return await bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
