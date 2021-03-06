const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Ong = require("../models/ong");
const Usuario = require("../models/usuario");

const getOngs = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [Ongs, total] = await Promise.all([Ong.find(), Ong.countDocuments()]);
  res.json({
    ok: true,
    Ongs,
    total,
  });
};

const createOngs = async (req, res) => {
  const { nombre, password, email } = req.body;

  try {
    const existeEmail = await Ong.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }
    const ong = new Ong(req.body);

    //Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    ong.password = bcrypt.hashSync(password, salt);

    await ong.save();

    const token = await generarJWT(ong.id);

    res.json({
      ok: true,
      ong,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const actualizarOng = async (req, res = response) => {
  const uid = req.params.uid;
  try {
    const OngDB = await Ong.findById(uid);
    if (!OngDB) {
      return res.status(404).json({
        ok: false,
        msg: "Ong no encontrado",
      });
    }

    const { password, google, email, ...campos } = req.body;
    if (OngDB.email != email) {
      const existeEmail = await Ong.findOne({ email });

      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe Ong con ese email",
        });
      }
    }
    // le anadimos el email modificado al objeto campos.
    if (!OngDB.google) {
      campos.email = email;
    } else if (OngDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Ongs de Google no pueden cambiar su correo",
      });
    }

    const OngActualizado = await Ong.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      Ong: OngActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const borrarOng = async (req, res = response) => {
  const uid = req.params.uid;
  try {
    const OngDB = await Ong.findById(uid);
    if (!OngDB) {
      return res.status(404).json({
        ok: false,
        msg: "Ong no encontrado",
      });
    }

    await Ong.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Ong Borrado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const getOng = async (req, res = response) => {
  const id = req.params.uid;
  try {
    const ong = await Ong.findById(id);
    res.json({
      ok: true,
      ong,
    });
  } catch (error) {
    res.json({
      ok: false,
      msg: "Ong no encontrado",
    });
  }
};

const favoritarOng = async (req, res = response) => {
  const _id = req.body.id;
  const uid = req.uid;
  try {
    const ong = await Ong.findById(_id);
    if (!ong) {
      res.status(404).json({
        ok: false,
        msg: "El Id no correspodne a una ong de la base",
      });
    }

    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    if (usuarioDB?.favoritos?.includes(_id)) {
      var arrayLength = usuarioDB.favoritos.length;
      for (var i = 0; i < arrayLength; i++) {
        if (usuarioDB.favoritos[i] == _id) {
          usuarioDB.favoritos = usuarioDB.favoritos.splice(i, i);
        }

      }
      // var filtered = usuarioDB.favoritos.filter((value) => {
      //   console.log(`VALUEE: ${value}`);
      //   console.log(`_id: ${_id}`);
      //   return value.trim() != _id.trim();
      // });
      // console.log(`FILTRO: ${filtered}`);

      // console.log(`FAVORITOS: ${usuarioDB.favoritos}`);
      ong.favorito = false;
    } else {
      usuarioDB.favoritos.push(_id);
      ong.favorito = true;
    }

    await Usuario.findByIdAndUpdate(uid, usuarioDB, {
      new: true,
    });

    res.json({
      ok: true,
      ong,
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
  getOng,
  getOngs,
  createOngs,
  actualizarOng,
  borrarOng,
  favoritarOng,
};
