const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { env, validateEnv } = require("./config/env");

const connectDatabase = require("./config/database");

const healthRoutes = require("./routes/healthRoutes");

const authRoutes = require("./routes/authRoutes");

const adminRoutes = require("./routes/adminRoutes");

const postRoutes = require("./routes/postRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const tagRoutes = require("./routes/tagRoutes");

const errorHandler = require("./middleware/errorHandler");

async function startServer() {
  try {
    validateEnv();

    await connectDatabase();

    const app = express();

    app.use(
      cors({
        origin: env.clientUrl,
        credentials: true,
      }),
    );

    app.use(
      express.json({
        limit: "2mb",
      }),
    );

    app.use(
      express.urlencoded({
        extended: true,
      }),
    );

    app.use(cookieParser());

    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Cloudflare Automation API",
      });
    });

    app.use("/api/health", healthRoutes);

    app.use("/api/auth", authRoutes);

    app.use("/api/admin", adminRoutes);

    app.use("/api/categories", categoryRoutes);

    app.use("/api/tags", tagRoutes);

    app.use("/api/posts", postRoutes);

    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });

    app.use(errorHandler);

    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
}

startServer();
