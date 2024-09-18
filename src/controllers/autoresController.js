import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autores } from "../models/index.js";

class AutorController {

  static listarAutores = async(req, res, next) => {
    try {
      const autoresResultado = autores.find();
      req.resultado = autoresResultado;
      next();
      
    } catch (erro) {
      //aqui ele chama o proximo middleware do app.js passando o erro. O proximo middleware de app é a funcao que esta em 
      //manipualdorDeErros.js que manipula e responde aos erros. Todo middeware precisa responder à requisicao ou dar next pro proximo middleware
      next(erro); 
    }
  };

  static listarAutorPorId = async (req, res, next) => {
    
    try {
      const id = req.params.id;
      const autorResultado = await autores.findById(id); //se nao encontrar mongoose retorna null

      if(autorResultado !== null) {
        res.status(200).send(autorResultado);
      } else {
        next(new NaoEncontrado("Id do Autor não localizado")); //next para proximo middleware em app.js que recebe um objeto erro (manipuladorDeErros)
      }
    } catch (erro) {
      //todo metodo controlador pode receber next como parametro. Aqui, pego o erro e jogo pro middleware que controla os erros
      //que esta em app.js
      next(erro);
    }
  };
  
  
  static cadastrarAutor = async (req, res, next) => {
    try {
      let autor = new autores(req.body);
  
      const autorResultado = await autor.save();
  
      res.status(201).send(autorResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };
  

  static atualizarAutor = async (req, res, next) => {
    try {
      const id = req.params.id;
      const encontraAutor = await autores.findByIdAndUpdate(id, {$set: req.body});
      
      if( encontraAutor !== null) {
        res.status(200).send({message: "Autor atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Autor não localizado para atualização.")); //next para proximo middleware em app.js que recebe erro (manipuladorDeErros)
      }
    } catch (erro) {
      next(erro);
    }
  };
  
  static excluirAutor = async (req, res, next) => {
    try {
      const id = req.params.id;
      const encontraAutor = await autores.findByIdAndDelete(id);

      if(encontraAutor !== null) {
        res.status(200).send({message: "Autor removido com sucesso"});
      } else {
        next(new NaoEncontrado("Autor não encontrado para exclusão"));
      }
    } catch (erro) {
      next(erro);
    }
  };
  

}

export default AutorController;