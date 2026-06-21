import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null,
});

export const submissionQueue = new Queue("submissions", { connection });

export { connection, Worker, Job };