const express = require('express');
const app = express()


const homeRoutes = require('./routes/home.js')
const chunkNorrisRoutes = require('./routes/chucknorris.js')
const atividadeRoutes = require('./routes/atividade.js')

app.use(chunkNorrisRoutes)
app.use(homeRoutes)
app.use(atividadeRoutes)


app.listen(8080, () => {
    console.log(`Rodando na porta 8080`)
})
