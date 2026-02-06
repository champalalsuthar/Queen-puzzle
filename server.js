const express = require("express");
const connectDB = require("./config/db");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
connectDB();

app.use(express.json());
app.use("/api", gameRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
