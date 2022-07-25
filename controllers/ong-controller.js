const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Ong = require("../models/ong");
const Usuario = require("../models/usuario");
const Campanha = require("../models/campanha");

const getOngs = async (req, res) => {
  // const desde = Number(req.query.desde) || 0;
  const uid = req.uid;
  const usuarioDB = await Usuario.findById(uid);

  const [Ongs, total] = await Promise.all([Ong.find(), Ong.countDocuments()]);

  var arrayLength = Ongs.length;
  for (var i = 0; i < arrayLength; i++) {
    if (usuarioDB?.favoritos?.includes(Ongs[i]._id)) {
      Ongs[i].favorito = true;
    } else {
      Ongs[i].favorito = false;
    }
  }
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
  const uid = req.uid;
  try {
    const ong = await Ong.findById(id);

    const usuarioDB = await Usuario.findById(uid);
    const camp = await Campanha.find();

    const campanhas = camp.filter((campanha) => {
      return campanha.ong._id == id;
    });

    campanhas.map((campanha) => {
      if (dateCompare(campanha.dataFinal)) {
        ong.campanhasAtivas +=1;
      } else {
        ong.campanhasEncerradas+=1;
      }
    });

    if (usuarioDB?.favoritos?.includes(ong._id)) {
      ong.favorito = true;
    } else {
      ong.favorito = false;
    }
    res.json({
      ok: true,
      ong,
      campanhas,
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
      ong.favorito = false;
    } else {
      usuarioDB.favoritos.push(_id);
      console.log(`FAVORITOS: ${usuarioDB.favoritos}`);
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

function dateCompare(d1) {
  const date1 = new Date(d1);
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  if (date1 < formattedToday) {
    console.log(`${date1} esta ativa ${formattedToday}`);
    return true;
  } else {
    console.log(`${date1} esta desativa ${formattedToday}`);
    return false;
  }
}
module.exports = {
  getOng,
  getOngs,
  createOngs,
  actualizarOng,
  borrarOng,
  favoritarOng,
};
