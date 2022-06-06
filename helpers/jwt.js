const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    //En el payload colocaremos el uid por ahora
    const payload = {
      uid,
    };
    //Definimos nuestra llave privada, esa es la llavbe que asegura que la repsuesta salio de este servidor.
    jwt.sign(
      payload,
      process.env.JWT_TOKEN,
      {
        expiresIn: "12h",
      },
      (err, token) => {
        if (err) {
          console.log(error);
          reject("No se pudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
    generarJWT
}