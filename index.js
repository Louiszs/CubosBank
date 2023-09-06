const express = require("express");
const port = 3000;
const app = express();
const rota = require("./src/router/roteador");


app.use(express.json());
app.use(rota);

app.listen(port, () => {
    console.log(`servidor iniciado na porta ${port}`);
});

