const Nota = require('../models/nota');
//Vai testar se existem notas, pegando o tamanho
const buscarNota = async (request, response) =>{

    const notas = await Nota.find({})
    if(notas.length >= 0){
        response.status(200).send(notas);
    }else{
        response.status(400).send('Nota não encontrada');
    }
};

//Vai adicionar nota mandando uma requisição para o body onde tem todos os params(Titulo,comentario e cor)
const addNota = async (request, response) =>{

    const nota = new Nota(request.body);
    nota.save().then(()=>{
        response.status(200).send('Salvo com Sucesso');
    }).catch(err=>{
        response.status(400).send('Falha ao Salvar');
    });
};

//vai deletar a nota, ele procura a nota pelo id(paramentro)
const deletarNota = async (request, response) =>{

    const result = await Nota.deleteOne({_id:request.params.id});
    if(result.deletedCount > 0){
        response.status(200).send('Removido com sucesso');
    }else{
        response.status(400).send('Nota não encontrada');
    }
};

//Vai atualizar a nota pegando o id fazendo a requisição para o body
const atualizarNota = async (request, response) =>{  
     
    const result = await Nota.updateOne({_id: request.body._id },{
        $set: {
            title: request.body.title,//params
            text: request.body.text//params
        }
    });

    if(result.modifiedCount>0){
        response.status(200).send('Atualizado com sucesso');
    }else{
        response.status(400).send('Nota não encontrado');
    }
}

module.exports = { buscarNota,addNota, deletarNota,atualizarNota };
