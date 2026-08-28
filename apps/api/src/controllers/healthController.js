const mongoose = require("mongoose");

function health(req, res) {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    api: "ok",
    database: databaseConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
}

module.exports = {
  health,
};
