const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Campanha = require("../models/campanha");
const Usuario = require("../models/usuario");
const ONG = require("../models/ong");

const getCampanhas = async (req, res = response) => {
  const uid = req.uid;
  const campanhas = await Campanha.find().populate("ong", "nombre image");
  const usuarioDB = await Usuario.findById(uid);

  var arrayLength = campanhas.length;
  for (var i = 0; i < arrayLength; i++) {
    if (usuarioDB?.apoios?.includes(campanhas[i]._id)) {
      campanhas[i].apoio = true;
    }

    //Do something
  }

  res.json({
    ok: true,
    campanhas,
  });
};

const getCampanha = async (req, res = response) => {
  const _id = req.params.uid;
  const uid = req.uid;
  // const campanha = await Campanha.find().populate("ong", "nombre image");
  try {
    const campanha = await Campanha.findById(_id);

    if (!campanha) {
      res.status(404).json({
        ok: false,
        msg: "El Id no correspodne a una campanha de la base",
      });
    }
    const usuarioDB = await Usuario.findById(uid);
    // const ong = await ONG.findById(campanha.ong);
    if (usuarioDB?.apoios?.includes(campanha._id)) {
      campanha.apoio = true;
    }
    // campanha["ongNome"] = ong.nome;
    // console.log(`ongNome: ${ong.nome}`);
    // console.log(`campanha: ${campanha}`);
    res.json({
      ok: true,
      campanha,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const createCampanha = async (req, res = response) => {
  //en el middleware lo estamos reobteniendo al uid a traves del token
  const uid = req.uid;
  const ong = await ONG.findById(uid);
  const campanha = new Campanha({
    ong: uid,
    ongNome: ong.nome,
    ...req.body,
  });
  try {
    const campanhadb = await campanha.save();

    res.json({
      ok: true,
      campanha: campanhadb,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const updateCampanha = async (req, res = response) => {
  const _id = req.params.uid;
  const uid = req.uid;
  try {
    const campanha = await Campanha.findById(_id);
    if (!campanha) {
      res.status(404).json({
        ok: false,
        msg: "El Id no correspodne a una Campanha de la base",
      });
    }

    const cambiosCampanha = {
      ...req.body,
      ong: uid,
    };

    const campanhaAtualizado = await Campanha.findByIdAndUpdate(
      _id,
      cambiosCampanha,
      { new: true }
    );

    res.json({
      ok: true,
      campanha: campanhaAtualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const deleteCampanha = async (req, res = response) => {
  const _id = req.params.uid;

  try {
    const campanha = await Campanha.findById(_id);
    if (!campanha) {
      res.status(404).json({
        ok: false,
        msg: "El Id no correspodne a una campanha de la base",
      });
    }

    const campanhaAtualizado = await Campanha.findByIdAndDelete(_id);
    //Seria mejor guardar el usuario y no eliminar fisicamente, si no crear una variabel de flag.
    res.json({
      ok: true,
      msg: "Campanha Eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const apoiarCampanha = async (req, res = response) => {
  const _id = req.body.id;
  const uid = req.uid;
  try {
    const campanha = await Campanha.findById(_id);
    if (!campanha) {
      res.status(404).json({
        ok: false,
        msg: "El Id no correspodne a una Campanha de la base",
      });
    }

    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    if (usuarioDB?.apoios?.includes(_id)) {
      var arrayLength = usuarioDB.apoios.length;
      for (var i = 0; i < arrayLength; i++) {
        if (usuarioDB.apoios[i] == _id) {
          usuarioDB.apoios = usuarioDB.apoios.splice(i, i);
        }
      }
      campanha.apoio = false;
      campanha.apoiadores -= 1;
    } else {
      campanha.apoio = true;
      usuarioDB.apoios.push(_id);
      campanha.apoiadores += 1;
    }

    await Usuario.findByIdAndUpdate(uid, usuarioDB, {
      new: true,
    });

    const campanhaAtualizado = await Campanha.findByIdAndUpdate(_id, campanha, {
      new: true,
    });

    res.json({
      ok: true,
      campanha: campanhaAtualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const intereseCampanhaUsuario = async (req, res = response) => {
  const uid = req.uid;
  try {
    const campanhas = await Campanha.find();
    const usuarioDB = await Usuario.findById(uid);
    const listaCampanhas = usuarioDB.apoios;
    var campanhasFiltradas = [];
    if (listaCampanhas.length > 0) {
      campanhasFiltradas = campanhas.filter((campanha) => {
        return listaCampanhas.includes(campanha._id);
      });
    }

    res.json({
      ok: true,
      campanhas: campanhasFiltradas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

module.exports = {
  getCampanhas,
  getCampanha,
  createCampanha,
  updateCampanha,
  deleteCampanha,
  apoiarCampanha,
  intereseCampanhaUsuario,
};
