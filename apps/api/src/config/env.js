const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  mongodbUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",

  adminPassword: process.env.ADMIN_PASSWORD,

  openRouterApiKey: process.env.OPENROUTER_API_KEY,
};

function validateEnv() {
  const required = ["mongodbUri", "jwtSecret"];

  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  env,
  validateEnv,
};
