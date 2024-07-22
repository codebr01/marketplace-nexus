const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const LoginSchema = new mongoose.Schema({
  id: { type: String, required: true },
  usuario: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {

    await this.valida();

    if(this.errors.length > 0) return;

    this.user = await LoginModel.findOne({usuario: this.body.usuario});  
    
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

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({email: this.body.email});
    
    if (this.user) this.errors.push('Já existe um usuário com este email.');

  }

  async valida() {

    this.cleanUp();

    if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres');
  }

  cleanUp() {

    this.body = {
      usuario: this.body.usuario,
      password: this.body.password
    };
  }

  validaRegister() {

    this.cleanUpRegister(); 

    if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

    if(this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha precisa ter entre 3 e 50 caracteres');
  }

  cleanUpRegister() {

    this.body = {
      usuario: this.body.usuario,
      email: this.body.email,
      password: this.body.password[0]
    };
  }
}

module.exports = Login;