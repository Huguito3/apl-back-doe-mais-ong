/*
    Ruta: /api/login
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { login, renewToken, changePassword } = require("../controllers/auth-controller");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/",
  [
    check("senha", "Senha é obrigatorio").not().isEmpty(),
    check("email", "Email é obrigatorio").isEmail(),
    validarCampos
  ],
  login
);

router.post(
  "/changePassword",
  [
    validarJWT,
    check("senhaAtual", "Senha é obrigatorio").not().isEmpty(),
    check("novaSenha", "Nova Senha é obrigatorio").not().isEmpty(),
    check("email", "Email é obrigatorio").isEmail(),
    validarCampos
  ],
  changePassword
);

router.get(
  "/renew",
  validarJWT,
  renewToken
);

module.exports = router;
