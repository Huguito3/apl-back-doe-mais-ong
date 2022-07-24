const fs = require("fs");

const Usuario = require("../models/usuario");
const Campanha = require("../models/campanha");
const Ong = require("../models/ong");

const borrarImagen = (pathViejo) => {
  if (fs.existsSync(pathViejo)) {
    //Si existe vorramos la anterior
    fs.unlinkSync(pathViejo);
  }
};
const actualizarImagen = async (tipo, subtipo, id, nombreArchivo) => {
  let pathViejo = "";
  console.log(`***TIPO: ${tipo}`);
  console.log(`***TIPO: ${subtipo}`);
  switch (tipo) {
    case "usuarios":
      const usuario = await Usuario.findById(id);
      console.log(usuario);
      if (!usuario) {
        console.log("No es un usuario");
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.image}`;
      borrarImagen(pathViejo);

      usuario.image = nombreArchivo;
      await usuario.save();
      return true;
      break;
    case "campanhas":
      const campanha = await Campanha.findById(id);
      console.log(campanha);
      if (!campanha) {
        console.log("Não existe essa campanha");
        return false;
      }

      if (subtipo === "avatar" ) {
        if(campanha.imagens.avatar){
          pathViejo = `./uploads/campanhas/avatar/${campanha.imagens.avatar}`;
          borrarImagen(pathViejo);
        }
       
        campanha.imagens.avatar = nombreArchivo;
      } else {
        campanha.imagens.galeria.push(nombreArchivo);
      }

      await campanha.save();
      return true;
      break;
    case "ongs":
      const ong = await Ong.findById(id);
      console.log(ong);
      if (!ong) {
        console.log("Não existe essa ong");
        return false;
      }

      if (subtipo === "avatar") {
        if (ong.imagens.avatar) {
          pathViejo = `./uploads/ongs/avatar/${ong.imagens.avatar}`;
          borrarImagen(pathViejo);
        }
        ong.imagens.avatar = nombreArchivo;
      } else {
        ong.imagens.galeria.push(nombreArchivo);
      }

      await ong.save();
      return true;
      break;
    default:
      return false;
      break;
  }
};

module.exports = {
  actualizarImagen,
};
