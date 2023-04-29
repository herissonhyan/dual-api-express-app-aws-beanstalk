function createJsonAT(id, atividades, tipo, participantes, acessibilidade) {
    let template = `{
        "id": "${id}",
        "atividade": "${atividades}",
        "tipo": "${tipo}",
        "participantes": ${participantes},
        "acessibilidade": "${acessibilidade}"
      }
    `
    tempJson = JSON.parse(template)
    return tempJson
};

function formatAcc(acc) {
    newAcc = `${(parseFloat(acc)) * 100}%`
    return newAcc
};

module.exports = { createJsonAT, formatAcc }