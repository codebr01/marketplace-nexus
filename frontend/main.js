import 'core-js/stable';
import 'regenerator-runtime/runtime';

import './assets/css/style_login.css';

import Login from './modules/Login';

const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');

login.init();
cadastro.init();