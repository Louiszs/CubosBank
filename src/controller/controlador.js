let banco = require("../bancodedados");
const moment = require('moment');


function cpfEmailExistente(cpf, email) {
    const { contas } = banco;

    if (cpf) {
        const cpfExistente = contas.some((conta) => conta.usuario.cpf === cpf);
        if (cpfExistente) {
            return "CPF";
        }
    }
    if (email) {
        const emailExistente = contas.some((conta) => conta.usuario.email === email);
        if (emailExistente) {
            return "E-mail";
        }
    }
    return null;
}

function validarCamposObrigatorios(body, camposObrigatorios) {
    for (const campo of camposObrigatorios) {
        if (!body[campo]) {
            return false;
        }
    }
    return true;
}


const buscarUsuarioPorId = (id) => {
    const { contas } = banco;
    return contas.find(usuario => {
        return Number(usuario.numero) === Number(id)
    })
}

const listarContas = (req, res) => {
    const { contas } = banco;
    if (contas.length === 0) {
        res.status(200).json({ mensagem: "nenhuma conta encontrada" });
        return;
    }
    res.status(200).json(contas);
}



const cadastrarConta = (req, res) => {
    const { contas } = banco;
    let numero = 1;
    const camposObrigatorios = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];

    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }

    if (contas.length > 0) {
        numero = contas[contas.length - 1].numero + 1;
    }

    let cliente = {
        numero,
        saldo: 0,
        usuario: {
            ...req.body
        }
    }
    banco.contas.push(cliente);
    return res.status(201).send("Usuário criado");
}
const atualizarConta = (req, res) => {
    const { contas } = banco;
    const numeroContaParam = Number(req.params.numeroConta);
    const dadosAtualizados = req.body;
    const camposObrigatorios = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];

    const contaParaAtualizar = buscarUsuarioPorId(numeroContaParam);

    if (!contaParaAtualizar) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (!validarCamposObrigatorios(dadosAtualizados, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    const cpfOuEmailExistente = cpfEmailExistente(dadosAtualizados.cpf, dadosAtualizados.email);

    if (cpfOuEmailExistente) {
        return res.status(400).json({ mensagem: `${cpfOuEmailExistente} já existe em outras contas.` });
    }

    contaParaAtualizar.usuario = dadosAtualizados;

    return res.status(204).send();
}


const excluirConta = (req, res) => {
    const { contas } = banco;
    const numeroContaParam = Number(req.params.numeroConta);

    const contaParaExcluir = buscarUsuarioPorId(numeroContaParam);
    if (!contaParaExcluir) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }
    if (contaParaExcluir.saldo !== 0) {
        return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
    }

    const indexParaExcluir = contas.indexOf(contaParaExcluir);
    contas.splice(indexParaExcluir, 1);

    return res.status(204).send();
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    const { contas } = banco;
    const camposObrigatorios = ["numero_conta", "valor"];
    let contaParaDeposito = buscarUsuarioPorId(numero_conta);
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    if (!contaParaDeposito) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }

    contaParaDeposito.saldo += valor;

    const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');
    let registro = {
        data: dataAtual,
        numero_conta,
        valor
    };
    banco.depositos.push(registro);
    res.status(200).json({ mensagem: "Depósito realizado com sucesso.", saldo_atual: contaParaDeposito.saldo });
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const { contas } = banco;
    const camposObrigatorios = ["numero_conta", "valor", "senha"];
    let contaParaSacar = buscarUsuarioPorId(numero_conta);
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    if (!contaParaSacar) {
        return res.status(404).json({ mensagem: "Conta não encontrada." });
    }
    if (contaParaSacar.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }
    if (contaParaSacar.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo menor que o valor requerido" });
    }
    const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');
    contaParaSacar.saldo -= valor;
    let registro = {
        data: dataAtual,
        numero_conta,
        valor
    };
    banco.saques.push(registro);
    res.status(200).json({ mensagem: "Saque realizado com sucesso.", saldo_atual: contaParaSacar.saldo });
}

const transferir = (req, res) => {
    const { contas } = banco;
    const camposObrigatorios = ["numero_conta_origem", "numero_conta_destino", "valor", "senha"];
    let { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    let contaOrigem = buscarUsuarioPorId(numero_conta_origem);
    let contaDestino = buscarUsuarioPorId(numero_conta_destino);
    if (!contaDestino || !contaOrigem) {
        res.status(404).json({ mensagem: "Conta Origem ou Destino não existe" });
    }
    if (!validarCamposObrigatorios(req.body, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    if (contaOrigem.usuario.senha !== senha) {
        res.status(401).json({ mensagem: "Senha incorreta" });
    }
    if (numero_conta_origem.saldo < valor) {
        res.status(400).json({ mensagem: "Saldo insuficiente" });
    }
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;
    const dataAtual = moment().format('YYYY-MM-DD HH:mm:ss');
    let registro = {
        data: dataAtual,
        numero_conta_origem,
        numero_conta_destino,
        valor
    };
    banco.transferencias.push(registro);
    res.status(200).json({ mensagem: "Transferência realizada com sucesso.", Valor: valor });
}
const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;
    const { contas } = banco;
    const camposObrigatorios = ["numero_conta", "senha"];
    let contaExistente = buscarUsuarioPorId(numero_conta);
    if (!validarCamposObrigatorios(req.query, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    if (contaExistente.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta" });
    }
    res.status(200).json({ saldo: contaExistente.saldo });
}

const consultarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;
    const { contas } = banco;
    const camposObrigatorios = ["numero_conta", "senha"];
    let contaExistente = buscarUsuarioPorId(numero_conta);
    if (!validarCamposObrigatorios(req.query, camposObrigatorios)) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos. Pois são obrigatórios' });
    }
    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta não encontrada" });
    }
    if (contaExistente.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha incorreta" });
    }
    const depositoExistente = banco.depositos.filter((deposito) => deposito.numero_conta === numero_conta);
    const saqueExistente = banco.saques.filter((deposito) => deposito.numero_conta === numero_conta);
    const transferenciaExistenteOrigem = banco.transferencias.filter((deposito) => deposito.numero_conta_origem === numero_conta);
    const transferenciaExistenteDestino = banco.transferencias.filter((deposito) => deposito.numero_conta_destino === numero_conta);
    res.status(200).json({
        depositos: depositoExistente,
        saques: saqueExistente,
        tranferenciasEnviadas: transferenciaExistenteOrigem,
        transferenciaRecebidas: transferenciaExistenteDestino
    });
}
module.exports = {
    listarContas,
    cadastrarConta,
    atualizarConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    consultarExtrato
}