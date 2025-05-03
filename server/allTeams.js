// server/allTeams.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

let cachedTeams = [];

router.get("/all-teams", async (req, res) => {
  if (cachedTeams.length > 0) {
    return res.json({ teams: cachedTeams });
  }

  try {
    const leagues = [203, 2];
    const season = 2023;
    let allTeams = [];

    for (let league of leagues) {
      const response = await axios.get("https://v3.football.api-sports.io/teams", {
        params: { league, season },
        headers: {
          "x-apisports-key": process.env.APIFOOTBALL_KEY
        }
      });
      allTeams.push(...response.data.response);
    }

    const seen = new Set();
    cachedTeams = allTeams
      .filter(item => {
        if (seen.has(item.team.id)) return false;
        seen.add(item.team.id);
        return true;
      })
      .map((item) => ({
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logo,
        country: item.team.country
      }));

    res.json({ teams: cachedTeams });
  } catch (error) {
    console.error("Takım listesi alınamadı:", error.message);
    res.status(500).json({ teams: [] });
  }
});

module.exports = router;
