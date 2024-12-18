const Paciente = require('../models/Paciente');

// 1. Criar paciente
exports.adicionarPaciente = async (req, res) => {
  try {
    const { nome, cpf, cartaoSus, sexo, data_nascimento } = req.body;

    // Verificar se o paciente já existe
    const pacienteExistente = await Paciente.findOne({ cpf });
    if (pacienteExistente) {
      return res.status(400).json({ message: 'Paciente já existe!' });
    }

    // Criar novo paciente
    const novoPaciente = new Paciente({
      nome,
      cpf,
      cartaoSus: cartaoSus,
      sexo,
      data_nascimento,
    });

    await novoPaciente.save();
    res.status(201).json({
      message: 'Paciente adicionado com sucesso!',
      paciente: novoPaciente,
    });
  } catch (err) {
    console.error('Erro ao salvar paciente:', err);
    res.status(500).json({ message: 'Erro ao salvar paciente.' });
  }
};

// 2. Obter paciente pelo CPF
exports.obterPacientePorCpf = async (req, res) => {
  try {
    const { cpf } = req.params;
    const paciente = await Paciente.findOne({ cpf });
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }
    res.status(200).json(paciente);
  } catch (err) {
    console.error('Erro ao buscar paciente:', err);
    res.status(500).json({ message: 'Erro ao buscar paciente.' });
  }
};

// 3. Obter todos os pacientes
exports.obterPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.status(200).json(pacientes);
  } catch (err) {
    console.error('Erro ao obter pacientes:', err);
    res.status(500).json({ message: 'Erro ao obter pacientes.' });
  }
};
