const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

const func = require("../functions/Atfunctions.js")

exports.atJson = async (req, res) => {
    try {
        const { data } = await axios("https://www.boredapi.com/api/activity")
        const id = uuidv4()
        const atividades = data.activity
        const tipo = data.type
        const participantes = data.participants
        const acessibilidade = func.formatAcc(data.accessibility)

        const returnValueAT = func.createJsonAT(id, atividades, tipo, participantes, acessibilidade)

        res.send(returnValueAT)
    } catch (error) {
        res.send({ error: error.message })
    }

}