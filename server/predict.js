const axios = require("axios");

async function getTeamStats(teamId) {
  try {
    const res = await axios.get("https://v3.football.api-sports.io/fixtures", {
      params: {
        team: teamId,
        last: 5,
        season: 2023,
        status: "FT"
      },
      headers: {
        "x-apisports-key": process.env.APIFOOTBALL_KEY
      }
    });

    const matches = res.data.response;
    if (!matches || matches.length === 0) {
      return { avgScored: 1.5, avgConceded: 1.5 };
    }

    let scored = 0, conceded = 0;

    matches.forEach(match => {
      const isHome = match.teams.home.id === teamId;
      scored += isHome ? match.goals.home : match.goals.away;
      conceded += isHome ? match.goals.away : match.goals.home;
    });

    return {
      avgScored: scored / matches.length,
      avgConceded: conceded / matches.length
    };
  } catch (e) {
    console.error("⚠️ Takım istatistikleri alınamadı:", e.message);
    return { avgScored: 1.5, avgConceded: 1.5 };
  }
}

function generateSmartPrediction(homeStats, awayStats) {
  const homeExpected = (homeStats.avgScored + awayStats.avgConceded) / 2;
  const awayExpected = (awayStats.avgScored + homeStats.avgConceded) / 2;

  const homeGoals = Math.max(0, Math.round(homeExpected + (Math.random() - 0.5)));
  const awayGoals = Math.max(0, Math.round(awayExpected + (Math.random() - 0.5)));

  return `${homeGoals} - ${awayGoals}`;
}

module.exports = { getTeamStats, generateSmartPrediction };
