const { response } = require("express");
const Categoria = require("../models/categoria");

const getCategorias = async (req, res) => {
  const tipo = req.params.tipo ;
  const categorias = await 
    Categoria.find({}, "id descricao tipo");
  const filtro = categorias.filter((categoria)=>{
    return categoria.tipo == tipo;
  });
 
  res.json({
    ok: true,
    categorias: filtro,
  });
};

const createCategoria = async (req, res) => {
//   const { codigo, descricao, tipo } = req.body;
  try {
    
    const categoria = new Categoria(req.body);

    await categoria.save();

    res.json({
      ok: true,
      categoria
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado.. revisar logs",
    });
  }
};


module.exports = {
 getCategorias,
 createCategoria
};
