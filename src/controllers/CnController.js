const express = require('express')
const router = express.Router()
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');

const func = require("../functions/Cnfunction.js")

exports.cnJson = async (req, res) => {
    try {
        const { data } = await axios("https://api.chucknorris.io/jokes/random")
        const dateupdate = func.formatdate((data.updated_at))
        const datecreate = func.formatdate((data.created_at))
        const icon = data.icon_url
        const id = uuidv4();
        const piada = func.formatePiada(func.formatevalue(data.value));
        const referencia = data.url

        const returnValueCN = func.createJsonCN(dateupdate, datecreate, icon, id, piada, referencia)

        res.send(returnValueCN)
    } catch (error) {
        res.send({ error: error.message })
    }
}