import mongoose from "mongoose";

const autorSchema = new mongoose.Schema(
  {
    id: {type: String},
    nome: {type: String, required: [ true, "O nome do autor(a) é obrigatório" ]}, //mongo deixa personarlizar mensagem de erro para quando for captada e exibida.
    nacionalidade: {
      type: String,
      validate: {
        validator: (valor) => valor === "brasileira" || valor === "japonesa",
        message: "Nacionalidade {VALUE} inválida. Escolha brasileira ou japonesa"
      }
    }
  },
  {
    versionKey: false
  }
);

const autores = mongoose.model("autores", autorSchema);

export default autores;