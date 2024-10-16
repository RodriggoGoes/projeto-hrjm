const Paciente = require('../models/Paciente');
const Agendamento = require('../models/Agendamento'); // Model de Agendamento

// Adicionar novo paciente
exports.adicionarPaciente = async (req, res) => {
  console.log('Dados recebidos:', req.body);
  try {
    const { nome, cpf, cartao_sus, sexo, data_nascimento } = req.body;

    // Verificar se o paciente já existe
    const pacienteExistente = await Paciente.findOne({ cpf });
    if (pacienteExistente) {
      return res.status(400).json({ message: 'Paciente já existe!' });
    }

    // Criar novo paciente
    const novoPaciente = new Paciente({
      nome,
      cpf,
      cartaoSus: cartao_sus,
      sexo,
      data_nascimento,
    });
    await novoPaciente.save();

    // Criar agendamento para o novo paciente
    const novoAgendamento = new Agendamento({
      paciente: novoPaciente._id,
      status: 'agendado',
      data: new Date(), 
    });
    await novoAgendamento.save();

    res.status(201).json({ paciente: novoPaciente });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar paciente');
  }
};

// Obter paciente pelo CPF
exports.obterPacientePorCpf = async (req, res) => {
  const { cpf } = req.params;

  try {
    const paciente = await Paciente.findOne({ cpf });
    if (paciente) {
      return res.status(200).json(paciente); 
    }
    return res.status(404).json({ message: 'Paciente não encontrado.' }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar paciente.');
  }
};

// Obter paciente por ID
exports.obterPacientePorId = async (req, res) => {
  const { id } = req.params;

  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }
    res.status(200).json(paciente);
  } catch (err) {
    console.error('Erro ao obter paciente:', err);
    res.status(500).json({ message: 'Erro ao buscar paciente.' });
  }
};


exports.adicionarPacienteEAgendar = async (req, res) => {
  try {
    const { nome, cpf, cartao_sus, sexo, data_nascimento, causa } = req.body;

    // Criar novo paciente
    const novoPaciente = new Paciente({
      nome,
      cpf,
      cartaoSus: cartao_sus,
      sexo,
      data_nascimento,
    });
    await novoPaciente.save();

    // Criar agendamento para o novo paciente
    const novoAgendamento = new Agendamento({
      paciente: novoPaciente._id,
      status: 'agendado', 
      data: new Date(),
      causa,
    });
    await novoAgendamento.save();

    res.status(201).json({ paciente: novoPaciente, agendamento: novoAgendamento });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar paciente ou criar agendamento');
  }
};

// Obter todos os pacientes
exports.obterPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find(); 
    res.status(200).json(pacientes); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao obter pacientes.'); 
  }
};
