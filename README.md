# WhatsApp Assistente

Webhook básico para receber mensagens do WhatsApp via UltraMSG.

## Como usar

1. Clone ou envie este projeto para seu GitHub.
2. Acesse [https://railway.app](https://railway.app) e crie um novo projeto via botão "Deploy from GitHub".
3. Adicione uma variável de ambiente no Railway:
   - `PORT=3000` (ou qualquer outra porta que desejar)

4. Pegue a URL do Railway (ex: https://whatsapp-assistente.up.railway.app)
5. Vá no painel da UltraMSG e configure o webhook para:
   ```
   https://whatsapp-assistente.up.railway.app/webhook
   ```

6. Envie uma mensagem para seu WhatsApp conectado à UltraMSG.
7. Verifique os logs no Railway para ver a mensagem recebida.
