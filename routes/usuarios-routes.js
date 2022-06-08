/*
    Ruta: api/usuarios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsuario,
  getUsuarios,
  createUsuarios,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios-controllers");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarAdminRole, validarAdminRoleOMismoUsuario} = require("../middlewares/validar-jwt");
const router = Router();
router.get("/:uid", validarJWT, getUsuario);
router.get("/", validarJWT, getUsuarios);
// router.post("/", createUsuarios);
// como queremos colocar vartios middlewares, colocamos un array.
router.post(
  "/",
  [
    // check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  createUsuarios
);

router.put(
  "/:uid",
  [
    validarJWT,
    validarAdminRoleOMismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:uid",[validarJWT, validarAdminRole], borrarUsuario);
module.exports = router;
