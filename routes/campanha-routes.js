/*
./routes/hospital-routes
*/
const { Router } = require("express");
const { check } = require("express-validator");
const {
    getCampanhas,
    createCampanha,
    updateCampanha,
    deleteCampanha,
} = require("../controllers/campanhas-controllers");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

router.get("/", validarJWT, getCampanhas);
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "O nome da Campanha é necessario").not().isEmpty(),
    validarCampos,
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
