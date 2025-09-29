import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.SPORTRADAR_KEY;
const BASE_URL = "https://api.sportradar.com/formula1/trial/v2/en";

app.use(cors());

// Proxy genérico
app.use("/api", async (req, res) => {
  const endpoint = req.path.slice(1); // remove a barra inicial
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Erro na API: ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy rodando em http://localhost:${PORT}`);
});
