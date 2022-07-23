//Modelo de Mongoose
const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  descricao: {
    type: String,
  },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  image: { type: String },
  nascimento: { type: String },
  sexo: { type: String },
  contato: { type: String },
  favoritos:[
    {
      type: Schema.Types.ObjectId,
      ref: "Ong",
    },
  ],
  apoios:[
    {
      type: Schema.Types.ObjectId,
      ref: "Campanha",
    },
  ],
});

//Revisar docuemntacao mongoose. Desestructuramos el reotnro del json del mongo, trae datos como la version, que no la queremos
CategoriaSchema.method("toJSON", function () {
  console.log(this.toObject());
  const { __v, _id, ...object } = this.toObject();
  //redefinimos el nombre del id para mostrarlo a la salida del json
  object.uid = _id;
  
  return object;
});
//pór defecto mongoose coloca plural en la base de datos... usuario-> usuarios
module.exports = model("Categoria", CategoriaSchema);
