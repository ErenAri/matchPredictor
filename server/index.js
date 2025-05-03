// server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4000;

app.use(cors());

// 🔗 Route bağlantıları
const searchTeams = require("./searchTeams");
const teamMatches = require("./teamMatches");
const resultRoutes = require("./results");
const allTeams = require("./allTeams");

app.use("/api", searchTeams);
app.use("/api", teamMatches);
app.use("/api/matches", resultRoutes);
app.use("/api", allTeams);

// 🔽 Süper Lig ve Şampiyonlar Ligi maçlarını çek
app.get("/api/matches/today", async (req, res) => {
  const selectedDate = req.query.date || new Date().toISOString().split("T")[0];
  console.log("📅 Seçilen tarih:", selectedDate);

  try {
    const leagues = [203, 2];
    const results = [];

    for (let league of leagues) {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        params: {
          date: selectedDate,
          league: league,
          season: 2023,
        },
        headers: {
          "x-apisports-key": process.env.APIFOOTBALL_KEY
        },
      });

      const simplified = response.data.response.map((item) => ({
        id: item.fixture.id,
        homeTeam: item.teams.home.name,
        awayTeam: item.teams.away.name,
        homeLogo: item.teams.home.logo,
        awayLogo: item.teams.away.logo,
        league: item.league.name,
        time: item.fixture.date.split("T")[1].slice(0, 5),
        prediction: generatePrediction(),
        confidence: Math.floor(Math.random() * 30 + 60),
      }));

      results.push(...simplified);
    }

    res.json({ matches: results });
  } catch (error) {
    console.error("API-Football Hatası:", error.message);
    res.status(500).json({ error: "RapidAPI'den veri alınamadı" });
  }
});

// Basit skor tahmini
function generatePrediction() {
  const homeGoals = Math.round(Math.random() * 3);
  const awayGoals = Math.round(Math.random() * 2);
  return `${homeGoals} - ${awayGoals}`;
}

// 🔽 Sunucu başlatılıyor
app.listen(PORT, () => {
  console.log(`✅ API çalışıyor: http://localhost:${PORT}`);
});
