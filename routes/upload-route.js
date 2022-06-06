/*
Path: /api/uploaads
*/
const { Router } = require("express");
const {fileUpload, retornoImagen } = require("../controllers/upload-controller");
const expressfileUpload = require('express-fileupload');


const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.use(expressfileUpload());

router.put("/:tipo/:id", validarJWT, fileUpload);

router.get("/:tipo/:foto", retornoImagen);
module.exports = router;
