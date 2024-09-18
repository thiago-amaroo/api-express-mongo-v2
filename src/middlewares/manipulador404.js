import NaoEncontrado from "../erros/NaoEncontrado.js";

function manipulador404(req, res, next) {
  const erro404 = new NaoEncontrado();

  //Agora encaminho esse erro para o manipulador de erros em app.js (manipulador de erros é o proximo middleware a ser executado em app.js)
  next(erro404);
}

export default manipulador404;