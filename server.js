import "dotenv/config"; //inicia dotenv na aplicacao - tem que ser no primeiro contato com aplicacao, no caso esse arquivo server.js
import app from "./src/app.js";

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});