const { Router } = require("express");
const { check } = require("express-validator");
const { login, renewToken } = require("../controllers/auth-ong-controller");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

router.post(
  "/",
  [
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos
  ],
  login
);


router.get(
  "/renew",
  validarJWT,
  renewToken
);

module.exports = router;
