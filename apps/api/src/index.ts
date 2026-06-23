import Fastify from "fastify";
import cors from "@fastify/cors";
import { problemRoutes } from "./routes/problems";
import { submitRoutes } from "./routes/submit";
import { resultRoutes } from "./routes/result";

// Start the worker in the same process (fine for dev; split in prod)
import "./workers/executor.worker";

const app = Fastify({ logger: true });

async function start() {
    try {
        // Register CORS
        await app.register(cors, { origin: "*" });

        // Register Routes
        app.register(problemRoutes);
        app.register(submitRoutes);
        app.register(resultRoutes);

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