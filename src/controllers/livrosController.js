import NaoEncontrado from "../erros/NaoEncontrado.js";
import { livros } from "../models/index.js";
import { autores } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      //buscaLivros tem acesso a .sort, .limit, .populate, etc
      //Nao uso await, pq nao preciso do resultado agora. Vou passar essa query do mongoose para o middleware que vai tratar da paginacao e ordenacao
      const buscaLivros = livros.find().populate("autor", "nome"); 

      //armazenando buscaLivros na req, criando uma propriedade resultado nesse objeto
      req.resultado = buscaLivros;

      //Chamando middleware que vai tratar da paginacao, ordenacao e resposta
      //esse middleware é o paginar.js e foi registrado na rota get do listar livros, no arquivo livrosRoutes.js, depois de chamar o controlador
      next();
      
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroEncontrado = await livros.findById(id)
        .populate("autor", "nome") //propriedade autor do objeto livro vai ter apenas a propriedade nome do autor. Se deixar sem "nome" pega todas as propriedades de autor
        .exec();
        
      if( livroEncontrado !== null ) {
        res.status(200).send(livroEncontrado);
      } else {
        next(new NaoEncontrado("Livro não encontrado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if( livroEncontrado !== null ) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Livro não encontrado para atualização."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;
      const livroEncontrado = await livros.findByIdAndDelete(id);

      if( livroEncontrado !== null ) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Livro não encontrado para exclusão"));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query); //funcao processaBusca monta o objeto busca para find buscar no bd

      //Se nao encontrou autor filtrado, busca = null
      if ( busca !== null ) {
        const buscaLivros =  livros.find(busca).populate("autor", "nome"); //retorna array vazio se nao encontrar
        req.resultado = buscaLivros;
        next(); //chamando paginar.js

      } else {
        res.status(200).send([]); //se nao encontrou autor do filtro, nao consegue por id dele no busca.autor e nao realizada a busca, só retorna array vazio.
      }
    } catch (erro) {
      next(erro);
    }
  };
}


async function processaBusca  (parametros) {
  //req.query (obj passado e pego em parametros) é um objeto com propriedades editora, titulo, ou os 2. Se digitar os 2, req.query terá propriedade editora e titulo
  //e serao armazenadas nas variaveis de mesmo nome. Caso nao digite um deles, o valor da variavel  sera undefined
  //{ editora, titulo } = req.query;  Significa: vá no objeto req.query e pegue valor da propriedade editora e armazene na variavel editora. Mesma coisa p/ titulo
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros; 

  //criando um regex para buscar apenas por parte do titulo. Primeiro argumento é o titulo buscado, e o segundo "i" para nao ser case sensitive
  // const regex = new RegExp(titulo, "i"); COM JS PURO

  let busca = {};
  if (editora) busca.editora = editora;
  //outra forma de criar regex com operadores do mongodb, sem ser com new RegExp do JS. 
  //Nesse caso vou ter:
  //busca {
  //  titulo: { $regex: titulo, $options: "i" }; 
  //}
  //Isso sera passado pro metodo find do mongoose que vai buscar o titulo ja com regex aplicado. OBS: "i" = case nao sensitive
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" }; 

  //criando propriedade paginas em obj busca se tiver minPaginas ou maxPaginas
  if (minPaginas || maxPaginas) busca.paginas = {};

  //Dessa forma funciona se tive minPaginas ou maxPaginas sozinhos ou se tiver os 2 juntos
  //nao sobrescreve o valor da propriedade. Se tiver os 2 parametros, inclui minPaginas e maxPaginas na propriedade paginas de obj busca
  if (minPaginas) busca.paginas.$gte = minPaginas;
  if (maxPaginas) busca.paginas.$lte =  maxPaginas; 

  //Filtro por autor
  if (nomeAutor) {
    const autoresBuscados = await autores.find({nome: { $regex: nomeAutor, $options: "i"}});
    
    if ( autoresBuscados.length !== 0 ) {
      busca.autor = autoresBuscados.map((elementoAtor) => elementoAtor._id); //mongoose aceita um array na propriedade filtrada no metodo find; Ex: { autor: [id1, id2] }
    } else {
      busca = null;
    }
  }
  return busca;
}


export default LivroController;