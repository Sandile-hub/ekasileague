import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================================================
// GLOBAL ERROR HANDLERS
// =========================================================

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

// =========================================================
// CORS
// =========================================================

const allowedOrigin = process.env.FRONTEND_URL || "*";

console.log(`🌐 CORS allowed origin: ${allowedOrigin}`);

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =========================================================
// MIDDLEWARE
// =========================================================

app.use((req, res, next) => {
  console.log(
    `📝 ${req.method} ${req.path} - Origin: ${req.headers.origin || "none"}`
  );
  next();
});

app.use(express.json());

// =========================================================
// DATABASE
// =========================================================

export const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ekasi_league",
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// =========================================================
// HEALTH CHECKS
// =========================================================

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is alive and well!",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Health check database error:", err.message);

    res.status(503).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// =========================================================
// START SERVER IMMEDIATELY
// =========================================================

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("========================================");
  console.log("🚀 EKASI LEAGUE BACKEND STARTED");
  console.log(`🌐 Port: ${PORT}`);
  console.log("📡 Host: 0.0.0.0");
  console.log(`🔗 Health: /api/health`);
  console.log(`🔗 Test: /api/test`);
  console.log("========================================");
});

// =========================================================
// DATABASE + ROUTE INITIALIZATION
// =========================================================

async function initializeApp() {
  try {
    console.log("⏳ Connecting to PostgreSQL...");

    const client = await db.connect();

    console.log("✅ PostgreSQL connected successfully");

    client.release();

    // =========================================
    // TOURNAMENT ROUTES
    // =========================================

    try {
      const tournamentModule = await import(
        "./routes/tournaments.js"
      );

      const tournamentRoutes = tournamentModule.default;

      app.use("/api/tournaments", tournamentRoutes);

      console.log("✅ Loaded tournaments routes");
    } catch (err) {
      console.error(
        "❌ Failed to load tournaments routes:",
        err
      );
    }

    // =========================================
    // SETTINGS ROUTES
    // =========================================

    try {
      const settingsModule = await import(
        "./routes/settings.js"
      );

      const settingsRoutes = settingsModule.default;

      app.use("/api/settings", settingsRoutes);

      console.log("✅ Loaded settings routes");
    } catch (err) {
      console.error(
        "❌ Failed to load settings routes:",
        err
      );
    }

    // =========================================
    // 404 HANDLER
    // IMPORTANT: MUST BE AFTER ALL ROUTES
    // =========================================

    app.use((req, res) => {
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
      });
    });

    console.log("========================================");
    console.log("✅ EKASI LEAGUE INITIALIZATION COMPLETE");
    console.log("========================================");

  } catch (err) {
    console.error(
      "❌ PostgreSQL connection failed:",
      err.message
    );

    // Still add 404 handler if initialization fails
    app.use((req, res) => {
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
      });
    });
  }
}

// =========================================================
// INITIALIZE APPLICATION
// =========================================================

initializeApp();

// =========================================================
// GRACEFUL SHUTDOWN
// =========================================================

const shutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await db.end();

      console.log("✅ PostgreSQL pool closed");
      console.log("✅ Server closed");

      process.exit(0);
    } catch (err) {
      console.error(
        "❌ Error during shutdown:",
        err.message
      );

      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));