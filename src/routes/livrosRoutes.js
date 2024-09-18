import express from "express";
import LivroController from "../controllers/livrosController.js";
import paginar from "../middlewares/paginar.js";

const router = express.Router();

router
  //paginar (2º argumento) é o middleware que recebe as querys do mongoose dos controladores e aplica paginacao e resposde requisicoes
  //quando dou next dentro do controlador listarLivros, por Ex, vai para o middleware paginar.js
  .get("/livros", LivroController.listarLivros, paginar) 

  .get("/livros/busca", LivroController.listarLivroPorFiltro, paginar)
  .get("/livros/:id", LivroController.listarLivroPorId)
  .post("/livros", LivroController.cadastrarLivro)
  .put("/livros/:id", LivroController.atualizarLivro)
  .delete("/livros/:id", LivroController.excluirLivro);

export default router;   