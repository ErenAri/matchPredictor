// server/searchTeams.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search-teams", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ teams: [] });

  try {
    const response = await axios.get("https://v3.football.api-sports.io/teams", {
      params: { search: query },
      headers: {
        "x-apisports-key": "8780c719d41a67b52b198f30cac380c3"
      }
    });

    const teams = response.data.response.map((item) => ({
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
