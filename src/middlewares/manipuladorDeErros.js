import mongoose from "mongoose";
import ErroBase from "../erros/ErroBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";
import ErroValidacao from "../erros/ErroValidacao.js";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros (erro, req, res, next)  {


  if (erro instanceof mongoose.Error.CastError ) {
    new RequisicaoIncorreta().enviarResposta(res);

  } else if (erro instanceof mongoose.Error.ValidationError ) { 
    new ErroValidacao(erro).enviarResposta(res);

  } 
  //se erro for criado com classe NaoEncontrador ou RequisicaoIncorreta, ou qq um que herde de ErroBase, sera instancia de ErroBase tbm
  else if (erro instanceof ErroBase) {
    erro.enviarResposta(res); 
    //middleware manipulador404.js manda instancia de NaoEncontrado para este middleware e este recebe em erro. Entao tenho acesso ao metodo enviar resposta na variavel erro
    //nesse caso, erro = const erro404 que manipulador404 passou para manipuladorDeErros

  } else {
    new ErroBase().enviarResposta(res);
  }
};

export default manipuladorDeErros;