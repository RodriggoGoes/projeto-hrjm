const Atendimento = require('../models/Atendimento');
const { body, validationResult } = require('express-validator');

// Middleware para buscar atendimento e adicionar ao req
exports.buscarAtendimento = async (req, res, next) => {
  try {
    const atendimentoId = req.params.atendimentoId || req.body.atendimentoId;
    console.log('Buscar Atendimento - atendimentoId:', atendimentoId); // Log para debug

    if (!atendimentoId) {
      return res.status(400).json({ message: 'ID do atendimento é obrigatório.' });
    }

    const atendimento = await Atendimento.findById(atendimentoId).populate('paciente');
    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' });
    }

    req.atendimento = atendimento; // Adiciona o atendimento ao objeto req
    next();
  } catch (error) {
    console.error('Erro ao buscar atendimento:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar atendimento.' });
  }
};

// Listar pacientes aguardando triagem
exports.listarPacientesAguardandoTriagem = async (req, res) => {
  try {
    const atendimentos = await Atendimento.find({ status: 'aguardando triagem' })
      .populate('paciente', 'nome cpf') // Popula apenas os campos necessários
      .exec();

    if (atendimentos.length === 0) {
      return res.status(200).json({ message: 'Nenhum paciente aguardando triagem.' });
    }

    const pacientesComAtendimentos = atendimentos.map((atendimento) => ({
      paciente: atendimento.paciente,
      atendimentoId: atendimento._id,
    }));

    res.status(200).json(pacientesComAtendimentos);
  } catch (error) {
    console.error('Erro ao listar pacientes aguardando triagem:', error);
    res.status(500).json({ message: 'Erro ao buscar pacientes aguardando triagem.' });
  }
};

// Iniciar triagem
exports.iniciarTriagem = async (req, res) => {
  const { atendimentoId, triagem = {} } = req.body;
  console.log('Iniciar Triagem - atendimentoId:', atendimentoId); // Log para debug

  try {
    if (!atendimentoId) {
      return res.status(400).json({ message: 'ID do atendimento é obrigatório.' });
    }

    const atendimento = await Atendimento.findById(atendimentoId);

    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' });
    }

    if (atendimento.status !== 'aguardando triagem') {
      return res.status(400).json({ message: 'Atendimento não está aguardando triagem.' });
    }

    // Atualizando dados da triagem
    atendimento.triagem = {
      peso: triagem.peso || null,
      altura: triagem.altura || null,
      saturacao: triagem.saturacao || null,
      alergias: triagem.alergias || null,
      FC: triagem.FC || null,
      FR: triagem.FR || null,
      temperatura: triagem.temperatura || null,
      HAS: triagem.HAS || false,
      DM: triagem.DM || false,
    };

    // Atualizando status para 'triagem em andamento'
    atendimento.status = 'triagem em andamento';
    await atendimento.save();

    res.status(200).json({
      message: 'Triagem iniciada com sucesso.',
      atendimento,
    });
  } catch (error) {
    console.error('Erro ao iniciar triagem:', error);
    res.status(500).json({ message: 'Erro ao iniciar triagem.' });
  }
};

// Finalizar triagem e encaminhar para atendimento médico
exports.finalizarTriagemEEncaminharParaAtendimentoMedico = async (req, res) => {
  const { atendimentoId, triagem } = req.body;
  console.log('Finalizar Triagem - atendimentoId:', atendimentoId); // Log para debug

  try {
    if (!atendimentoId) {
      return res.status(400).json({ message: 'ID do atendimento é obrigatório.' });
    }

    const atendimento = await Atendimento.findById(atendimentoId);

    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' });
    }

    if (atendimento.status !== 'triagem em andamento') {
      return res.status(400).json({ message: 'Triagem já finalizada ou atendimento inválido.' });
    }

    // Atualizar triagem
    atendimento.triagem = triagem || atendimento.triagem; // Garante que não sobrescreve triagem com undefined
    atendimento.status = 'aguardando atendimento médico';

    await atendimento.save();

    res.status(200).json({
      message: 'Triagem finalizada com sucesso.',
      atendimento,
    });
  } catch (error) {
    console.error('Erro ao finalizar triagem:', error);
    res.status(500).json({ message: 'Erro ao finalizar triagem.' });
  }
};

// Obter detalhes do atendimento por ID
exports.obterDetalhesTriagem = async (req, res) => {
  try {
    const { atendimentoId } = req.params;
    console.log('Obtendo detalhes da triagem para atendimentoId:', atendimentoId); // Log para debug

    if (!atendimentoId) {
      return res.status(400).json({ message: 'ID do atendimento é obrigatório.' });
    }

    const atendimento = await Atendimento.findById(atendimentoId).populate('paciente');
    if (!atendimento) {
      return res.status(404).json({ message: 'Atendimento não encontrado.' });
    }

    res.status(200).json(atendimento);
  } catch (error) {
    console.error('Erro ao obter detalhes da triagem:', error);
    res.status(500).json({ message: 'Erro interno ao obter triagem.' });
  }
};
