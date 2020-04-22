const express = require('express');
const bodyparser = require('body-parser'); // recebe dados por requisão e pode transforma de json para obj etc...

const cors = require('cors'); // trata requisição que não é da mesma api/ trata problemas de requisição
const api = express();
const porta = 3000;
const router = express.Router();

const galeriaRouter = require('./router/GaleriaRouter');

api.use(cors());

api.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
api.use(bodyparser.json({ limit: '50mb', extended: true }));

api.use('/public', express.static(__dirname + '/public'));
// api.use(express.static('public'));

router.get('/', (req, resp) => resp.json({
  mensagem: '=> API Online!'
}));

api.use('/', router);
api.use('/galeria', galeriaRouter);

api.listen(porta);
console.log('Run API Express')