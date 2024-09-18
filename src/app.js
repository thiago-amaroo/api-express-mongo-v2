import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import manipulador404 from "./middlewares/manipulador404.js";

db.on("error", console.log.bind(console, "Erro de conexão"));
db.once("open", () => {
  console.log("conexão com o banco feita com sucesso");
});

const app = express();
app.use(express.json());


routes(app);

//vai executar esse middleware apenas se nao achar nada nas rotas routes
//esse middleware cria um objeto erro, ja que quando ele nao acha rota, o mongoose nao cria objeto com erro. 
//Depois envia o objeto erro para manipuladorDeErros
app.use(manipulador404);

//apenas para teste:
//com essse middleware, caso de algum erro nos metodos dos controladores, intercepto o erro que esta voltando de routes(app) (dos controladores)
//antes de ir para o manipulador de erros oficial exibo no console.log o erro e dou next para ir pro proximo middleware, 
//no caso o manipulador de erros oficial que vai responder à req.
// app.use((erro, req, res, next) => {
//   console.log(`o erro foi ${erro}`);
//   next(erro);
// });

//usando middleware de manipulador de erro que esta em manipuladorDeErros.js
//4 argumentos, incluindo objeto erro
app.use(manipuladorDeErros);

export default app;