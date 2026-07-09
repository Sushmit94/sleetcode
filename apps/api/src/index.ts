import "dotenv/config";
console.log("DATABASE_URL:", process.env.DATABASE_URL);  // ADD THIS AS LINE 1
import Fastify from "fastify";
import cors from "@fastify/cors";
import authPlugin from "./plugins/auth";
import { authRoutes } from "./routes/auth";
import { problemRoutes } from "./routes/problems";
import { submitRoutes } from "./routes/submit";
import { resultRoutes } from "./routes/result";
import { dashboardRoutes } from "./routes/dashboard";

// Start the worker in the same process (fine for dev; split in prod)
import "./workers/executor.worker";

const app = Fastify({ logger: true });

async function start() {
    try {
        // Register CORS (credentials required so the auth cookie is sent/accepted)
        await app.register(cors, {
            origin: process.env.WEB_ORIGIN || "http://localhost:3000",
            credentials: true,
        });

        // Register auth (cookie + jwt support, app.authenticate decorator)
        await app.register(authPlugin);

        // Register Routes
        app.register(authRoutes);
        app.register(problemRoutes);
        app.register(submitRoutes);
        app.register(resultRoutes);
        app.register(dashboardRoutes);

        app.get("/health", () => ({ ok: true }));

        // Start Server
        const port = Number(process.env.PORT) || 4000;
        await app.listen({ port, host: "0.0.0.0" });

        console.log(`API running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

// Execute the startup function
start();
