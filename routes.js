const express = require('express');
const router = express.Router();
const pacienteController = require('./controllers/pacienteController');
const medicoController = require('./controllers/medicoController');
const atendimentoController = require('./controllers/atendimentoController');
const triagemController = require('./controllers/triagemController');
const recepcaoController = require('./controllers/recepcaoController');

// ** Paciente Routes **
router.post('/pacientes', pacienteController.adicionarPaciente);
router.get('/pacientes/cpf/:cpf', pacienteController.obterPacientePorCpf);

// ** Triagem Routes **
router.get('/triagem/aguardando', triagemController.listarPacientesAguardandoTriagem);
router.post('/triagem/iniciar', triagemController.iniciarTriagem); // Iniciar triagem
router.put('/triagem/:atendimentoId', triagemController.buscarAtendimento, triagemController.finalizarTriagemEEncaminharParaAtendimentoMedico); // Finalizar triagem
router.get('/triagem/:atendimentoId', triagemController.obterDetalhesTriagem);

// ** Recepção Routes **
router.post('/recepcao/buscar', recepcaoController.buscarPacientePorCpf);

// *** Rota de Verificação (Ping) ***
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong! Backend está online.' });
});

module.exports = router;
