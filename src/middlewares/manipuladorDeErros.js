import mongoose from "mongoose";

//criando middleware para ser usado em todas as requisicoes. Middleware para erros
//Intercepta qq erro lancado pela aplicacao - para nao repetir codigo nos controladores
//express identifica esse middleware como tratamento de erros por causa dos 4 parametros
// eslint-disable-next-line no-unused-vars
function manipuladorDeErros (erro, req, res, next)  {
  //se o erro for gerado pelo mongoose, ex: id tem que ter 24 caracteres. se nao tiver mongoose retorna erro
  //consigo pegar esses erros do mongoose verificando se erro do catch é instancia do mongoose.Error.CastErro
  if (erro instanceof mongoose.Error.CastError ) {
    res.status(400).send({message: "Um ou mais dados fornecidos estão incorretos. "});
  } else {
    res.status(500).send({messagem: `Erro interno de servidor: ${erro}`});
  }
};

export default manipuladorDeErros;