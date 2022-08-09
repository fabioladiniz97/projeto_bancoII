require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const notaController = require('./controllers/NotaController');

//buscarNota notas
app.get('/notas', notaController.buscarNota);

//criando notas
app.post('/notas', notaController.addNota);

//deletando notas
app.delete('/notas/:id', notaController.deletarNota);

//atualizando notas
app.put('/notas', notaController.atualizarNota);

//o que aparece no terminal
app.listen(process.env.API_PORT, ()=>{
    console.log(`API rodando na porta ${process.env.API_PORT}`);
});
