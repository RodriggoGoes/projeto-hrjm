console.log('JWT_SECRET:', process.env.JWT_SECRET);

const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];


  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    console.log('Token não fornecido!'); 
    return res.status(403).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Erro ao verificar token:', err.message); 
      return res.status(401).json({ message: 'Token inválido.' });
    }

    console.log('Token decodificado:', decoded);
    req.usuario = decoded;
    next();
  });
};
