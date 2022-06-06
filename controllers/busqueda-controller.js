const { response, request } = require("express");
// const bcrypt = require("bcryptjs");
// const { generarJWT } = require("../helpers/jwt");
const Medico = require("../models/medico-model");
const Usuario = require("../models/usuario");
const Hospital = require("../models/hospital-model");

const getTodos = async (req = request, res = response) => {
  const parametro = req.params.busquedas;
  //creamos uan expresion regular para que traiga si algun nombre tiene el parametro buscado
  const regex = new RegExp(parametro, "i");

  const [usuarios, medicos, hospitales] = await Promise.all([
    await Usuario.find({ nombre: regex }),
    await Medico.find({ nombre: regex }),
    await Hospital.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios: usuarios,
    medicos: medicos,
    hospitales: hospitales,
  });
};

const getDocumentosColeccion = async (req = request, res = response) => {
  const tabla = req.params.tabla;
  const parametro = req.params.busquedas;
  const regex = new RegExp(parametro, "i");

  //   const [usuarios, medicos, hospitales] =
  //   await Promise.all([
  //       await Usuario.find({ nombre: regex }),
  //       await Medico.find({ nombre: regex }),
  //       await Hospital.find({ nombre: regex })
  //   ]);
  let data = [];
  switch (tabla) {
    case "medicos":
      data = await Medico.find({ nombre: regex })
        .populate("usuario", "nombre imagem")
        .populate("hospital", "nombre imagem");
      break;
    case "usuarios":
      data = await Usuario.find({ nombre: regex });
      break;
    case "hospitales":
      data = await Hospital.find({ nombre: regex }).populate(
        "usuario",
        "nombre imagem"
      );
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "LA tabla debe de ser usuarios/medicos/hospitales",
      });
      break;
  }

  res.json({
    ok: true,
    data,
  });
};

module.exports = { getTodos, getDocumentosColeccion };
