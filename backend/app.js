const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

const app = express();


app.use(cors());
app.use(express.json()); 

const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = jsYaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);


app.get('/', (req, res) => {
    res.send('Sou o projeto de node + express!');
});

app.get('/posts', (req, res) => {
  const filePath = path.join(__dirname, 'posts.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err); 
      return res.status(500).json({
        erro: 'Erro ao ler arquivo posts.json'
      });
    }

    try {
      const posts = JSON.parse(data);
      res.status(200).json(posts);
    } catch (parseError) {

      res.status(500).json({ erro: 'Erro ao processar a estrutura do JSON' });
    }
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running at port ${PORT}`);
});

