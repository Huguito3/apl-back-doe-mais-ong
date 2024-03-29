const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { getMenuFrontEnd } = require("../helpers/menu-fronted");

const login = async (req, res = response) => {
  const { senha, email } = req.body;

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
    const validsenha = bcrypt.compareSync(senha, usuarioDB.senha);

    if (!validsenha) {
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
      usuario: usuarioDB
      // menu: getMenuFrontEnd(usuarioDB.role)
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
    // menu: getMenuFrontEnd(usuario.role)
  });
};

const changePassword = async (req, res = response) => {
  const { email, senhaAtual, novaSenha } = req.body;
  const uid = req.uid;
console.log('CHANGE PASSWORD');
  try {
    const usuarioDB = await Usuario.findOne({ email });
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email o contraseña invalida",
      });
    }
    console.log(usuarioDB);
    //Verificar Contrasena
    const validsenha = bcrypt.compareSync(senhaAtual, usuarioDB.senha);

    if (!validsenha) {
      return res.status(400).json({
        ok: false,
        msg: "contrasena no valida",
      });
    }

    //Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    const senhaalter = bcrypt.hashSync(novaSenha, salt);
    const update = { senha: senhaalter };
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, update, {
      new: true,
    });
    const token = await generarJWT(usuarioDB.id);
    res.json({
      ok: true,
      // usuario: usuarioActualizado,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};
module.exports = { login, renewToken, changePassword };
