import RequisicaoIncorreta from "./RequisicaoIncorreta.js";

class ErroValidacao extends RequisicaoIncorreta{
  constructor(erro) {
    const mensagensErro = Object.values(erro.errors)
      .map((erro) => erro.message)
      .join("; ");

    super("Os seguintes erros foram encontrados: " + mensagensErro); //usando construtor do RequisicaoIncorreta que por sua vez usa construtor do ErroBase
  }
}

export default ErroValidacao;