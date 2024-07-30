const mongoose = require('mongoose');
const { types } = require('@babel/core');
const { v4: uuidv4 } = require('uuid');

const CarrinhoSchema = new mongoose.Schema({
  idCliente: { type: String, required: true },
  produtos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true }],
  precoTotal: { type: String, required: false }
});

const CarrinhoModel = mongoose.model('Carrinho', CarrinhoSchema);

class Carrinho {
  constructor(carrinho) {
    this.carrinho = carrinho;
  }

  async guardarCarrinho(carrinho) {

    this.cleanUp();

    this.carrinho = carrinho
  
    console.log(this.carrinho);

    this.carrinho = await CarrinhoModel.create(this.carrinho);
    
  }

  async getCarrinho(idCliente) {
    const carrinho = await CarrinhoModel.findOne({ idCliente });
    return carrinho;
  }

  async atualizarCarrinho(id, carrinho) {
    
    this.carrinho = await CarrinhoModel.findByIdAndUpdate(id, carrinho, { new: true });
    
  }

  async apagarCarrinho(idCliente) {
    const carrinho = await CarrinhoModel.findOneAndDelete({ idCliente: idCliente });
    return carrinho;
  }

  cleanUp() {

    this.carrinho = {
      idCliente: this.carrinho.idCliente,
      produtos: this.carrinho.produtos,
      precoTotal: this.carrinho.precoTotal
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