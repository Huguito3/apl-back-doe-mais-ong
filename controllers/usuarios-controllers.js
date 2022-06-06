const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;
  
  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google image").skip(desde).limit(5),
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
  const { nombre, password, email } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }
    const usuario = new Usuario(req.body);

    //Encriptar Contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    
    await usuario.save();

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

    const { password, google, email, ...campos } = req.body;
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
    if (!usuarioDB.google) {
      campos.email = email;
    }else if(usuarioDB.email !== email){
      return res.status(400).json({
        ok: false,
        msg: "Usuarios de Google no pueden cambiar su correo",
      });
    }

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

const getUsuario= async (req, res = response) => {
  const id = req.params.uid;
  try {
    const usuario = await Usuario.findById(id)
    res.json({
      ok: true,
      usuario,
    });
    
  } catch (error) {
    res.json({
      ok: false,
      msg: 'Usuario no encontrado'
    });
  }
};
module.exports = {
  getUsuario,
  getUsuarios,
  createUsuarios,
  actualizarUsuario,
  borrarUsuario,
};
