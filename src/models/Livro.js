import mongoose from "mongoose";

const livroSchema = new mongoose.Schema(
  {
    id: {type: String},
    titulo: {type: String, required: [ true, "Titulo do livro é obrigatório" ]},
    autor: {type: mongoose.Schema.Types.ObjectId, ref: "autores", required: [ true, "ID do autor do livro é obrigatório" ]},
    editora: {
      type: String, 
      required: [ true, "Editora é obrigatório" ],
      enum: { //para definir quais valores podem ser salvos no bd
        values: ["Casa do codigo", "Alura"],
        message: "A editora {VALUE} nao é valida" //mongoose substitui
      } 
    },
    preco: { //validacao personalizada retorna true se passar ou false se reprovar
      type: Number,
      validate: {
        validator: (valor) => {
          return valor >= 10 && valor <= 1000;//sempre preciso retornar true ou false
        },
        message: "Preco deve esta entre 10 e 1000. Valor fornecido {VALUE}"
      }
    },
    paginas: { //validacao padrao mongoose
      type: Number,
      min: [ 10, "Numero minimo de páginas é {VALUE}"],
      max: [5000, "Numero maxino de páginas é {VALUE}"]
    }
  }, { versionKey: false }
);

const livros= mongoose.model("livros", livroSchema);

export default livros;