const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const ValidaCPF = require('../../public/assets/js/ValidaCPF');
const { types } = require('@babel/core');
const { v4: uuidv4 } = require('uuid');

const ProdutorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nome: {type: String, required: true},
  sobrenome: {type: String, required: true},
  email: { type: String, required: true },
  password: { type: String, required: true },
  cpf: {type: String, required: true},
  telefone: {type: String, required: true}
});

const ProdutorModel = mongoose.model('Produtor', ProdutorSchema);

class Produtor {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if(this.errors.length > 0) return;

    this.user = await ProdutorModel.findOne({email: this.body.email});  
    
    if (!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    } 

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida.');
      this.user = null;
      return;
    }

  }

  async register() {
    this.validaRegister();

    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;
    
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.body.id = uuidv4();

    this.user = await ProdutorModel.create(this.body);
  }

  async userExists() {
    this.user = await ProdutorModel.findOne({email: this.body.email});
    
    if (this.user) this.errors.push('Já existe um usuário com este email.');
  
  }

  valida() {

    this.cleanUp(); 

    if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

    if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres');
  }

  cleanUp() {

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }

  validaRegister() {

    if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

    if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres');

    const cpfValido = new ValidaCPF(this.body.cpf);

    if(!cpfValido.valida()) this.errors.push('CPF INVALIDO');

  }

  cleanUpRegister() {

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      password: this.body.password,
      cpf: this.body.cpf,
      telefone: this.body.telefone
    };
  }
}

module.exports = Produtor;