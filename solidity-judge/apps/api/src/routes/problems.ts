import { FastifyInstance } from "fastify";
import { db } from "../db/client";
import { problems } from "../db/schema";
import { eq } from "drizzle-orm";

export async function problemRoutes(app: FastifyInstance) {
    // GET /problems — list all
    app.get("/problems", async () => {
        const rows = await db
            .select({
                id: problems.id,
                title: problems.title,
                slug: problems.slug,
                difficulty: problems.difficulty,
                tags: problems.tags,
                totalSubmissions: problems.totalSubmissions,
                acceptanceRate: problems.acceptanceRate,
            })
            .from(problems);
        return rows;
    });

    // GET /problems/:slug
    app.get<{ Params: { slug: string } }>("/problems/:slug", async (req, reply) => {
        const [problem] = await db
            .select({
                id: problems.id,
                title: problems.title,
                slug: problems.slug,
                difficulty: problems.difficulty,
                description: problems.description,
                starterCode: problems.starterCode,
                tags: problems.tags,
                totalSubmissions: problems.totalSubmissions,
                acceptanceRate: problems.acceptanceRate,
                // NOTE: testCode is intentionally excluded here
            })
            .from(problems)
            .where(eq(problems.slug, req.params.slug));

        if (!problem) return reply.status(404).send({ error: "Not found" });
        return problem;
    });
}