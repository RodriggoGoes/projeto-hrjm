const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registrar um novo usuário
exports.registrarUsuario = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        // Verifica se o email já está registrado
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ message: 'Email já registrado' });
        }

        // Cria um novo usuário
        usuario = new Usuario({ nome, email, senha, tipo });
        await usuario.save();

        // Gerar o token JWT
        console.log('JWT_SECRET:',process.env.JWT_SECRET);
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, usuario });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao registrar o usuário' });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
      const { email, senha } = req.body;
  
      // Verifica se o usuário existe
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
  
      // Verifica a senha
      const senhaCorreta = await usuario.compararSenha(senha);
      if (!senhaCorreta) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
  
      console.log('Senha válida. Gerando token...');
  
      // Gerar o token JWT
      const token = jwt.sign(
        { id: usuario._id, nome: usuario.nome, tipo: usuario.tipo },
        process.env.JWT_SECRET, // Garante que o segredo está carregado corretamente
        { expiresIn: '1d' }
      );
  
      console.log('Token gerado:', token); // Verifique o token gerado
  
      const { senha: _, ...usuarioSemSenha } = usuario.toObject();
  
      res.status(200).json({ token, usuario: usuarioSemSenha });
    } catch (err) {
      console.error('Erro no login:', err.message);
      res.status(500).json({ message: 'Erro ao realizar o login' });
    }
  };

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-senha'); // Exclui a senha da resposta
        res.status(200).json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter usuários' });
    }
};
