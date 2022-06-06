const fs = require("fs");

const Usuario = require("../models/usuario");

const borrarImagen = (pathViejo) => {
  if (fs.existsSync(pathViejo)) {
    //Si existe vorramos la anterior
    fs.unlinkSync(pathViejo);
  }
};
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  let pathViejo = "";

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
   
    default:
      return false;
      break;
  }
};

module.exports = {
  actualizarImagen,
};
