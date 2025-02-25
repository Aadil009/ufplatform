require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require("./src/routes/auth")
const protectedRoutes = require("./src/routes/protected")
const marketplaceRoutes = require("./src/routes/marketplace")
const logisticsRoutes = require("./src/routes/logistics")
const weatherRoutes = require("./src/routes/weather")
const governmentRoutes = require("./src/routes/government")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Farmer App Backend Running...")
});
app.use("/api/auth", authRoutes)
app.use("/api/protected", protectedRoutes)
app.use("/api/marketplace", marketplaceRoutes)
app.use("/api/logistics", logisticsRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/government", governmentRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
