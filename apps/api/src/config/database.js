const dns = require("dns");

const mongoose = require("mongoose");

const { env } = require("./env");

// Helps with MongoDB Atlas SRV DNS resolution
// on networks where the default resolver has problems.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(env.mongoUri, {
    family: 4,
  });

  console.log("MongoDB connected");
}

module.exports = connectDatabase;
