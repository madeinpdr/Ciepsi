require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

// LISTAR TESTES
exports.listarTestes = (req, res) => {
  const { busca } = req.query;
  let query = "SELECT * FROM testes ORDER BY armario";
  let params = [];

  if (busca && busca.trim() !== '') {
    query = "SELECT * FROM testes WHERE nome LIKE ? ORDER BY armario";
    params = [`%${busca.trim()}%`];
  }

  db.query(query, params, (err, linhas) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro no banco de dados');
    }

    if (linhas.length === 0 && busca) {
      return res.render('testes', {
        armarios: [],
        busca,
        nenhumResultado: true,
        armariosDisponiveis: [] // vazio já que não temos a tabela
      });
    }

    const armarios = {};
    linhas.forEach(teste => {
      if (!armarios[teste.armario]) armarios[teste.armario] = [];
      armarios[teste.armario].push(teste);
    });

    res.render('testes', {
      armarios: Object.keys(armarios).map(numero => ({
        numero,
        nome: `Armário ${numero}`,
        testes: armarios[numero]
      })),
      busca,
      nenhumResultado: false,
      armariosDisponiveis: [] // vazio já que não temos a tabela
    });
  });
};

// ADICIONAR TESTE
exports.adicionar = (req, res) => {
  const { nome, quantidade, armario } = req.body;
  const qtd = Math.min(Math.max(parseInt(quantidade, 10) || 1, 1), 500);

  db.query(
    "INSERT INTO testes (nome, quantidade, armario) VALUES (?, ?, ?)",
    [nome, qtd, armario],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao adicionar teste');
      }
      res.redirect('/testes');
    }
  );
};

// EXCLUIR TESTE
exports.excluir = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM testes WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao excluir teste');
    }
    res.redirect('/testes');
  });
};

// ADICIONAR QUANTIDADE
exports.adicionarQuantidade = (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;
  const qtd = parseInt(quantidade, 10);

  if (!qtd || qtd < 1) return res.redirect('/testes');

  db.query(
    "UPDATE testes SET quantidade = quantidade + ? WHERE id = ?",
    [qtd, id],
    (err) => {
      if (err) {
        console.error('Erro ao adicionar quantidade:', err);
      }
      res.redirect('/testes');
    }
  );
};

// RETIRAR QUANTIDADE
exports.retirar = (req, res) => {
  const { id } = req.params;

  db.query("SELECT quantidade FROM testes WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro interno");
    }

    if (!results[0] || results[0].quantidade <= 0) {
      return res.status(400).send("Estoque insuficiente.");
    }

    db.query(
      "UPDATE testes SET quantidade = quantidade - 1 WHERE id = ?",
      [id],
      (err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).send("Erro interno");
        }
        res.redirect('/testes');
      }
    );
  });
};
