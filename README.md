![](https://i.imgur.com/xG74tOh.png)

# Desafio Módulo 2 - Back-end

## Descrição

Este código é uma aplicação Node.js que simula um sistema bancário básico, oferecendo funcionalidades essenciais relacionadas a contas bancárias, usando o framework Express para criar endpoints HTTP, adotando a modularização para organização do código, utilizando a biblioteca moment.js para manipulação de datas e horas, e aproveitando o nodemon para facilitar o desenvolvimento.

### instalação

`inicie o projeto com` :

```terminal
npm init -y
```

- `express`:

```terminal
npm install express
```

- `nodemon`(deve ser instalado como depedência de desenvolvimento):

```terminal
npm install -D nodemon
```

- `moment.js`:

```terminal
npm install moment
```

### Estrutura do Código

A estrutura do código é dividida em três partes principais:

## Servidor Express

O código principal index.js cria um servidor Express e define rotas para manipular as operações bancárias.
![Descrição da Imagem](./src/assets/index.png)

- `express`: Biblioteca para criar o servidor Express.
- `port`: Porta na qual o servidor será executado (3000 neste caso).
- `app`: Instância do servidor Express.
- `rota`: Módulo que define as rotas da API.

Configuração das rotas e middleware(express.sjon(), que é usado para analisar o body das solicitações)

```javascript
app.use(express.json());
app.use(rota);
```

Inicia o servidor na porta especificada

```javascript
app.listen(port, () => {
  console.log(`servidor iniciado na porta ${port}`);
});
```

## Rotas e Controladores

O módulo roteador.js define as rotas da API e os controladores associados a cada rota. Os controladores executam as operações bancárias específicas, como cadastrar contas, depositar, sacar, transferir, listar contas, consultar saldo e extrato.
![Descrição da Imagem](./src/assets/rotas.png)

## Funcionalidades Principais

A aplicação oferece as seguintes funcionalidades principais:

- `Cadastro de Contas`: Permite cadastrar uma nova conta bancária com informações como nome, CPF, data de nascimento, telefone, email e senha.
  ![Descrição da Imagem](./src/assets/cadastrar.png)

- `Depósito`: Permite fazer um depósito em uma conta bancária específica.
  ![Descrição da Imagem](./src/assets/depositar.png)

- `Saque`: Permite fazer um saque em uma conta bancária específica, desde que haja saldo disponível e a senha esteja correta.
  ![Descrição da Imagem](./src/assets/sacar.png)

- `Transferência`: Permite transferir dinheiro de uma conta para outra, verificando a senha e a disponibilidade de saldo.
  ![Descrição da Imagem](./src/assets/transferir.png)

- `Listagem de Contas`: Retorna a lista de todas as contas cadastradas.
  ![Descrição da Imagem](./src/assets/listar.png)

- `Consulta de Saldo`: Permite consultar o saldo de uma conta especificada por número de conta e senha.
  ![Descrição da Imagem](./src/assets/saldo.png)

- `Consulta de Extrato`: Permite consultar o extrato de uma conta especificada por número de conta e senha, incluindo depósitos, saques e transferências.
  ![Descrição da Imagem](./src/assets/extrato.png)

  ### Funções genéricas para verificação e consulta

- `buscar por id`: foi implementada esta função para evitar a repetição de código.
  ![Descrição da Imagem](./src/assets/buscar%20por%20id.png)

- `Validar Campos obrigatórios`: foi implementado para diminuir a quantidade de if statements.
  ![Descrição da Imagem](./src/assets/campos.png)
- `Validação cpf e email`: para evitar a duplicidade de email e cpf na hora e atualizar a conta.
  ![Descrição da Imagem](./src/assets/emailcpf.png)

## Middleware

O código também utiliza middleware para validar a senha do banco e verificar a existência de contas com o mesmo CPF ou email.

- `Verificar senha`: para verificar a senha correta na hora de listar as contas.
  ![Descrição da Imagem](./src/assets/senhamid.png)
- `Verificar conta existente no cadastro`:
  ![Descrição da Imagem](./src/assets/verificarcontamid.png)

## Testes

- `Cadastro`
  ![Descrição da Imagem](./src/assets/testeCadastro.jpeg)

  `Após o cadastro`
  ![Descrição da Imagem](./src/assets/CadastroCriado.jpeg)

- `Deposito`
  ![Descrição da Imagem](./src/assets/Depositar.jpeg)

- `Sacar`
  ![Descrição da Imagem](./src/assets/sacar.jpeg)

- `Transferir`
  ![Descrição da Imagem](./src/assets/Transferir.jpeg)

- `Consultar Contas`
  ![Descrição da Imagem](./src/assets/consultar%20contas.jpeg)

- `Consultar Saldo`
  ![Descrição da Imagem](./src/assets/consultarsaldo.jpeg)

- `Consultar Extrato`
  ![Descrição da Imagem](./src/assets/consultarextrato.jpeg)

- `Atualizar Conta`
  ![Descrição da Imagem](./src/assets/atualizar%20conta.jpeg)

- `Excluir Conta`
  ![Descrição da Imagem](./src/assets/Excluir%20Conta.jpeg)

  `Após a exclusão`:

  ![Descrição da Imagem](./src/assets/listarExclus.jpeg)
