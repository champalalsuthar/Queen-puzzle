const express = require("express");
const connectDB = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api", gameRoutes);
app.get("/api/health", (req, res) => {
    res.send("API OK");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
