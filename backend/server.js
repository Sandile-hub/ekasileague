import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ----- CORS configuration -----
const allowedOrigin = process.env.FRONTEND_URL || "*";
console.log(`🌐 CORS allowed origin: ${allowedOrigin}`);

const corsOptions = {
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ----- Log every request -----
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

app.use(express.json());

// ----- PostgreSQL connection pool -----
export const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ekasi_league",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

try {
  await db.connect();
  console.log("✅ PostgreSQL connected successfully");
} catch (err) {
  console.error("❌ PostgreSQL connection failed:", err.message);
}

// ----- Load routes with error handling -----
let tournamentRoutes, settingsRoutes;

try {
  tournamentRoutes = (await import("./routes/tournaments.js")).default;
  console.log("✅ Loaded tournaments routes");
} catch (err) {
  console.error("❌ Failed to load tournaments routes:", err.message);
  tournamentRoutes = (req, res) => res.status(500).json({ error: "Tournaments routes not available" });
}

try {
  settingsRoutes = (await import("./routes/settings.js")).default;
  console.log("✅ Loaded settings routes");
} catch (err) {
  console.error("❌ Failed to load settings routes:", err.message);
  settingsRoutes = (req, res) => res.status(500).json({ error: "Settings routes not available" });
}

// Mount routes
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/settings", settingsRoutes);

// ----- Test route (always works) -----
app.get("/api/test", (req, res) => {
  res.json({ message: "API is alive and well!" });
});

// ----- Health check -----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ----- Log all registered routes (for debugging) -----
console.log("📋 Registered routes:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
    console.log(`  ${methods} ${layer.route.path}`);
  } else if (layer.name === "router") {
    // nested routers (like our mounted ones)
    layer.handle.stack.forEach((subLayer) => {
      if (subLayer.route) {
        const methods = Object.keys(subLayer.route.methods).join(", ").toUpperCase();
        console.log(`  ${methods} ${subLayer.route.path}`);
      }
    });
  }
});

// ----- 404 handler (should be last) -----
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});