const { response } = require("express");
const bcrypt = require("bcryptjs");
const Ong = require("../models/ong");
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-fronted");

const login = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    const ongDB = await Ong.findOne({ email });
    //Por un tema de seguridad no decimos lo que esta errado. Otro punto para mejorar la seguridad contra bombardeo.
    //Es que uando da error demorar la respues propositalmente en 1 segundo.
    if (!ongDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email o contraseña invalida",
      });
    }

    //Verificar Contrasena
    const validPassword = bcrypt.compareSync(password, ongDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contrasena no valida",
      });
    }

    //Si esta todo ok debemos generar un JWT.
    const token = await generarJWT(ongDB.id);

    res.json({
      ok: true,
      token: token,
      menu: getMenuFrontEnd(ongDB.role)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};


const renewToken = async (req, res = response) => {
  const uid = req.uid;
  const token = await generarJWT(uid);
  const ong = await Ong.findById(uid);
  console.log("Ong");
  console.log(ong);
  res.json({
    ok: true,
    token: token,
    ong,
    // menu: getMenuFrontEnd(ong.role)
  });
};

module.exports = { login, renewToken };
