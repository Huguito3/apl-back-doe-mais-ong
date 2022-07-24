const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nome email image nascimento sexo contato")
      .skip(desde)
      .limit(5),
    Usuario.countDocuments(),
  ]);
  res.json({
    ok: true,
    usuarios,
    uid: req.uid,
    total,
  });
};

const createUsuarios = async (req, res) => {
  const { senha, email } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "O email ja esta registrado",
      });
    }
    req.body["nascimento"] = "";
    req.body["nome"] = "";
    req.body["sexo"] = "";
    req.body["contato"] = "";
    const usuario = new Usuario(req.body);

    //Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    usuario.senha = bcrypt.hashSync(senha, salt);

    await usuario.save();

    //   "usuario": {
    //     "email": "hugo5@gmail.com",
    //     "favoritos": [],
    //     "apoios": [],
    //     "uid": "62dd7dd471be8b96c610ceb4"
    // },

    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
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

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const { senha, email, ...campos } = req.body;
    if (usuarioDB.email != email) {
      const existeEmail = await Usuario.findOne({ email });

      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe usuario con ese email",
        });
      }
    }
    // le anadimos el email modificado al objeto campos.
    // if (!usuarioDB.google) {
    //   campos.email = email;
    // }else if(usuarioDB.email !== email){
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "Usuarios de Google no pueden cambiar su correo",
    //   });
    // }
    campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const actualizarUsuarioPropio = async (req, res = response) => {
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    const { ...campos } = req.body;

    // campos.email = email;
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    // const {...usuretorno} = usuarioActualizado;
    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario Borrado",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};

const getUsuario = async (req, res = response) => {
  const uid = req.uid;
  try {
    const usuario = await Usuario.findById(uid);

    if(!(usuario?.sexo)){
      usuario.sexo = "";
    }

    if(!(usuario?.nascimento)){
      usuario.nascimento = "";
    }

    if(!(usuario?.nome)){
      usuario.nome = "";
    }

    if(!(usuario?.contato)){
      usuario.contato = "";
    }



    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    res.json({
      ok: false,
      msg: "Usuario não encontrado",
    });
  }
};
module.exports = {
  getUsuario,
  getUsuarios,
  createUsuarios,
  actualizarUsuario,
  actualizarUsuarioPropio,
  borrarUsuario,
};
