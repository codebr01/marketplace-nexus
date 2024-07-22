const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const ValidaCPF = require('../../public/assets/js/ValidaCPF');
const { types } = require('@babel/core');
const { v4: uuidv4 } = require('uuid');

const ProdutoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  idLoja: { type: String, required: true },
  nome: {type: String, required: true},
  valor: {type: String, required: true},
  descricao: { type: String, required: true }
});

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

class Produto {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.produto = null;
  }

  async register() {

    this.cleanUp();

    this.body.id = uuidv4();

    this.produto = await ProdutoModel.create(this.body);
    
  }

  cleanUp() {

    this.body = {
      idLoja: this.body.idLoja,
      nome: this.body.nome,
      valor: this.body.valor,
      descricao: this.body.descricao
    };
  }

  async getProdutos(idLoja) {
    const produtos = await ProdutoModel.find({ idLoja });
    return produtos;
  }

  async excluirProduto(id) {
    const produto = await ProdutoModel.findOneAndDelete({ id });
    return produto;
  }
  
}

module.exports = Produto;