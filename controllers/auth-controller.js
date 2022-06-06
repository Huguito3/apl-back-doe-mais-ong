const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-fronted");

const login = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    const usuarioDB = await Usuario.findOne({ email });
    //Por un tema de seguridad no decimos lo que esta errado. Otro punto para mejorar la seguridad contra bombardeo.
    //Es que uando da error demorar la respues propositalmente en 1 segundo.
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email o contraseña invalida",
      });
    }

    //Verificar Contrasena
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "contrasena no valida",
      });
    }

    //Si esta todo ok debemos generar un JWT.
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token: token,
      menu: getMenuFrontEnd(usuarioDB.role)
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
  const usuario = await Usuario.findById(uid);
  console.log("usuario");
  console.log(usuario);
  res.json({
    ok: true,
    token: token,
    usuario,
    menu: getMenuFrontEnd(usuario.role)
  });
};

module.exports = { login, renewToken };
