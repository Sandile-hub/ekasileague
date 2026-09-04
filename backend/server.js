import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

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
// CORS CONFIGURATION
// =========================================================

// Production frontend
const productionFrontend =
  process.env.FRONTEND_URL ||
  "https://ekasileague-coral.vercel.app";

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ekasileague-coral.vercel.app",
  productionFrontend,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log("========================================");
console.log("🌐 CORS CONFIGURATION");
console.log("========================================");

console.log("Allowed origins:");

uniqueOrigins.forEach((origin) => {
  console.log(`   ✅ ${origin}`);
});

console.log("========================================");

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests that don't contain an Origin header
    // Examples: Postman, server-to-server requests
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, "");

    if (uniqueOrigins.includes(cleanOrigin)) {
      console.log(`✅ CORS allowed: ${origin}`);
      return callback(null, true);
    }

    console.error(`❌ CORS blocked: ${origin}`);

    return callback(
      new Error(`CORS blocked origin: ${origin}`)
    );
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],

  credentials: true,

  optionsSuccessStatus: 204,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Explicit preflight handling
app.options("*", cors(corsOptions));

// =========================================================
// REQUEST LOGGING
// =========================================================

app.use((req, res, next) => {
  console.log(
    `📝 ${req.method} ${req.path} - Origin: ${
      req.headers.origin || "none"
    }`
  );

  next();
});

// =========================================================
// BODY PARSER
// =========================================================

app.use(express.json());

// =========================================================
// DATABASE
// =========================================================

export const db = new Pool({
  host: process.env.DB_HOST || "localhost",

  port:
    Number(process.env.DB_PORT) || 5432,

  user:
    process.env.DB_USER || "postgres",

  password:
    process.env.DB_PASSWORD || "",

  database:
    process.env.DB_NAME || "ekasi_league",

  ssl:
    process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,

  max: 10,

  idleTimeoutMillis: 30000,

  connectionTimeoutMillis: 10000,
});

// =========================================================
// DATABASE ERROR HANDLER
// =========================================================

db.on("error", (err) => {
  console.error(
    "❌ Unexpected PostgreSQL pool error:",
    err
  );
});

// =========================================================
// BASIC API TEST
// =========================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Ekasi League API is alive and well!",
  });
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      database: "connected",
      environment:
        process.env.NODE_ENV || "production",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(
      "❌ Health check database error:",
      err.message
    );

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

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");
    console.log("========================================");
    console.log("🚀 EKASI LEAGUE BACKEND STARTED");
    console.log("========================================");
    console.log(`🌐 Port: ${PORT}`);
    console.log("📡 Host: 0.0.0.0");
    console.log(
      `🔗 API: http://localhost:${PORT}`
    );
    console.log(
      `🔗 Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      `🔗 Test: http://localhost:${PORT}/api/test`
    );
    console.log("========================================");
    console.log("");
  }
);

// =========================================================
// ROUTE INITIALIZATION
// =========================================================

async function initializeApp() {
  console.log("⏳ Initializing Ekasi League API...");

  // -------------------------------------------------------
  // PostgreSQL
  // -------------------------------------------------------

  try {
    console.log("⏳ Connecting to PostgreSQL...");

    const client = await db.connect();

    console.log(
      "✅ PostgreSQL connected successfully"
    );

    client.release();
  } catch (err) {
    console.error(
      "❌ PostgreSQL connection failed:",
      err.message
    );

    return;
  }

  // -------------------------------------------------------
  // TOURNAMENT ROUTES
  // -------------------------------------------------------

  try {
    const tournamentModule = await import(
      "./routes/tournaments.js"
    );

    const tournamentRoutes =
      tournamentModule.default;

    if (!tournamentRoutes) {
      throw new Error(
        "tournaments.js does not export a default router"
      );
    }

    app.use(
      "/api/tournaments",
      tournamentRoutes
    );

    console.log(
      "✅ Loaded /api/tournaments routes"
    );
  } catch (err) {
    console.error(
      "❌ Failed to load tournament routes:",
      err
    );
  }

  // -------------------------------------------------------
  // SETTINGS ROUTES
  // -------------------------------------------------------

  try {
    const settingsModule = await import(
      "./routes/settings.js"
    );

    const settingsRoutes =
      settingsModule.default;

    if (!settingsRoutes) {
      throw new Error(
        "settings.js does not export a default router"
      );
    }

    app.use(
      "/api/settings",
      settingsRoutes
    );

    console.log(
      "✅ Loaded /api/settings routes"
    );
  } catch (err) {
    console.error(
      "❌ Failed to load settings routes:",
      err
    );
  }

  // -------------------------------------------------------
  // 404 HANDLER
  // MUST ALWAYS BE LAST
  // -------------------------------------------------------

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
      path: req.originalUrl,
    });
  });

  console.log("");
  console.log("========================================");
  console.log(
    "✅ EKASI LEAGUE API INITIALIZATION COMPLETE"
  );
  console.log("========================================");
  console.log("");
}

// =========================================================
// INITIALIZE APPLICATION
// =========================================================

initializeApp().catch((err) => {
  console.error(
    "💥 Application initialization failed:",
    err
  );
});

// =========================================================
// GRACEFUL SHUTDOWN
// =========================================================

const shutdown = async (signal) => {
  console.log(
    `\n🛑 ${signal} received. Shutting down...`
  );

  server.close(async () => {
    try {
      await db.end();

      console.log(
        "✅ PostgreSQL connection pool closed"
      );

      console.log("✅ HTTP server closed");

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

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});