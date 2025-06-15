require('dotenv').config();

const transporter = require('../config/email'); // Corrigido o nome
const mysql   = require('mysql');
const jwt     = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const bcrypt  = require('bcryptjs');

// 1) Conexão com o banco
const db = mysql.createConnection({
  host:     process.env.DATABASE_HOST,
  user:     process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

// 2) REGISTER
exports.register = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).render('register', {
      message: 'Por favor, preencha todos os campos.'
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).render('register', {
      message: 'As senhas não coincidem.'
    });
  }

  try {
    // Verifica se o e-mail já existe
    db.query(
      'SELECT id FROM users WHERE email = ?', 
      [email], 
      async (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          return res.render('register', {
            message: 'Esse e-mail já está em uso!'
          });
        }

        // Gera hash da senha 
        const hashedPassword = await bcrypt.hash(password, 10); // Use 10 ou mais para produção

        // Insere novo usuário
        db.query(
          'INSERT INTO users (name, email, password) VALUES (?,?,?)',
          [name, email, hashedPassword],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res.status(500).render('register', {
                message: 'Erro ao registrar usuário.'
              });
            }
            res.render('register', {
              message: 'Usuário registrado com sucesso!'
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).render('register', {
      message: 'Erro interno do servidor.'
    });
  }
};

// 3) LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('index', {
      message: 'Por favor, preencha e-mail e senha.'
    });
  }

  try {
    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          return res.status(401).render('index', {
            message: 'E-mail ou senha incorretos.'
          });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).render('index', {
            message: 'E-mail ou senha incorretos.'
          });
        }

        // Cria JWT e envia como cookie 
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie('jwt', token, {
          httpOnly: true,
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          )
        });

        // Redireciona para rota de dashboard
        res.status(200).redirect('/dashboard');
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).render('index', {
      message: 'Erro interno do servidor.'
    });
  }
};

// 4) SOLICITAR RECUPERAÇÃO DE SENHA
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ message: 'Por favor, informe o seu email cadastrado.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
if (err) {
  console.error('Erro no banco:', err);
  return res.json({ message: 'Erro interno' });
}
    if (results.length === 0) {
      return res.json({ message: 'E-mail não cadastrado!' });
    }

    const user = results[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );
    const resetUrl = `https://ciepsi.com.br/?token=${token}`;
    try {
      await transporter.sendMail({
        from: '"CIEPSI" <no-reply@ciepsi.com.br>',
        to: user.email,
        subject: 'Recuperação de Senha',
        html: `
          <p>Você solicitou a redefinição de senha.</p>
          <p>Clique no link abaixo para redefinir:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Se não foi você, ignore!</p>
        `
      });
      return res.json({ message: 'Enviamos as instruções para o seu email.' });
} catch (err2) {
  console.error('Erro ao enviar email:', err2);
  return res.json({ message: 'Erro ao enviar o email.' });
}

  });
};


// 5) REDEFINIÇÃO DE SENHA
exports.resetPassword = (req, res) => {
  const { token, password, passwordConfirm } = req.body;
  if (!token || !password || !passwordConfirm) {
    return res.status(400).render('index', { message: 'Preencha todos os campos corretamente.' });
  }
  if (password !== passwordConfirm) {
    return res.status(400).render('index', { message: 'As senhas não coincidem.' });
  }

  try {
    // Verifica token
    const decoded = jwt.verify(token, jwtConfig.secret);

    // Atualiza senha no banco
    bcrypt.hash(password, 8, (err, hashedPassword) => {
      if (err) throw err;

      db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, decoded.id],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).render('index', { message: 'Erro ao redefinir senha.' });
          }
          return res.status(400).json({ message: 'Senha redefinida com sucesso!' });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json ({ message: 'Token inválido ou expirado.' });
  }
};

// 6) LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
};