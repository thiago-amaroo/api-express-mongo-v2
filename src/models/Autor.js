import mongoose from "mongoose";

const autorSchema = new mongoose.Schema(
  {
    id: {type: String},
    nome: {type: String, required: [ true, "O nome do autor(a) é obrigatório" ]}, //mongo deixa personarlizar mensagem de erro para quando for captada e exibida.
    nacionalidade: {type: String, required: [ true, "A nacionalidade do autor(a) é obrigatória" ]}
  },
  {
    versionKey: false
  }
);

const autores = mongoose.model("autores", autorSchema);

export default autores;