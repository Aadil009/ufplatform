const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// **Get Weather Data by City or Coordinates**
router.get("/", async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: "Provide either city name or latitude & longitude" });
    }

    let apiUrl = `${WEATHER_API_URL}?appid=${WEATHER_API_KEY}&units=metric`;
    if (city) {
      apiUrl += `&q=${city}`;
    } else {
      apiUrl += `&lat=${lat}&lon=${lon}`;
    }

    const response = await axios.get(apiUrl);
    const data = response.data;

    res.json({
      location: data.name || "Unknown Location",
      temperature: data.main.temp + "°C",
      condition: data.weather[0].description,
      humidity: data.main.humidity + "%",
      windSpeed: data.wind.speed + " m/s",
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching weather data", error: err.message });
  }
});

module.exports = router;
