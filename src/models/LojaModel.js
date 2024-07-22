const mongoose = require('mongoose');
const validator = require('validator');
const ValidaCPF = require('../../public/assets/js/ValidaCPF');
const { v4: uuidv4 } = require('uuid');
const Produto = require('../models/ProdutoModel');

const LojaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  idProdutor: { type: String, required: true },
  nomeProdutor: { type: String, required: true },
  sobrenomeProdutor: { type: String, required: false , default: ''},
  cpfProdutor: { type: String, required: false , default: ''}, // validar
  nacionalidadeProdutor: { type: String, required: false , default: ''},
  nomeLoja: { type: String, required: true }, // validar
  email: { type: String, required: false , default: ''}, // validar
  telefone: { type: String, required: false , default: ''},
  cep: { type: String, required: false , default: ''},
  uf: { type: String, required: false , default: ''},
  cidade: { type: String, required: false , default: ''},
  bairro: { type: String, required: false , default: ''},
  rua: { type: String, required: false , default: ''},
  numeroRua: { type: String, required: false , default: ''},
  complemento: { type: String, required: false , default: ''},
  criadoEm: { type: Date, default: Date.now}
});

const LojaModel = mongoose.model('Loja', LojaSchema);

function Loja(body) {
  this.body = body;
  this.errors = [];
  this.loja = null;
}

Loja.prototype.register = async function() {
  this.valida();
  if (this.errors.length > 0) return;
  this.body.id = uuidv4();
  this.loja = await LojaModel.create(this.body);
};

Loja.prototype.valida = function() {

  this.cleanUp();

  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email inválido');
  
  if(!this.body.nomeProdutor) this.errors.push('Nome é um campo obrigatório.');

  const cpfValido = new ValidaCPF(this.body.cpfProdutor);

  if(cpfValido.valida() === 'false') this.errors.push('CPF inválido');

  if(!this.body.nomeLoja) this.errors.push('Nome da Loja é um campo obrigatório.');

  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato deve ser enviado: email ou telefone.'); 
  }

  if(!this.validarTelefone(this.body.telefone)) {
    this.errors.push('Telefone já cadastrado.');
  }

}

Loja.prototype.validarTelefone = async function(telefone) {
  try {
    const telefoneExistente = await LojaModel.findOne({ telefone: telefone });
  }catch(err) {
    this.errors.push('Erro ao verificar o telefone.');
  }
};

Loja.prototype.cleanUp = function() {
  for(const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    idProdutor: this.body.idProdutor,
    nomeProdutor: this.body.nome,
    sobrenomeProdutor: this.body.sobrenome,
    cpfProdutor: this.body.cpf,
    nacionalidadeProdutor: this.body.nacionalidade,
    nomeLoja: this.body['nome-loja'],
    email: this.body.email,
    telefone: this.body.telefone,
    cep: this.body.cep,
    uf: this.body.uf,
    cidade: this.body.cidade,
    bairro: this.body.bairro,
    rua: this.body.endereco,
    numeroRua: this.body['num-endereco'],
    complemento: this.body.complemento,
  };
}

Loja.prototype.edit = async function(id) {
  if (typeof id !== 'string') return;

  this.valida();

  if (this.errors.length > 0) return;

  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

Loja.buscarProdutos = async function(idLoja) {
  const produtos = await new Produto().getProdutos(idLoja);
  return produtos;
}

Loja.buscarProduto = async function(id) {
  const produto = await new Produto().getProduto(id);
  return produto;
}

Loja.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const loja = await LojaModel.findById(id);
  return loja;
}

Loja.buscaPorEmail = async function(email) {
  if(typeof email !== 'string') return;
  const loja = await LojaModel.findOne({ email: email });
  return loja;
}

Loja.excluirProduto = async function(id) {
  if(typeof id !== 'string') return;
  const produto = await new Produto().excluirProduto(id);
  return produto;
}

module.exports = Loja;