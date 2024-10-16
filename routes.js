const express = require('express');
const router = express.Router();
const pacienteController = require('./controllers/pacienteController');
const medicoController = require('./controllers/medicoController');
const atendimentoController = require('./controllers/atendimentoController');
const triagemController = require('./controllers/triagemController');
const agendamentoController = require('./controllers/agendamentoController');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/auth');

// Rotas para Pacientes
router.post('/pacientes', pacienteController.adicionarPaciente); // Adicionar novo paciente
router.get('/pacientes/cpf/:cpf', pacienteController.obterPacientePorCpf); // Obter paciente pelo CPF
router.post('/pacientes/agendar', pacienteController.adicionarPacienteEAgendar); // Adicionar paciente e agendar
router.get('/pacientes/:id', pacienteController.obterPacientePorId); // Obter paciente por ID
router.get('/pacientes', pacienteController.obterPacientes);

// Rotas para Médicos
router.post('/medicos', medicoController.adicionarMedico);
router.get('/medicos', medicoController.obterMedicos);

// Rotas para Agendamentos
router.post('/agendamentos', agendamentoController.adicionarPacienteOuAgendamento); // Adicionar novo paciente e criar agendamento
router.get('/agendamentos', agendamentoController.obterAgendamentos); // Obter todos os agendamentos

// Rotas para Triagem
router.post('/triagem', authMiddleware.verificarToken, triagemController.criarTriagem); // Criar triagem


// Rotas para Atendimentos
router.post('/atendimentos', authMiddleware.verificarToken, atendimentoController.criarAtendimento); // Criar novo atendimento
router.get('/atendimentos/:pacienteId', authMiddleware.verificarToken, atendimentoController.obterAtendimentosPorPaciente); // Obter atendimentos por paciente
router.get('/atendimentos/historico/:pacienteId', authMiddleware.verificarToken, atendimentoController.obterHistoricoAtendimentos); // Obter histórico de atendimentos
router.post('/atendimentos/realizar', authMiddleware.verificarToken, atendimentoController.realizarAtendimentoMedico); // Realizar atendimento médico
router.get('/pacientes-triados', authMiddleware.verificarToken, atendimentoController.obterPacientesTriados); // Obter pacientes triados
router.get('/pacientes/aguardando-atendimento', atendimentoController.listarPacientesAguardandoAtendimento);

// Rota para registrar um novo usuário
router.post('/auth/register', authController.registrarUsuario);

// Rota para listar todos os usuários (pode exigir autenticação)
router.get('/usuarios', authMiddleware.verificarToken, authController.listarUsuarios);

// Rota para login
router.post('/auth/login', authController.loginUsuario);

// Rota de verificação
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Pong! Backend está online.' });
});

module.exports = router;
