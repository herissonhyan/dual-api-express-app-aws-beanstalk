const express = require('express')
const router = express.Router()

const AtividadeController = require("../controllers/AtividadeController.js")


router.get('/api/atividades', AtividadeController.atJson)

module.exports = router