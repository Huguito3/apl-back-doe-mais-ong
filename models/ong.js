//Modelo de Mongoose
const { Schema, model } = require("mongoose");

const OngSchema = Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  imagens: {
    avatar: { type: String },
    galeria: [
      {
        type: String,
      },
    ],
  },
  endereco: {
    cep: { type: String },
    logradouro: { type: String },
    complemento: { type: String },
    bairro: { type: String },
    localidade: { type: String },
    uf: { type: String },
    latitude: { type: String },
    longitude: { type: String },
  },
  campanhasAtivas: { type: Number },
  campanhasEncerradas: { type: Number },
  apoio: { type: Boolean }, //Isto é do usuario
  agenda: {
    atividade: [
      {
        type: Number,
      },
    ],
    horaInicio: { type: String },
    horaFim: { type: String },
  },
  favorito: { type: Boolean },
  dataInicial: { type: String },
  dataFinal: { type: String },
  categoria: { type: Number },
});

//Revisar docuemntacao mongoose. Desestructuramos el reotnro del json del mongo, trae datos como la version, que no la queremos
OngSchema.method("toJSON", function () {
  console.log(this.toObject());
  const { __v, _id, password, ...object } = this.toObject();
  //redefinimos el nombre del id para mostrarlo a la salida del json
  object.uid = _id;

  return object;
});
//pór defecto mongoose coloca plural en la base de datos... Ong-> Ongs
module.exports = model("Ong", OngSchema);
