const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();
app.use(express.json());

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID;
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN;

app.post("/webhook", async (req, res) => {
  const message = req.body;

  const phone = message.data?.from;
  const text = message.data?.body;

  if (!text || !phone) {
    return res.sendStatus(200);
  }

  console.log("📨 Mensagem recebida:");
  console.log(`De: ${phone}`);
  console.log(`Texto: ${text}`);

  try {
    const completion = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "Você é uma assistente pessoal que responde de forma simpática, direta e clara."
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`
        }
      }
    );

    const reply = completion.data.choices?.[0]?.message?.content || "Desculpe, não entendi.";

    console.log("🤖 Resposta da IA:", reply);

    await axios.post(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`, null, {
      params: {
        token: ULTRAMSG_TOKEN,
        to: phone,
        body: reply
      }
    });
  } catch (err) {
    console.error("Erro ao processar a mensagem:", err.message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
