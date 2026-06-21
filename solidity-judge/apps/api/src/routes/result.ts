import { FastifyInstance } from "fastify";
import { db } from "../db/client";
import { submissions } from "../db/schema";
import { eq } from "drizzle-orm";

export async function resultRoutes(app: FastifyInstance) {
    app.get<{ Params: { jobId: string } }>("/result/:jobId", async (req, reply) => {
        const [sub] = await db
            .select()
            .from(submissions)
            .where(eq(submissions.id, req.params.jobId));

        if (!sub) return reply.status(404).send({ error: "Not found" });

        return {
            jobId: sub.id,
            status: sub.status,
            passed: sub.passed === 1,
            tests: sub.testResults ? JSON.parse(sub.testResults) : [],
            compileError: sub.compileError,
            executionTimeMs: sub.executionTimeMs,
        };
    });
}