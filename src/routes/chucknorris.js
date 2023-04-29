const express = require('express')
const router = express.Router()

const CnController = require("../controllers/CnController.js")

router.get('/api/piadas', CnController.cnJson);

module.exports = router