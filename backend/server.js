require("dotenv").config();

const express = require("express");
const app = express();

require("./config/db");

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/owner", ownerRoutes);

app.get("/", (req, res) => {
  res.send("Store Rating Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});