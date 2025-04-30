// server/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");

console.log("🚀 Sunucu başlatılıyor...");

const app = express();
const PORT = 4000;

app.use(cors());

// Route'ları tanımla
const resultRoutes = require("./results");
app.use("/api/matches", resultRoutes);

const teamMatches = require("./teamMatches");
app.use("/api", teamMatches);

const searchTeams = require("./searchTeams");
app.use("/api", searchTeams);

// Bugünkü maçlar için tahmin endpoint'i
function generatePrediction() {
  const homeGoals = Math.round(Math.random() * 3);
  const awayGoals = Math.round(Math.random() * 2);
  return `${homeGoals} - ${awayGoals}`;
}

app.get("/api/matches/today", async (req, res) => {
  const selectedDate = req.query.date || new Date().toISOString().split("T")[0];
  console.log("📅 Seçilen tarih:", selectedDate);

  try {
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: {
        date: selectedDate,
        league: "203,2",
        season: 2024,
      },
      headers: {
        "x-apisports-key": "8780c719d41a67b52b198f30cac380c3"
      },
    });

    const simplified = response.data.response.map((item) => {
      return {
        id: item.fixture.id,
        homeTeam: item.teams.home.name,
        awayTeam: item.teams.away.name,
        homeLogo: item.teams.home.logo,
        awayLogo: item.teams.away.logo,
        league: item.league.name,
        time: item.fixture.date.split("T")[1].slice(0, 5),
        prediction: generatePrediction(),
        confidence: Math.floor(Math.random() * 30 + 60),
      };
    });

    res.json({ matches: simplified });
  } catch (error) {
    console.error("API-Football Hatası:", error.message);
    res.status(500).json({ error: "Veri alınamadı" });
  }
});

// ✅ Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ API çalışıyor: http://localhost:${PORT}`);
});
