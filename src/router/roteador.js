const express = require("express");
const controller = require("../controller/controlador");
const { verificarSenhaMiddleware, verificaEmailECpf } = require("../middleware/intermediario");
const rota = express();


rota.post("/contas", verificaEmailECpf, controller.cadastrarConta);
rota.post("/transacoes/depositar", controller.depositar);
rota.post("/transacoes/sacar", controller.sacar);
rota.post("/transacoes/transferir", controller.transferir);
rota.get("/contas", verificarSenhaMiddleware, controller.listarContas);
rota.get("/contas/saldo", controller.consultarSaldo);
rota.get("/contas/extrato", controller.consultarExtrato);
rota.put("/contas/:numeroConta/usuario", controller.atualizarConta);
rota.delete("/contas/:numeroConta", controller.excluirConta);

module.exports = rota;
