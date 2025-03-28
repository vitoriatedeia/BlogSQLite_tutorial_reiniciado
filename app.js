const express = require("express"); // importa lib do Express
const sqlite3 = require("sqlite3"); // Importa lib do sqlite3
const bodyParser = require("body-parser"); // Importa o body-parser

const PORT = 8000; // Porta TCP do servidor HTTP da aplicação

const app = express(); // Instância para uso do Express

// Cria conexão com obanco de dados
const db = new sqlite3.Database("user.db"); // Instância para uso do Sqlite3, e usa o arquivo 'user.db'

db.serialize(() => {
  // Este método permite enviar comandos SQL em modo 'sequencial'
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, 
    username TEXT, password TEXT, email TEXT, celular TEXT, cpf TEXT, rg TEXT)`
  );
});

// __dirname é a variável interna do nodejs que guarda o caminho absoluto do projeto, no SO
// console.log(__dirname + "/static");

// Aqui será acrescentado uma rota "/static", para a pasta __dirname + "/static"
// O app.use é usado para acrescentar rotas novas para o Express gerenciar e pode usar
// Middleware para isto, que neste caso é o express.static, que gerencia rotas estáticas
app.use("/static", express.static(__dirname + "/static"));

// Middleware para processar as requisições do Body Parameters do cliente
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar EJS como o motor de visualização
app.set("view engine", "ejs");

const index =
  "<a href='/sobre'> Sobre </a><a href='/login'> Login </a><a href='/cadastro'> Cadastrar </a>";
const sobre = 'Vc está na página "Sobre"<br><a href="/">Voltar</a>';
const login = 'Vc está na página "Login"<br><a href="/">Voltar</a>';
const cadastro = 'Vc está na página "Cadastro"<br><a href="/">Voltar</a>';

/* Método express.get necessita de dois parâmetros 
 Na ARROW FUNCTION, o primeiro são os dados do servidor (REQUISITION - 'req')
 o segundo, são os dados que serão enviados ao cliente (RESULT - 'res') */

app.get("/", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/
  // res.send(index);
  res.render("index");
});

// Pregramação de rotas do método GET do HTTP 'app.get()'
app.get("/sobre", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/sobre
  res.send(sobre);
});

app.get("/login", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/info
  res.render("login");
});

app.post("/login", (req, res) => {
  res.send("Login ainda não implementado.");
});

app.get("/cadastro", (req, res) => {
  // Rota raiz do meu servidor, acesse o browser com o endereço http://localhost:8000/cadastro
  res.send(cadastro);
  );
});

app.post("/cadastro", (req, res) => {
  !req.body
    ? console.log(`Body vazio: ${req.body}`)
    : console.log(JSON.stringify(req.body));

    // Colocar aqui as validações e inclusão no banco de dados do cadastro do usuário
    
  res.send(
    `Bem-vindo usuário: ${req.body.username}, seu email é ${req.body.email}`
  );
});

// app.listen() deve ser o último comando da aplicação (app.js)
app.listen(PORT, () => {
  console.log(`Servidor sendo executado na porta ${PORT}!`);
});
