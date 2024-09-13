const { select, input, checkbox } = require('@inquirer/prompts')
const { error } = require('console')
const fs = require("fs").promises

let mensagem = 'Bem vindo ao App de Metas'

let metas

//persistir dados -> carregar metas e save metas
const carregarMetas = async () => {

    try{
        const dados = await fs.readFile('metas.json', 'utf-8')
        metas = JSON.parse(dados)
    }
    catch(error) {
        metas = []
    }
}

const saveMetas = async () => {
    await fs.writeFile('metas.json', JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    
    const meta = await input({ message: 'Digite a meta: '})

    if(meta.length == 0) {
        mensagem = ('A meta não pode ser vazia.')
        return
    }

    if(metas.length == 0){
        mensagem = 'Não existem metas.'
        return
    }

    metas.push(
        { value: meta, checked: false }
    ) //essa função vai colocar algo dentro da let

    mensagem = 'Meta cadastrada com sucesso! :) '
}
 
const listarMetas = async () => {

    const respostas = await checkbox({
        message: 'Use as setas para mudar de meta, o espaço para selecionar para marcar/desmarcar e o enter para finalizar a etapa',
        choices: [...metas],
        instructions: false
    })

    if(metas.length == 0){
        mensagem = 'Não existem metas.'
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        console.log('Nenhuma meta selecionada')
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    });

    console.log('Meta(s) marcadas como concluída(s).') 
}

const metasRealizadas = async () => {
    
    const Realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(Realizadas.length == 0){
        console.log('Não existem metas realizadas! :( ')
        return
    }
    
    await select({
        message: 'Metas Realizadas',
        choices: [...Realizadas]
    })

    if(metas.length == 0){
        mensagem = 'Não existem metas.'
        return
    }

}

const metasAbertas = async () => {
   
    if(metas.length == 0){
        mensagem = 'Não existem metas.'
        return
    }
   
    const Abertas = metas.filter((metas) => {
        return metas.checked != true  
    })

    if(Abertas.length == 0){
        console.log('Não existe metas abertas! :) ')
        return
    }

    await select({
        message: 'Metas Abertas',
        choices: [...Abertas]
    })
}

const metasDeletadas = async () => {

    if(metas.length == 0){
        mensagem = 'Não existem metas.'
        return
    }

    const itemDelete = await checkbox({
        message: 'Selecione item para deletar',
        choices: [...metas],
        instructions: false,
    })

    if(itemDelete == 0){
        console.log('Sem item para deletar!')
        return
    }

    metas = metas.filter((meta) => {
        return !itemDelete.includes(meta.value)
    })

    console.log('Meta(s) deletada(s)! :) ') 

}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ""){
        console.log(mensagem)
        console.log('')
        mensagem = ''
    }
}

const start = async () => {
   await carregarMetas()
    
    while(true){
            mostrarMensagem()
            await saveMetas()
        
    // async = assincrona, await é tipo 'espera'
    //const para pessoa escolher uma opção
        const option = await select({
            message: 'Menu > ',
            choices: [
                {
                    name: 'Cadastrar metas',
                    value: 'Cadastrar'
                },
                {
                    name: 'Listar metas',
                    value: 'Listar'
                },
                {
                    name: 'Metas Realizadas',
                    value: 'Realizadas'
                },
                {
                    name: 'Metas Aberta',
                    value: 'Abertas'
                },
                {
                    name: 'Deletar Metas',
                    value: 'Deletar'
                },
                {
                    name: 'Sair',
                    value: 'Sair' 
                }
            ]
        })
            

        //depois de escolher isso aparece:
        switch(option) {
            case 'Cadastrar':
                await cadastrarMeta()
                console.log(metas)
                break;
            case 'Listar':
                await listarMetas()
                break;
            case 'Realizadas':
                await metasRealizadas()
                break
            case 'Abertas':
                await metasAbertas()
                break
            case 'Deletar':
                await metasDeletadas()
                break
            case 'Sair':
                console.log('até a próxima')    
            return
        }
    }
}

start()