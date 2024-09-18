
//definindo validador para todos os campos strings de todos os modelos
//estou setando uma propriedade chamada validate (1º argumento) com o valor (2º argumento) em todos os campos string de todos os modelos

import mongoose from "mongoose";

mongoose.Schema.Types.String.set("validate", {
  validator: (valor) => valor.trim() !== "", //impede qualquer valor em branco, inclusive espacos
  message: ({ path }) => `O campo ${path} foi fornecido em branco.` //para especificar qual campo ficou em branco
});