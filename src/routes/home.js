const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>
    res.send("Esse trabalho percente ao Grupo-1"));

module.exports = router