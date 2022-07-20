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
  actualizarUsuarioPropio,
  borrarUsuario,
} = require("../controllers/usuarios-controllers");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarAdminRole, validarAdminRoleOMismoUsuario} = require("../middlewares/validar-jwt");
const router = Router();
// router.get("/:uid", validarJWT, getUsuario);/perfil
router.get("/perfil", validarJWT, getUsuario);
router.get("/", validarJWT, getUsuarios);
// router.post("/", createUsuarios);
// como queremos colocar vartios middlewares, colocamos un array.
router.post(
  "/cadastrar",
  [
    // check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("senha", "Senha é obrigatoria").not().isEmpty(),
    check("email", "Email é obrigatoria").isEmail(),
    validarCampos,
  ],
  createUsuarios
);

// router.put(
//   "/:uid",
//   [
//     validarJWT,
//     validarAdminRoleOMismoUsuario,
//     check("nombre", "El nombre es obligatorio").not().isEmpty(),
//     check("email", "El email es obligatorio").isEmail(),
//     check("role", "El role es obligatorio").not().isEmpty(),
//     validarCampos,
//   ],
//   actualizarUsuario
// );

router.put(
  "/perfil",
  [
    validarJWT,
    // validarAdminRoleOMismoUsuario,
    check("nome", "O nome é obrigatorio").not().isEmpty(),
    check("nascimento", "Nascimento é obrigatorio").not().isEmpty(),
    check("sexo", "Sexo é obrigatorio").not().isEmpty(),
    check("contato", "Contato é obrigatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuarioPropio
);
router.delete("/:uid",[validarJWT, validarAdminRole], borrarUsuario);
module.exports = router;
