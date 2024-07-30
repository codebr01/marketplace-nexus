const mongoose = require('mongoose');
const { types } = require('@babel/core');
const { v4: uuidv4 } = require('uuid');

const CarrinhoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  idCliente: { type: String, required: true },
  produtos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: false }],
  valor: { type: Number, required: false },
});

const CarrinhoModel = mongoose.model('Carrinho', CarrinhoSchema);

class Carrinho {
  constructor() {
    this.body = {};
    this.produtos = [];
    this.errors = [];
    this.carrinho = null;
  }

  async getCarrinho(id) {
    const carrinho = await CarrinhoModel.findOne({ idCliente: id });
    return carrinho;
  }


  async register(idCliente) {

    this.body.id = uuidv4();

    this.body.idCliente = idCliente

    this.carrinho = await CarrinhoModel.create(this.body);
    
  }

  async adicionar() {

    this.cleanUp();

    this.body.id = uuidv4();

    this.Carrinho = await CarrinhoModel.create(this.body);
    
  }

  cleanUp() {

    this.body = {
      idLoja: this.body.idLoja,
      nome: this.body.nome,
      valor: this.body.valor,
      descricao: this.body.descricao
    };
  }

  async getAllProdutos() {
    const produtos = await ProdutoModel.find();
    return produtos;
  }

  async getProdutos(idLoja) {
    const produtos = await ProdutoModel.find({ idLoja });
    return produtos;
  }

  async excluirProduto(id) {
    const produto = await ProdutoModel.findOneAndDelete({ _id: id });
    return produto;
  }

  async editProduto (id) {
    if (typeof id !== 'string') return;
  
    if (this.errors.length > 0) return;
  
    this.produto = await ProdutoModel.findByIdAndUpdate(id, this.body, { new: true });
  }
  
}

module.exports = Carrinho;