const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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
    // Enviar pergunta para o Gemini
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: text }] }]
      }
    );

    const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não entendi.";

    console.log("🤖 Resposta da IA:", reply);

    // Enviar resposta via UltraMSG
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
