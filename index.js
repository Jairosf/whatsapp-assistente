import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID;
const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

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
    const result = await model.generateContent(text);
    const response = await result.response;
    const reply = response.text();

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
