const express = require('express');
const router = express.Router();
const testesController = require('../controllers/testescontrollers.js');


//visualizar testes
router.get('/', testesController.listarTestes);

//adicionar novo teste
router.post('/teste/adicionar', testesController.adicionar);

//atualizar quantidade (+1)
router.post('/teste/:id/adicionar', testesController.adicionarQuantidade);

//retirar quantidade (-1)
router.post('/teste/:id/retirar', testesController.retirar);

//excluir teste
router.post('/teste/:id/excluir', testesController.excluir);

module.exports = router;