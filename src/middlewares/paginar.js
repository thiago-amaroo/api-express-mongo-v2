import RequisicaoIncorreta from "../erros/RequisicaoIncorreta.js";

async function paginar (req, res, next) {
  try {
    //paginando, valor padrao limite 5 e pagina 1
    let {limite = 5, pagina = 1, ordenacao = "_id:-1" } = req.query;
    
    let [campoOrdenacao, ordem] = ordenacao.split(":"); //retorna array com 2 posicoes, dividindo string. Isso simplifica a url
    
    //validando paginas e limite fornecidos
    limite = parseInt(limite);
    pagina = parseInt(pagina);
    ordem = parseInt(ordem);
    
    if (limite > 0 && pagina > 0) {
      //pegando a busca do mongoose que foi armazenada em req lá no controlador.Ex: req.resultado = livros.find(); 
      const resultado = req.resultado;
      
      //sort usa -1 para decrescente e 1 para crescente
      //O [campoOrdenacao] significa pega a string da variavel campoOrdenacao e coloca como nome na propriedade. Isso é do JS
      const resultadoPaginado = await resultado
        .sort( { [campoOrdenacao]: ordem } )
        .skip( (pagina - 1) * limite ) //quantos livros pulo? Se pessoa escolheu pagina 2, preciso pular 5 livros. 
        .limit(limite) //limite de livros a ser mostrado
        .exec();
      
      res.status(200).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta("Dados de paginacao incorretos"));
    }
  } catch (erro) {
    next(erro);
  }
}

export default paginar;