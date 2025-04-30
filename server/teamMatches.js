// server/teamMatches.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

function generatePrediction(homeTeam, awayTeam) {
  const teamStrength = {
    "Barcelona": 2.5,
    "Inter": 2.0,
    "Real Madrid": 2.5,
    "Manchester City": 2.5,
    "Fenerbahçe": 1.8,
    "Galatasaray": 1.8,
  };
  const homeBase = teamStrength[homeTeam] || 1.5;
  const awayBase = teamStrength[awayTeam] || 1.2;
  const homeGoals = Math.round(Math.random() * homeBase);
  const awayGoals = Math.round(Math.random() * awayBase);
  return `${homeGoals} - ${awayGoals}`;
}

router.get("/team-matches", async (req, res) => {
  const teamName = req.query.team;
  if (!teamName) return res.status(400).json({ matches: [] });

  try {
    const teamSearch = await axios.get("https://v3.football.api-sports.io/teams", {
      params: { search: teamName },
      headers: {
        "x-apisports-key": "8780c719d41a67b52b198f30cac380c3"
      }
    });

    const team = teamSearch.data.response[0];
    if (!team) {
      console.log("❌ Takım bulunamadı.");
      return res.status(404).json({ matches: [] });
    }

    const teamId = team.team.id;
    console.log("🔍 Takım ID:", teamId);
    console.log("🔄 Fixture istek başlıyor...");

    const today = new Date().toISOString().split("T")[0];

    const matchRes = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: {
        team: teamId,
        date: today
      },
      headers: {
        "x-apisports-key": "8780c719d41a67b52b198f30cac380c3"
      }
    });

    console.log("📦 Fixture yanıt:", matchRes.data);

    const matches = matchRes.data.response.map((item) => {
      return {
        id: item.fixture.id,
        homeTeam: item.teams.home.name,
        awayTeam: item.teams.away.name,
        homeLogo: item.teams.home.logo,
        awayLogo: item.teams.away.logo,
        league: item.league.name,
        time: item.fixture.date.split("T")[1].slice(0, 5),
        prediction: generatePrediction(item.teams.home.name, item.teams.away.name),
        confidence: Math.floor(Math.random() * 30 + 60),
      };
    });

    res.json({ matches });
  } catch (error) {
    console.error("Takım maçları hatası:", error.message);
    res.status(500).json({ matches: [] });
  }
});

module.exports = router;
