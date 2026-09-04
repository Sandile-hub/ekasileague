import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

import tournamentRoutes from "./routes/tournaments.js";
import settingsRoutes from "./routes/settings.js";

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
// CORS
// =========================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ekasileague-coral.vercel.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(/\/$/, "")
  );
}

const uniqueOrigins = [
  ...new Set(
    allowedOrigins
      .filter(Boolean)
      .map((origin) => origin.replace(/\/$/, ""))
  ),
];

console.log("========================================");
console.log("🌐 ALLOWED CORS ORIGINS");
console.log("========================================");

uniqueOrigins.forEach((origin) => {
  console.log(`✅ ${origin}`);
});

console.log("========================================");

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without Origin
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

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

// =========================================================
// REQUEST LOGGER
// =========================================================

app.use((req, res, next) => {
  console.log(
    `📝 ${req.method} ${req.originalUrl} | Origin: ${
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

// Database errors
db.on("error", (err) => {
  console.error(
    "❌ PostgreSQL pool error:",
    err.message
  );
});

// =========================================================
// BASIC TEST ROUTE
// =========================================================

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ekasi League API is alive!",
  });
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      success: true,
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "❌ Health check failed:",
      error.message
    );

    res.status(503).json({
      success: false,
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// =========================================================
// API ROUTES
// =========================================================

console.log("⏳ Registering API routes...");

app.use(
  "/api/tournaments",
  tournamentRoutes
);

console.log(
  "✅ /api/tournaments registered"
);

app.use(
  "/api/settings",
  settingsRoutes
);

console.log(
  "✅ /api/settings registered"
);

// =========================================================
// 404 HANDLER
// =========================================================

app.use((req, res) => {
  console.log(
    `❌ 404: ${req.method} ${req.originalUrl}`
  );

  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =========================================================
// ERROR HANDLER
// =========================================================

app.use((err, req, res, next) => {
  console.error("💥 Express error:", err);

  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      error: "CORS error",
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// =========================================================
// START SERVER
// =========================================================

const server = app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log("");
    console.log("========================================");
    console.log("🚀 EKASI LEAGUE API RUNNING");
    console.log("========================================");
    console.log(`🌐 PORT: ${PORT}`);
    console.log("📡 HOST: 0.0.0.0");
    console.log("========================================");
    console.log("");
  }
);

// =========================================================
// DATABASE INITIALIZATION
// =========================================================

async function initializeDatabase() {
  try {
    console.log("⏳ Testing PostgreSQL connection...");

    const client = await db.connect();

    console.log(
      "✅ PostgreSQL connected successfully"
    );

    client.release();
  } catch (error) {
    console.error(
      "❌ PostgreSQL connection failed:",
      error.message
    );
  }
}

initializeDatabase();

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
    } catch (error) {
      console.error(
        "❌ Shutdown error:",
        error.message
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