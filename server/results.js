// server/results.js
const express = require("express");
const router = express.Router();

// Sahte geçmiş maç tahminleri (manuel test için)
const matches = [
  {
    id: 999001,
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    homeLogo: "https://upload.wikimedia.org/wikipedia/tr/8/88/Galatasaray_Logo.png",
    awayLogo: "https://upload.wikimedia.org/wikipedia/tr/8/80/Fenerbah%C3%A7e_logo.png",
    league: "Süper Lig",
    time: "20:00",
    predicted: "2 - 1",
    actual: "2 - 1",
    correct: true,
  },
  {
    id: 999002,
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeLogo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    awayLogo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
    league: "Şampiyonlar Ligi",
    time: "22:00",
    predicted: "1 - 2",
    actual: "0 - 2",
    correct: false,
  },
];

router.get("/played", (req, res) => {
  const selectedDate = req.query.date || new Date().toISOString().split("T")[0];
  console.log("📅 Test amaçlı geçmiş maçlar gösteriliyor. Tarih:", selectedDate);
  res.json({ matches });
});

module.exports = router;