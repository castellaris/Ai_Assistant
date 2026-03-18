import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// Настройка __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздаём статические файлы из public
app.use(express.static(path.join(__dirname, "public")));

// Чат с OpenAI
app.post("/chat", async (req, res) => {
  try {
    const userText = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userText }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ reply: "Ошибка: " + data.error.message });
    }

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message?.content || "Ответ пустой." });
    } else {
      res.json({ reply: "Ответ от модели пустой." });
    }
  } catch (err) {
    res.status(500).json({ reply: "Ошибка сервера: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
