// server/teamMatches.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

function generatePredictionFromStats(homeStats, awayStats) {
  const homeExpected = (homeStats.avgScored + awayStats.avgConceded) / 2;
  const awayExpected = (awayStats.avgScored + homeStats.avgConceded) / 2;
  const homeGoals = Math.max(0, Math.round(homeExpected + (Math.random() - 0.5)));
  const awayGoals = Math.max(0, Math.round(awayExpected + (Math.random() - 0.5)));
  return `${homeGoals} - ${awayGoals}`;
}

async function getTeamAverages(teamId) {
  try {
    const res = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: {
        team: teamId,
        season: 2023,
        status: "FT",
        last: 5,
      },
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY
      },
    });

    const fixtures = res.data.response;
    let scored = 0;
    let conceded = 0;

    fixtures.forEach((match) => {
      const isHome = match.teams.home.id == teamId;
      const goalsFor = isHome ? match.goals.home : match.goals.away;
      const goalsAgainst = isHome ? match.goals.away : match.goals.home;
      scored += goalsFor;
      conceded += goalsAgainst;
    });

    return {
      avgScored: scored / fixtures.length || 1.5,
      avgConceded: conceded / fixtures.length || 1.5,
    };
  } catch (e) {
    console.error("Geçmiş maç ortalaması alınamadı:", e.message);
    return { avgScored: 1.5, avgConceded: 1.5 };
  }
}

router.get("/team-matches", async (req, res) => {
  const teamId = req.query.team;
  if (!teamId) return res.status(400).json({ matches: [] });

  try {
    const matchRes = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: {
        team: teamId,
        season: 2023,
        next: 5,
      },
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY
      }
    });

    const matchesRaw = matchRes.data.response;
    const teamIds = new Set();
    matchesRaw.forEach(m => {
      teamIds.add(m.teams.home.id);
      teamIds.add(m.teams.away.id);
    });

    const teamStats = {};
    for (let id of teamIds) {
      teamStats[id] = await getTeamAverages(id);
    }

    const matches = matchesRaw.map((item) => {
      const homeStats = teamStats[item.teams.home.id];
      const awayStats = teamStats[item.teams.away.id];

      return {
        id: item.fixture.id,
        homeTeam: item.teams.home.name,
        awayTeam: item.teams.away.name,
        homeLogo: item.teams.home.logo,
        awayLogo: item.teams.away.logo,
        league: item.league.name,
        time: item.fixture.date.split("T")[1].slice(0, 5),
        confidence: Math.floor(Math.random() * 30 + 60),
        prediction: generatePredictionFromStats(homeStats, awayStats),
        homeStats,
        awayStats
      };
    });

    res.json({ matches });
  } catch (error) {
    console.error("Takım maçları hatası:", error.message);
    res.status(500).json({ matches: [] });
  }
});

module.exports = router;
