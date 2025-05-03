const express = require("express");
const router = express.Router();
const { getTeamStats, generateSmartPrediction } = require("./predict");

// Fenerbahçe (611), Beşiktaş (549)
async function getFenerBjkMatch() {
  const fenerStats = await getTeamStats(611);
  const bjkStats = await getTeamStats(549);
  const prediction = generateSmartPrediction(fenerStats, bjkStats);

  return {
    id: 999004,
    homeTeam: "Fenerbahçe",
    awayTeam: "Beşiktaş",
    homeLogo: "https://media.api-sports.io/football/teams/611.png",
    awayLogo: "https://media.api-sports.io/football/teams/549.png",
    league: "Süper Lig",
    time: "20:00",
    predicted: prediction,
    actual: "-",
    confidence: 73,
    correct: false,
  };
}

const staticResults = [
  {
    id: 999001,
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    homeLogo: "https://media.api-sports.io/football/teams/645.png",
    awayLogo: "https://media.api-sports.io/football/teams/611.png",
    league: "Süper Lig",
    time: "20:00",
    predicted: "2 - 1",
    actual: "2 - 1",
    confidence: 75,
    correct: true,
  },
  {
    id: 999002,
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeLogo: "https://media.api-sports.io/football/teams/541.png",
    awayLogo: "https://media.api-sports.io/football/teams/50.png",
    league: "Şampiyonlar Ligi",
    time: "22:00",
    predicted: "1 - 2",
    actual: "0 - 2",
    confidence: 70,
    correct: false,
  },
  {
    id: 999003,
    homeTeam: "Barcelona",
    awayTeam: "Inter",
    homeLogo: "https://media.api-sports.io/football/teams/529.png",
    awayLogo: "https://media.api-sports.io/football/teams/505.png",
    league: "Şampiyonlar Ligi",
    time: "21:45",
    predicted: "2 - 1",
    actual: "1 - 1",
    confidence: 74,
    correct: false,
  },
];

router.get("/results", async (req, res) => {
  const teamQuery = req.query.team;
  const fenerBjk = await getFenerBjkMatch();
  let results = [...staticResults, fenerBjk];

  if (teamQuery) {
    const team = teamQuery.toLowerCase();
    results = results.filter(
      (match) =>
        match.homeTeam.toLowerCase().includes(team) ||
        match.awayTeam.toLowerCase().includes(team)
    );
  }

  res.json({ matches: results });
});

module.exports = router;
