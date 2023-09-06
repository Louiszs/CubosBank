const { banco, contas } = require("../bancodedados");

const verificarSenhaMiddleware = (req, res, next) => {
    const senhaInformada = req.query.senha_banco;
    if (senhaInformada === banco.senha) {
        next();
    } else {
        res.status(401).send("Senha incorreta");
    }
};
const verificaEmailECpf = (req, res, next) => {
    const { cpf, email } = req.body;
    const contaExistente = contas.find(conta => conta.usuario.cpf === cpf || conta.usuario.email === email);
    if (contaExistente) {
        return res.status(401).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado" });
    } else {
        next();
    }
}

module.exports = {
    verificarSenhaMiddleware,
    verificaEmailECpf
}