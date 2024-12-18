const Paciente = require('../models/Paciente');
const Atendimento = require('../models/Atendimento');

exports.buscarPacientePorCpf = async (req, res) => {
  try {
    const { cpf } = req.body;

    // Busca o paciente pelo CPF
    const paciente = await Paciente.findOne({ cpf });
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    // Verifica se já existe um atendimento pendente para triagem
    const atendimentoExistente = await Atendimento.findOne({
      paciente: paciente._id,
      status: 'aguardando triagem',
    });

    if (atendimentoExistente) {
      return res.status(400).json({ message: 'Paciente já está na lista de triagem.' });
    }

    // Cria um novo atendimento com status "aguardando triagem"
    const novoAtendimento = new Atendimento({
      paciente: paciente._id,
      status: 'aguardando triagem',
    });

    await novoAtendimento.save();

    res.status(200).json({
      message: 'Paciente encaminhado para triagem.',
      atendimento: novoAtendimento,
    });
  } catch (error) {
    console.error('Erro no processo de busca/encaminhamento:', error);
    res.status(500).json({ message: 'Erro ao buscar paciente ou encaminhar para triagem.' });
  }
};
