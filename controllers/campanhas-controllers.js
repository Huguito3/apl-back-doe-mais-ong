const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Campanha = require("../models/campanha");

const getCampanhas = async (req, res = response) => {
  const campanhas = await Campanha.find().populate("ong", "nombre image");

  res.json({
    ok: true,
    campanhas,
  });
};

const createCampanha = async (req, res = response) => {
  //en el middleware lo estamos reobteniendo al uid a traves del token
  const uid = req.uid;
  const campanha = new Campanha({
    ong: uid,
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

module.exports = {
  getCampanhas,
  createCampanha,
  updateCampanha,
  deleteCampanha,
};
