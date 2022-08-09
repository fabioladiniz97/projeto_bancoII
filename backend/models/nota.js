
const mongoose = require('../database/bd');

const notaSchema = new mongoose.Schema({ 
    title:{type:String,required: true},
    text: String,
});

const Nota =mongoose.model('notas', notaSchema);

module.exports = Nota;