const { Schema, model } = require("mongoose");

const CampanhaSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    endereco: {
      type: String,
      required: true,
    },
    longitud: { type: String },
    latitud: { type: String },
    dataInicio: { type: Date },
    dataFinal: { type: Date },
    image: { type: String },
    // usuario: {
    //   required: true,
    //   type: Schema.Types.ObjectId,
    //   ref: "Usuario",
    // },--> Associar ONG
  },
  //Si no colocamos esto, coloca el plural en ingles del nombre del esquema Hospitals.
  { collection: "campanhas" }
);


CampanhaSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});
//pór defecto mongoose coloca plural en la base de datos... usuario-> usuarios
module.exports = model("Campanha", CampanhaSchema);
