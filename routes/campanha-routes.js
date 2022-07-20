/*
./routes/hospital-routes
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
    getCampanhas,
    getCampanha,
    createCampanha,
    updateCampanha,
    deleteCampanha,
} = require("../controllers/campanhas-controllers");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validarUserOng} = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCampanhas);
router.get("/:uid", validarJWT, getCampanha);
router.post(
  "/",
  [
    validarJWT,
    check("nome", "O nome da Campanha é necessario").not().isEmpty(),
    validarCampos,
    validarUserOng
  ],
  createCampanha
);

router.put(
  "/:uid",
  [
    validarJWT,
    check("nombre", "O nome da Campanha é necessario").not().isEmpty(),
    validarCampos,
  ],
  updateCampanha
);

router.delete("/:uid", validarJWT, deleteCampanha);

module.exports = router;
