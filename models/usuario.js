//Modelo de Mongoose
const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  role: { type: String, required: true, default: "USER_ROLE" },
  google: { type: Boolean, default: false },
});

//Revisar docuemntacao mongoose. Desestructuramos el reotnro del json del mongo, trae datos como la version, que no la queremos
UsuarioSchema.method("toJSON", function () {
  console.log(this.toObject());
  const { __v, _id,password, ...object } = this.toObject();
  //redefinimos el nombre del id para mostrarlo a la salida del json
  object.uid = _id;
  
  return object;
});
//pór defecto mongoose coloca plural en la base de datos... usuario-> usuarios
module.exports = model("Usuario", UsuarioSchema);
