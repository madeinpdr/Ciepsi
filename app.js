const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const hbs = require('hbs');
const session = require('express-session');
const testesRouter = require('./routes/testes');

const app = express();

// Registra helper do Handlebars
hbs.registerHelper('includes', function (str = '', substring) {
  return typeof str === 'string' && str.includes(substring);
});

// Define o view engine
app.set('view engine', 'hbs');

app.use(express.static('public'));

dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Conexão com banco
db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...");
    }
});

// Página inicial
app.get("/", (req, res) => {
    res.render("index");
});

// Rota para renderizar o dashboard
app.get("/dashboard", (req, res) => {
    const userIsAuthenticated = true; // Troque por sua lógica real

    if (userIsAuthenticated) {
        res.render("dashboard");
    } else {
        res.redirect("/");
    }
});

// Rotas
app.use('/auth', authRoutes);
app.use('/', pageRoutes);

// Rotas de testes
app.use('/testes', testesRouter); 

// Inicia servidor
app.listen(5003, () => {
    console.log("Server started on Port 5003");
});
