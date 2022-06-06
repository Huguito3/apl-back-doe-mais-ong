const pathnode = require("path");
const fs = require("fs");
const { response, request } = require("express");
const { v4: uuidv4 } = require("uuid");

const { actualizarImagen } = require("../helpers/actualizar-imagenes");

const fileUpload = async (req = request, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  const tiposValidos = ["usuarios"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }

  //Procesar la imagen

  const file = req.files.imagen;
  const nombreCortado = file.name.split(".");
  const extensionArchivo = nombreCortado[nombreCortado.length - 1];

  //   validar extension

  const extensionesValidas = ["png", "jpg", "jpeg", "gif"];
  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un tipo valido",
    });
  }

  //Ahora precisamos generar un uid unico, para no tener problemas con los nombres de los archivos.

  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

  //Path para guardar la imagen

  const path = `./uploads/${tipo}/${nombreArchivo}`;

  //Para mover la pagina dentro de las carpetas. Podriamso tal vez usar un serviço tipo amazon de bucket para guardar las imagenes
  // Use the mv() method to place the file somewhere on your server
  //No es buena practica que este en el mism perver las imagenes.
  file.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo Subido",
      nombreArchivo,
    });
  });
};

const retornoImagen = (req, res = response) => {
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  const pathImg = pathnode.join(__dirname, `../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  }else{
    const pathImg = pathnode.join(__dirname, '../uploads/no-img.jpg');
    res.sendFile(pathImg);
  }
};

module.exports = { fileUpload, retornoImagen };
