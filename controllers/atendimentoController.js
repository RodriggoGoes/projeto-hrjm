const Atendimento = require('../models/Atendimento');
const Agendamento = require('../models/Agendamento'); 
const Paciente = require('../models/Paciente');

// Criar novo atendimento 
exports.criarAtendimento = async (req, res) => {
  try {
    const { paciente, medico, triagem, atendimento_medico, exames_complementares } = req.body;

    const novoAtendimento = new Atendimento({
      paciente,
      medico,
      triagem: {
        peso: triagem.peso,
        altura: triagem.altura,
        saturacao: triagem.saturacao,
        alergias: triagem.alergias,
        FC: triagem.FC,
        FR: triagem.FR,
        temperatura: triagem.temperatura,
        HAS: triagem.HAS,
        DM: triagem.DM,
      },
      atendimento_medico,
      exames_complementares: {
        raioX: exames_complementares.raioX || false,
        ultrassonografia: exames_complementares.ultrassonografia || false,
        exameSangue: exames_complementares.exameSangue || false,
        ecg: exames_complementares.ecg || false,
        exameUrina: exames_complementares.exameUrina || false,
        tomografia: exames_complementares.tomografia || false,
        dextro: exames_complementares.dextro || false,
      },
    });

    await novoAtendimento.save();
    res.status(201).json(novoAtendimento);
  } catch (err) {
    console.error('Erro ao salvar atendimento:', err);
    res.status(500).json({ message: 'Erro ao salvar atendimento' });
  }
};

// Criar triagem e alterar status para "aguardando atendimento médico"
exports.criarTriagem = async (req, res) => {
  try {
    const { paciente, triagem } = req.body;

    if (!paciente || !triagem) {
      return res.status(400).json({ message: 'Paciente e dados da triagem são obrigatórios.' });
    }

    const novoAtendimento = new Atendimento({
      paciente,
      triagem: {
        peso: triagem.peso,
        altura: triagem.altura,
        saturacao: triagem.saturacao,
        alergias: triagem.alergias,
        FC: triagem.FC,
        FR: triagem.FR,
        temperatura: triagem.temperatura,
        HAS: triagem.HAS,
        DM: triagem.DM,
      },
      status: 'aguardando atendimento médico',
    });

    await novoAtendimento.save();

    // Atualizar o status do agendamento para "aguardando atendimento médico"
    await Agendamento.findOneAndUpdate(
      { paciente },
      { status: 'aguardando atendimento médico' }
    );

    res.status(201).json(novoAtendimento);
  } catch (err) {
    console.error('Erro ao salvar triagem:', err);
    res.status(500).json({ message: 'Erro ao salvar triagem.' });
  }
};

// Listar pacientes aguardando atendimento médico
exports.listarPacientesAguardandoAtendimento = async (req, res) => {
  try {
    const agendamentos = await Agendamento.find({ status: 'aguardando atendimento médico' })
      .populate('paciente', 'nome cpf cartaoSus');

    if (agendamentos.length === 0) {
      return res.status(404).json({ message: 'Nenhum paciente aguardando atendimento médico.' });
    }

    res.status(200).json(agendamentos);
  } catch (err) {
    console.error('Erro ao listar pacientes:', err);
    res.status(500).json({ message: 'Erro ao listar pacientes.' });
  }
};

// Obter todos os atendimentos de um paciente
exports.obterAtendimentosPorPaciente = async (req, res) => {
  try {
    const atendimentos = await Atendimento.find({ paciente: req.params.pacienteId })
      .populate('paciente')
      .populate('medico');
    res.json(atendimentos);
  } catch (err) {
    console.error('Erro ao obter atendimentos:', err);
    res.status(500).json({ message: 'Erro ao obter atendimentos' });
  }
};

// Obter todos os pacientes triados
exports.obterPacientesTriados = async (req, res) => {
  try {
    const atendimentos = await Atendimento.find({ status: 'aguardando atendimento médico' })
      .populate('paciente')
      .populate('medico');
    
    if (atendimentos.length === 0) {
      return res.status(404).json({ message: 'Nenhum paciente aguardando atendimento médico.' });
    }

    res.json(atendimentos);
  } catch (err) {
    console.error('Erro ao obter pacientes triados:', err);
    res.status(500).json({ message: 'Erro ao obter pacientes triados.' });
  }
};

// Realizar atendimento médico e alterar status para "atendido"
exports.realizarAtendimentoMedico = async (req, res) => {
  try {
    const { atendimentoId, medico, atendimento_medico } = req.body;

    const atendimento = await Atendimento.findById(atendimentoId);

    if (!atendimento || atendimento.status !== 'aguardando atendimento médico') {
      return res.status(400).json({ message: 'O paciente não está pronto para atendimento médico.' });
    }

    atendimento.medico = medico;
    atendimento.atendimento_medico = atendimento_medico;
    atendimento.status = 'atendido';

    await atendimento.save();
    res.status(200).json(atendimento);
  } catch (err) {
    console.error('Erro ao realizar atendimento médico:', err);
    res.status(500).json({ message: 'Erro ao realizar atendimento médico.' });
  }
};

// Obter o histórico de atendimentos de um paciente
exports.obterHistoricoAtendimentos = async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const atendimentos = await Atendimento.find({ paciente: pacienteId })
      .populate('medico', 'nome crm')
      .sort({ data_atendimento: -1 });

    if (atendimentos.length === 0) {
      return res.status(404).json({ message: 'Nenhum atendimento encontrado para este paciente.' });
    }

    res.json(atendimentos);
  } catch (err) {
    console.error('Erro ao obter histórico de atendimentos:', err);
    res.status(500).json({ message: 'Erro ao obter histórico de atendimentos.' });
  }
};
