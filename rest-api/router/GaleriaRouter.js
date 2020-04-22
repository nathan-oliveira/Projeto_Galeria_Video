const express = require('express');
const router = express.Router();

const GaleriaModel = require('../model/GaleriaModel');
const RepostaClass = require('../model/RespostaClass');

let pastaPublic = './public/arquivos/';
let path = require('path');
let fs = require('fs')

let multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pastaPublic)
  },
  filename: function (req, file, cb) {
    let nomeArquivo = `${file.fieldname.replace(/\//g, '')}-${Date.now()}.${path.extname(file.originalname)}`;
    req.body.caminho = pastaPublic + nomeArquivo;
    cb(null, nomeArquivo)
  }
})

var upload = multer({storage: storage})

function deletarArquivo(caminho) {
  if(caminho != null) {
    fs.unlinkSync(caminho);
    console.log('arquivo deletado');
  }
}

router.post('/', upload.single('arquivo'), function(req, resp, next) {
  let resposta = new RepostaClass();

  if(req.file != null) {
    GaleriaModel.adicionar(req.body, function(error, retorno) {
      if(error) {
        resposta.erro = true;
        resposta.msg = "Ocorreu um erro."
        console.log("Erro ", error);
        deletarArquivo(req.body.caminho);
      } else {
        if(retorno.affectedRows > 0) {
          resposta.msg = "Cadastro realizado com sucesso"
        } else {
          resposta.erro = true;
          resposta.msg = "Não foi possivel realizar a operação."
          console.log("Erro: ", resposta.msg);
          deletarArquivo(req.body.caminho);
        }
      }
      console.log('resp: ', resposta);
      resp.json(resposta);
    });
  } else {
    resposta.erro = true;
    resposta.msg = "Não foi enviado um vídeo."
    resp.json(resposta);
  }
});

router.put('/', upload.single('arquivo'), function(req, resp, next) {
  let resposta = new RepostaClass();

  GaleriaModel.editar(req.body, function(error, retorno) {
    if(error) {
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro."
      console.log("Erro ", error);
      deletarArquivo(req.body.caminho);
    } else {
      if(retorno.affectedRows > 0) {
        resposta.msg = "Cadastro alterado com sucesso"
      } else {
        resposta.erro = true;
        resposta.msg = "Não foi possivel alterar o cadastro."
        console.log("Erro: ", resposta.msg);
        deletarArquivo(req.body.caminho);
      }
    }
    console.log('resp: ', resposta);
    resp.json(resposta);
  });
});

router.get('/', function(req, resp, next) {
  GaleriaModel.getTodos(function(error, retorno) {
    let resposta = new RepostaClass();

    if(error) {
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro."

      console.log("Erro ", resposta.msg);
    } else {
      resposta.dados = retorno;
    }

    resp.json(resposta);
  });
});

router.get('/:id?', function(req, resp, next) {
  GaleriaModel.getId(req.params.id, function(error, retorno) {
    let resposta = new RepostaClass();

    if(retorno.affectedRows > 0) {
      resposta.msg = "Cadastro alterado com sucesso"
    } else {
      resposta.erro = true;
      resposta.msg = "Não foi possivel alterar o cadastro."
      console.log("Erro: ", resposta.msg);
      deletarArquivo(req.body.caminho);
    }

    resp.json(resposta);
  });
});

router.delete('/:id?', function(req, resp, next) {
  GaleriaModel.deletar(req.params.id, function(error, retorno) {
    let resposta = new RepostaClass();

    if(retorno.affectedRows > 0) {
      resposta.msg = "Cadastro deletado com sucesso"
    } else {
      resposta.erro = true;
      resposta.msg = "Não foi possivel alterar o cadastro."
      console.log("Erro: ", resposta.msg);
    }

    resp.json(resposta);
  });
});

module.exports = router;