const { Schema, model } = require("mongoose");

const CampanhaSchema = Schema(
  {
    ong: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Ong",
    },
    ongNome: {
      type: String,
      required: true,
    },
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
    apoiadores: { type: Number },
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
    dataInicial: { type: String },
    dataFinal: { type: String },
    categoria: { type: Number }, // trocar por tabelas especificas
    status: { type: Number }
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
