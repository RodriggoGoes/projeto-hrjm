const Atendimento = require('../models/Atendimento');
const Agendamento = require('../models/Agendamento');
const Paciente = require('../models/Paciente');

// Criar triagem e deixar paciente pronto para o atendimento
exports.criarTriagem = async (req, res) => {
  try {
    const { paciente, triagem } = req.body;

    // Verifique se todos os campos necessários estão presentes
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
        DM: triagem.DM
      },
      status: 'pronto para atendimento' 
    });

    await novoAtendimento.save();

    // Atualiza o status do agendamento para "aguardando atendimento médico"
    await Agendamento.findOneAndUpdate(
      { paciente: paciente }, 
      { status: 'aguardando atendimento médico' }
    );

    res.status(201).json(novoAtendimento);
  } catch (err) {
    console.error('Erro ao salvar triagem:', err);
    res.status(500).json({ message: 'Erro ao salvar triagem.' });
  }
};
