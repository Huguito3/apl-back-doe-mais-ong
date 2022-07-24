/*
    Ruta: api/usuarios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
 getCategorias,
 createCategoria
} = require("../controllers/categoria-controller");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT} = require("../middlewares/validar-jwt");
const router = Router();


router.get("/:tipo", validarJWT, getCategorias);

router.post(
  "/",
  [
    // validarJWT,
    check("id", "Codigo é obrigatorio").not().isEmpty(),
    check("descricao", "Descricao é obrigatoria").not().isEmpty(),
    validarCampos,
  ],
  createCategoria
);

module.exports = router;
