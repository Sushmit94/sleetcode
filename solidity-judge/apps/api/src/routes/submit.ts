import { FastifyInstance } from "fastify";
import { db } from "../db/client";
import { problems, submissions } from "../db/schema";
import { submissionQueue } from "../services/queue.service";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

const SubmitBody = z.object({
    problemSlug: z.string(),
    userCode: z.string().min(1).max(50_000),
});

export async function submitRoutes(app: FastifyInstance) {
    app.post("/submit", async (req, reply) => {
        const body = SubmitBody.safeParse(req.body);
        if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

        const { problemSlug, userCode } = body.data;

        const [problem] = await db
            .select({ id: problems.id, testCode: problems.testCode })
            .from(problems)
            .where(eq(problems.slug, problemSlug));

        if (!problem) return reply.status(404).send({ error: "Problem not found" });

        const submissionId = nanoid();

        await db.insert(submissions).values({
            id: submissionId,
            problemId: problem.id,
            userCode,
            status: "queued",
        });

        await submissionQueue.add("execute", {
            submissionId,
            userCode,
            testCode: problem.testCode,
        });

        return { jobId: submissionId };
    });
}