# Avaliação Sprint 4 - Programa de Bolsas Compass UOL / AWS e IFCE

> Avaliação da quarta sprint do programa de bolsas Compass UOL para formação em machine learning para AWS.

## Objetivos

Com base nas atividades anteriores realizadas, criamos uma aplicação Node.js (express) que consome duas APIs distintas e efetuamos o deploy na AWS Elastic Beanstalk.

## Ferramentas / plataformas utilizadas

* Visual Studio Code (VS Code)
* Node.js
* Github
* Amazon Web Services (AWS)

## Especificações
Nossa aplicação possui a seguinte estrutura, com divisão de responsabilidades em arquivos/pastas distintos:

![img01](https://uploaddeimagens.com.br/images/004/299/310/full/imagem_2023-01-14_192932724.png?1673735373)

Dentro da **src** temos três pastas onde dividimos as tarefas executadas por nossa aplicação, visando uma melhor organização:

* **controllers:** responsável por armazenar  os arquivos js que fazem a requisição dos dados obtido através das APIs.
* **functions:** responsável por armazenar os arquivos js que possuem as funções utilizadas na formatação dos dados obtidos pelas APIs.
* **routes:** responsável por armazenar os arquivos js que referenciam nossas rotas.

## Execução (Código Fonte)

Nossa aplicação Node.js possui as seguintes dependências:

* **express:** framework para Node.js que fornece recursos mínimos para construção de servidores web.
* **axios:** cliente HTTP baseado em promessas para o Node.js e para o navegador
* **uuid:** gerador de identificador único universal.

A raíz de nossa aplicação é o **app.js**, que possui o seguinte formato:

```javascript
// Instanciação da aplicação express
const express = require('express');
const app = express()

// Requisição dos arquivos de rota
const homeRoutes = require('./routes/home.js')
const chunkNorrisRoutes = require('./routes/chucknorris.js')
const atividadeRoutes = require('./routes/atividade.js')

// Consumo das rotas
app.use(chunkNorrisRoutes)
app.use(homeRoutes)
app.use(atividadeRoutes)

// Aplicação escutando/rodando na porta 8080 (localhost)
app.listen(8080, () => {
    console.log(`Rodando na porta 8080`)
})
```

## Rotas

Adentrando a pasta **routes**, em nossa aplicação temos basicamente três rotas, uma com a raiz do projeto e duas que retornam informações vindas de APIs externas formatadas de acordo com especificações estabelecidas.

***

### Rota → Get /

Rota presente no arquivo **home.js** com a seguinte estrutura:

```javascript
// Instanciação da biblioteca express e seu módulo router
const express = require('express')
const router = express.Router()

// Efetuado get na raíz do projeto
router.get('/', (req, res) =>

    // Texto de retorno da rota
    res.send("Esse trabalho percente ao Grupo-1"));

// Exportação do módulo router
module.exports = router
```

***

### Rota → Get /api/piadas

Rota presente no arquivo **chucknorris.js** com a seguinte estrutura:

```javascript
const express = require('express')
const router = express.Router()

const CnController = require("../controllers/CnController.js")

router.get('/api/piadas', CnController.cnJson);

module.exports = router
```

Semelhante à rota anterior, possuímos quase a mesma estrutura, mas desta vez nossa rota utilizará como parâmetro do get a função **cnJson** presente no **CnController.js**.

***

### Rota → Get /api/atividades

Rota presente no arquivo **atividade.js** com a seguinte estrutura:

```javascript
const express = require('express')
const router = express.Router()

const AtividadeController = require("../controllers/AtividadeController.js")

router.get('/api/atividades', AtividadeController.atJson)

module.exports = router
```

Semelhante às rota anteriores, possuímos quase a mesma estrutura, mas desta vez nossa rota utilizará como parâmetro do get a função **atJson** presente no **AtividadeController.js**.

***

## Controladores

Adentrando a pasta **controllers**, temos os arquivos js responsáveis pela requisição dos dados obtido através das APIs, exportando o JSON para as rotas adequadas.

***

### Controlador → CnController.js

```javascript
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
```

1. Exportamos a função **cnJson** que será utilizado como parâmetro em nossa rota **/api/piadas**, esta por sua vez retorna um conjunto de dados no formato JSON.
2. Dentro da função realizamos um tratamento de exceções utilizando o bloco **try catch**, visando realizar tratamento de possíveis erros.
3. Utilizamos o axios pra realizar uma requisição https à API de piadas, e recebemos um conjunto de dados.
4. Utilizamos o arquivo **Cnfunction.js** para fazer a formatação adequada dos dados, usando as funções adequadas para cada índice.

***

### Controlador → AtividadeController.js

```javascript
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
```

1. Exportamos a função **atJson** que será utilizado como parâmetro em nossa rota **/api/atividades**, esta por sua vez retorna um conjunto de dados no formato JSON.
2. Dentro da função realizamos um tratamento de exceções utilizando o bloco **try catch**, visando realizar tratamento de possíveis erros.
3. Utilizamos o axios pra realizar uma requisição https à API de atividades, e recebemos um conjunto de dados.
4. Utilizamos o arquivo **Atfunctions.js** para fazer a formatação adequada dos dados, usando as funções adequadas para cada índice.

***

## Funções

Adentrando a pasta **functions**, temos os arquivos js responsáveis pela formatação dos dados obtido através das APIs, montando e exportando o JSON para os controladores adequados. Temos os arquivos Cnfunction.js e Atfunctions.js.

## Preparação do projeto para Deploy no Elastic Beanstalk

 - Para inicializar a aplicação é criada a chave `start` dentro do objeto `scripts` do arquivo package.json do projeto Node. O valor dessa chave deve ser uma string contendo o comando que inicializa a aplicação. 
 
![Captura de Tela (158)](https://user-images.githubusercontent.com/106123150/212703002-daf1c365-c019-437d-ad54-a5d5d73be7d3.png)

- Nesse caso usaremos o comando a seguir para a inicialização desse projeto:
 
 ``npm start``

 - Por fim, é comprimida a pasta do projeto, com exceção do diretório node_modules.
 
 ![compress](https://crudtec-site.s3.amazonaws.com/wp-content/uploads/2023/01/05112026/compress.gif)
 
***

## Deploy (AWS Elastic Beanstalk)

 ELASTIC BEANSTALK é um serviço da AWS para implementar e escalar aplicações e serviços da Web, fazendo o deploy de aplicações, assim como realizar atualizações destes deploys. A ideia se dá pela junção dos aquivos de uma aplicação em um .ZIP, sendo que a criação da infraestrutura é feita pela própria BEANSTALK. 
 
 
 ## Passo a Passo 

1. [Acesse o serviço Elastic Beanstalk no console da AWS.](https://us-east-1.console.aws.amazon.com/elasticbeanstalk/home?region=us-east-1#/welcome)

2. Clique em Create Application

![Step 2 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/05b6785f-52dd-4f8d-8f97-b3cb759de880/169788ea-7c8f-43ff-ad6b-e167074ca7cf.png?crop=focalpoint&fit=crop&fp-x=0.6992&fp-y=0.2949&fp-z=2.9003&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)

3. Na página de criação em "Application Information" digite o nome da aplicação.

![Step 3 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/b20d1f0d-84ba-4c73-9dd6-0f69f33fa3a6/10c91e6c-a33c-4dd3-afbd-abd388fe3b3a.png?crop=focalpoint&fit=crop&fp-x=0.3438&fp-y=0.3902&fp-z=1.5789&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)

4. Em "Platform" selecione NodeJS.

![Step 4 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/9bc9d120-e3df-4539-8abf-06c0ad32cf75/f33873b1-a27d-4b92-8fb7-3adfe56df467.png?crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&fp-z=1.0000&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)

5. Selecione a opção "Upload your code"

![Step 5 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/d240c48b-2133-4752-b10f-af26a503f97c/3dd6b41e-6646-4387-8384-9db4a2d310ff.png?crop=focalpoint&fit=crop&fp-x=0.3064&fp-y=0.7163&fp-z=3.1680&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)

6. Aqui você pode nomear a versão de sua aplicação. 

Exemplo: projeto-node-v1 ou projeto-node-v1.0.0

![Step 6 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/423fe710-615f-49f2-b9e5-c5685ad15afe/fd447c2e-0559-4b3d-b094-719d9298bdcd.png?crop=focalpoint&fit=crop&fp-x=0.3438&fp-y=0.5599&fp-z=1.5789&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)


7. Selecione o arquivo .zip com o projeto Node e clique em "Create application"

![Step 7 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/5812c363-7ba6-46fb-a203-8e2714912d31/12d57884-17f5-4ad9-806e-bb21e1b5b786.png?crop=focalpoint&fit=crop&fp-x=0.5000&fp-y=0.5000&fp-z=1.0000&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)


8. Aqui serão exibidos os logs da criação do ambiente.
Observa-se que vários serviços AWS serão criados (S3, EC2, Security Groups, etc).

![Step 8 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/b137bf4d-ee4b-44ac-b73a-3be1497c1145/e1c756a8-f99e-4278-a3d3-ef9400859216.png?crop=focalpoint&fit=crop&fp-x=0.5625&fp-y=0.2711&fp-z=1.2000&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)


9. Aqui será exibida a url para acessar sua aplicação.

No card Health é possível observar o status da aplicação, se algo estiver incorreto você pode clicar em "Causes" para entender o que causou o erro.

![Step 9 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/349dc567-04e1-4c4f-8849-fc2eb2197472/fdda04f3-f223-4c04-82ef-2583d36fa5cd.png?crop=focalpoint&fit=crop&fp-x=0.2887&fp-y=0.2516&fp-z=2.0000&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)


10. Caso seja preciso subir uma atualização do projeto 

Basta clicar em "Upload and deploy" e selecionar o arquivo .zip com o projeto atualizado.

**OBS:** É importante manter uma coêrencia nas versões, por exemplo: projeto-node-v1, projeto-node-v2, etc.

![Step 10 screenshot](https://images.tango.us/workflows/6d444cf6-7a3c-4959-b26c-55383834d79f/steps/ac98c95f-721b-409b-8ef3-5cbc8d90b4a6/7e18be39-5928-436a-bcf9-aa2f1ddb5060.png?crop=focalpoint&fit=crop&fp-x=0.5373&fp-y=0.4019&fp-z=1.5703&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1920%3A902)

## Extensão do Arquivo 
Deve-se atentar no formato de deploy da aplicações na Elastic Beanstalk. Para que não haja erro nas operações, os arquivos devem está agrupados em um .ZIP, pois existem outras formas de comprimir arquivos, sendo que estás não são compatíveis.

## Url da aplicação disponibilizada pela AWS
http://appnodejs-env.eba-ygc97ixr.us-east-1.elasticbeanstalk.com/

## Autores

* [@herissonhyan](https://github.com/herissonhyan)
* [@Rosemelry](https://github.com/Rosemelry)
* [@luiz2CC](https://github.com/luiz2CC)
* [@EdivalcoAraujo](https://github.com/EdivalcoAraujo)
