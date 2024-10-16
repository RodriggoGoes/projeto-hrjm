

const Agendamento = require('../models/Agendamento');
const Paciente = require('../models/Paciente');


exports.adicionarPacienteOuAgendamento = async (req, res) => {
  try {
    const { pacienteId, data, causa } = req.body;
    console.log('Dados recebidos:', req.body);

    if (!pacienteId || !data || !causa) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });

    }

    // Verificar se o paciente existe
    const paciente = await Paciente.findById(pacienteId);
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    // Criar o agendamento
    const novoAgendamento = new Agendamento({
      paciente: pacienteId,
      data: new Date(data),
      causa,
      status: 'agendado',
    });

    await novoAgendamento.save();
    res.status(201).json({ message: 'Agendamento criado com sucesso.', agendamento: novoAgendamento });

  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    res.status(500).json({ message: 'Erro ao criar agendamento.' });
  }
};

// Obter todos os agendamentos com informações dos pacientes
exports.obterAgendamentos = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find()
      .populate('paciente', 'nome cpf cartaoSus')
      .sort({ data: 1 });

    res.status(200).json(agendamentos);
  } catch (err) {
    console.error('Erro ao obter agendamentos:', err);
    res.status(500).json({ message: 'Erro ao obter agendamentos' });
  }
};

