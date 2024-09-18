import mongoose from "mongoose";
import ErroBase from "../erros/ErroBase.js";
import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

//criando middleware para ser usado em todas as requisicoes. Middleware para erros
//Intercepta qq erro lancado pela aplicacao - para nao repetir codigo nos controladores
//express identifica esse middleware como tratamento de erros por causa dos 4 parametros
// eslint-disable-next-line no-unused-vars
function manipuladorDeErros (erro, req, res, next)  {
  //imprimindo erro no console para desenvolvedor saber qual erro é
  console.log(erro);

  //se o erro for gerado pelo mongoose, ex: id tem que ter 24 caracteres. se nao tiver mongoose retorna erro
  //consigo pegar esses erros do mongoose verificando se erro do catch é instancia do mongoose.Error.CastErro
  if (erro instanceof mongoose.Error.CastError ) {
    new RequisicaoIncorreta().enviarResposta(res);

  } else if (erro instanceof mongoose.Error.ValidationError ) { 
    //Se o erro for do mongoose de validacao, Ex: deixar campo required em branco
    //erro instancia do mongoose tem um objeto errors com propriedades especificas do erro
    //Object.values(erro.errors) é um array só dos valores dessas propriedades. No caso, nesse array, cada elemento é um objeto com as propriedades
    ///dos campos que sao requiridos e nao foram preenchidos. 
    //Vou usar map para iterar sobre os elementos desse array e fazer o objeto todo (cada elemento) virar só o texto do erro.message
    const mensagensErro = Object.values(erro.errors)
      .map((erro) => erro.message)
      .join("; ");

    res.status(400).send("Os seguintes campos são exigidos: " + mensagensErro);
  } else {
    //criando instancia da classe ErroBase e executando metodo enviarResposta sem argumentos(vai pegar valores padroes la do metodo)
    new ErroBase().enviarResposta(res);
  }
};

export default manipuladorDeErros;