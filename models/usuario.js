//Modelo de Mongoose
const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nome: {
    type: String,
  },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  image: { type: String },
  // role: { type: String, required: true, default: "USER_ROLE" },
  // google: { type: Boolean, default: false },
  nascimento: { type: String },
  sexo: { type: String },
  contato: { type: String },
});

//Revisar docuemntacao mongoose. Desestructuramos el reotnro del json del mongo, trae datos como la version, que no la queremos
UsuarioSchema.method("toJSON", function () {
  console.log(this.toObject());
  const { __v, _id,senha, ...object } = this.toObject();
  //redefinimos el nombre del id para mostrarlo a la salida del json
  object.uid = _id;
  
  return object;
});
//pór defecto mongoose coloca plural en la base de datos... usuario-> usuarios
module.exports = model("Usuario", UsuarioSchema);
