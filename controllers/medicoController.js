const Medico = require('../models/Medico');

// Adicionar novo médico
exports.adicionarMedico = async (req, res) => {
  try {
    const { crm } = req.body;

    // Verificar se o médico já existe
    const medicoExistente = await Medico.findOne({ crm });
    if (medicoExistente) {
      return res.status(400).json({ message: 'Médico já existe!' });
    }

    const novoMedico = new Medico(req.body);
    await novoMedico.save();
    res.status(201).json(novoMedico);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar médico');
  }
};

// Obter todos os médicos
exports.obterMedicos = async (req, res) => {
  try {
    const medicos = await Medico.find();
    res.json(medicos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao obter médicos');
  }
};
