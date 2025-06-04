const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const message = req.body;

  console.log("📨 Mensagem recebida:");
  console.log(`De: ${message.data?.from}`);
  console.log(`Texto: ${message.data?.body}`);

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
