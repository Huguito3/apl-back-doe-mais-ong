require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { dbConnection } = require("./database/config");

//Crear el servidor express
const app = express();
//Definimos el CORS, el use es un middleware.
app.use(cors());
//Lectura y parseo del body..tien que estar antes de la rutas.
app.use(express.json());
// Base de datos
dbConnection();

// Directorio Publico. Ao executar a url no navegodr veremos nosso index html
app.use(express.static("public"));

//Rutas
app.use("/api/usuarios", require("./routes/usuarios-routes"));
app.use("/api/login", require("./routes/auth-routes"));
app.use("/api/upload", require("./routes/upload-route"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto: " + 3000);
});
