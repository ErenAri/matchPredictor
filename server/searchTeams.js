// server/searchTeams.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search-teams", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ teams: [] });

  try {
    const leagues = [203, 2]; // Süper Lig ve Şampiyonlar Ligi
    let allTeams = [];

    for (let league of leagues) {
      const response = await axios.get("https://v3.football.api-sports.io/teams", {
        params: { search: query, season: 2023, league },
        headers: {
          "x-apisports-key": process.env.APIFOOTBALL_KEY
        }
      });

      allTeams.push(...response.data.response);
    }

    const teams = allTeams.map((item) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
      country: item.team.country
    }));

    res.json({ teams });
  } catch (error) {
    console.error("Takım arama hatası:", error.message);
    res.status(500).json({ teams: [] });
  }
});

module.exports = router;
