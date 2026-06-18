import { Worker, Job, connection } from "../services/queue.service";
import { runSandbox } from "../services/docker.service";
import { parseForgeOutput } from "../services/forge.service";
import { db } from "../db/client";
import { submissions } from "../db/schema";
import { eq } from "drizzle-orm";

const worker = new Worker(
    "submissions",
    async (job: Job) => {
        const { submissionId, userCode, testCode } = job.data;
        const startTime = Date.now();

        // Mark as running
        await db
            .update(submissions)
            .set({ status: "running" })
            .where(eq(submissions.id, submissionId));

        const { stdout, timedOut } = await runSandbox(userCode, testCode);
        const result = parseForgeOutput(stdout, timedOut, startTime);

        await db
            .update(submissions)
            .set({
                status: result.status,
                passed: result.passed ? 1 : 0,
                testResults: JSON.stringify(result.tests ?? []),
                compileError: result.compileError ?? null,
                executionTimeMs: result.executionTimeMs,
            })
            .where(eq(submissions.id, submissionId));

        return result;
    },
    { connection, concurrency: 3 }
);

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

console.log("Executor worker started");