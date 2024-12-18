exports.criarAtendimento = async (req, res) => {
  console.log('Dados recebidos:', req.body);

  try {
    const { paciente } = req.body;

    if (!paciente) {
      return res.status(400).json({ message: 'ID do paciente é obrigatório.' });
    }

    // Verifica se o paciente já está em atendimento
    const atendimentoExistente = await Atendimento.findOne(
      { paciente, status: 'aguardando triagem' });

    // Agora o console.log está após a definição de 'atendimentoExistente'
    console.log('Atendimento existente:', atendimentoExistente);

    if (atendimentoExistente) {
      return res.status(400).json({ 
        message: `Paciente já possui um atendimento pendente. ID Atendimento: ${atendimentoExistente._id}` 
      });
    }

    const novoAtendimento = new Atendimento({
      paciente,
      status: 'aguardando triagem',
    });

    await novoAtendimento.save();
    res.status(201).json({
      message: 'Atendimento criado com sucesso.',
      atendimento: novoAtendimento,
    });
  } catch (error) {
    console.error('Erro ao criar atendimento:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
