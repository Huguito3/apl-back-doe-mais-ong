//Modelo de Mongoose
const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
  id: {
    type: Number,
  },
  descricao: {
    type: String,
  },
  tipo: { type: String },
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
