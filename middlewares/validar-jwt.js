const { request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

// A importação do request, e so para importar o modelo do parametro. Ajuda a vr os metodos que tem.
const validarJWT = (req = request, res, next) => {
  //Leer el token..Nombre que le voy a dar en el header.
  const token = req.header("x-token");
  if (!token) {
    return res.status(404).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_TOKEN);
    //Estamos em um middlewre que se va a ejecutar antes del obtener usuario
    //Aqyu obtenems el uid del token que la persona hizo en el login, y lo grabamos en la req para que se pueda utilizar en
    //algun metodo mas adelante
    req.uid = uid;
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "Token incorreto",
    });
  }

  next();
};

const validarAdminRole = async (req, res, next) => {
  const uid = req.uid;
  console.log(uid);
  try {
    const usuairoDb = await Usuario.findById(uid);
    if (!usuairoDb) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }
    if (usuairoDb.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para realizar la tarea",
      });
    }
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validarAdminRoleOMismoUsuario = async (req, res, next) => {
  // l uid es el uid del token, o sea del usuario que hiso el login.
  const uid = req.uid;
  // este id es el id que viene en la url, o sea el usuario que estoy queriendo modificar
  const id = req.params.uid;
  console.log(id);
  try {
    const usuairoDb = await Usuario.findById(uid);
    if (!usuairoDb) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }
    console.log(uid);
    console.log(id);
    if (usuairoDb.role === "ADMIN_ROLE" || uid === id) {
      next();

    } else {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para realizar la tarea",
      });
    }
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validarJWT,
  validarAdminRole,
  validarAdminRoleOMismoUsuario,
};
