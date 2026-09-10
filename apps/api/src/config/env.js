require("dotenv").config();

const env = {
  port: process.env.PORT || 5000,

  mongoUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  openRouterApiKey: process.env.OPENROUTER_API_KEY,

  openRouterModel: process.env.OPENROUTER_MODEL || "openrouter/free",

  openRouterSiteUrl: process.env.OPENROUTER_SITE_URL || "http://localhost:5173",

  openRouterSiteName:
    process.env.OPENROUTER_SITE_NAME || "Cloudflare Website CMS",
};

function validateEnv() {
  const required = [
    ["MONGODB_URI", env.mongoUri],
    ["JWT_SECRET", env.jwtSecret],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

module.exports = {
  env,
  validateEnv,
};
