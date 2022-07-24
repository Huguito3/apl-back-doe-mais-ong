/*
    Ruta: api/Ong
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getOng,
  getOngs,
  createOngs,
  actualizarOng,
  borrarOng,
  favoritarOng,
} = require("../controllers/ong-controller");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarAdminRoleONG, validarAdminRoleOMismoOng} = require("../middlewares/validar-jwt");
const router = Router();
router.get("/:uid", validarJWT, getOng);
router.get("/", validarJWT, getOngs);
// router.post("/", createOngs);
// como queremos colocar vartios middlewares, colocamos un array.
router.post(
  "/",
  [
    
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  createOngs
);

router.post(
  "/favorita",
  [
    [
      validarJWT,
      check("id", "O id da ONG é necessario").not().isEmpty(),
      validarCampos,
    ],
  ],
  favoritarOng
);


router.put(
  "/:uid",
  [
    validarJWT,
    validarAdminRoleOMismoOng,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarOng
);

router.delete("/:uid",[validarJWT, validarAdminRoleONG], borrarOng);
module.exports = router;
