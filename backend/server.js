import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

const API_KEY = "boTpuxOMgXmYB0C1znfJfkZmlrwCtvJMJMdHeogN";
const BASE_URL = "https://api.sportradar.com/formula1/trial/v2/en";

app.use(cors());

app.use("/api", async (req, res) => {
  const endpoint = req.path.slice(1); // remove a barra inicial
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        "x-api-key": API_KEY,
        "accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro na API" });
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
