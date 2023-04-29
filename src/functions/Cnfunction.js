
function formatdate(date) {
    datef = date.slice(0, 10).split('-');
    return `${datef[2]}-${datef[1]}-${datef[0]}`
};

function formatevalue(value) {
    newValue = value.replace('Chuck Norris', 'Chuck Norris'.toLocaleUpperCase())
    return newValue
};
function formatePiada(value) {
    newValue = value.replace(/"/g, '`')
    return newValue
};
function createJsonCN(dateupdate, datecreate, icon, id, piada, referencia) {
    let template = `{
            "data_atualizacao": "${dateupdate}",
                "data_criacao": "${datecreate}",
                    "icone": "${icon}",
                        "id": "${id}",
                            "piada": "${piada}",
                                "referencia": "${referencia}"
        }
        `
    tempJson = JSON.parse(template)
    return tempJson
};
module.exports = { formatdate, formatevalue, formatePiada, createJsonCN }









