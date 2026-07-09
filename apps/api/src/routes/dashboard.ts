import { FastifyInstance } from "fastify";
import { db } from "../db/client";
import { submissions, problems } from "../db/schema";
import { eq } from "drizzle-orm";
import type { DashboardStats, Difficulty, HeatmapEntry, RecentSubmission } from "@solidity-judge/shared";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const HEATMAP_DAYS = 371; // 53 weeks, GitHub/LeetCode-style contribution graph

function dayKey(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export async function dashboardRoutes(app: FastifyInstance) {
    app.get("/dashboard", { preHandler: [app.authenticate] }, async (req, reply) => {
        const userId = req.user.id;

        const [allProblems, userSubmissions] = await Promise.all([
            db.select({ id: problems.id, difficulty: problems.difficulty }).from(problems),
            db
                .select({
                    problemId: submissions.problemId,
                    status: submissions.status,
                    createdAt: submissions.createdAt,
                    difficulty: problems.difficulty,
                    problemTitle: problems.title,
                    problemSlug: problems.slug,
                })
                .from(submissions)
                .innerJoin(problems, eq(submissions.problemId, problems.id))
                .where(eq(submissions.userId, userId)),
        ]);

        const totalByDifficulty: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
        for (const p of allProblems) totalByDifficulty[p.difficulty as Difficulty]++;

        // A problem counts as solved the first time any submission for it succeeds.
        const solvedProblemDifficulty = new Map<string, Difficulty>();
        for (const s of userSubmissions) {
            if (s.status === "success" && !solvedProblemDifficulty.has(s.problemId)) {
                solvedProblemDifficulty.set(s.problemId, s.difficulty as Difficulty);
            }
        }
        const solvedByDifficulty: Record<Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
        for (const diff of solvedProblemDifficulty.values()) solvedByDifficulty[diff]++;

        const totalSubmissions = userSubmissions.length;
        const successfulSubmissions = userSubmissions.filter((s) => s.status === "success").length;
        const acceptanceRate =
            totalSubmissions > 0 ? Math.round((successfulSubmissions / totalSubmissions) * 1000) / 10 : 0;

        // Bucket every submission by day (activity), and track days with >=1 accepted submission (streak).
        const dayCounts = new Map<string, number>();
        const activeDays = new Set<string>();
        for (const s of userSubmissions) {
            if (!s.createdAt) continue;
            const key = dayKey(new Date(s.createdAt));
            dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
            if (s.status === "success") activeDays.add(key);
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const heatmap: HeatmapEntry[] = [];
        for (let i = HEATMAP_DAYS - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setUTCDate(d.getUTCDate() - i);
            const key = dayKey(d);
            heatmap.push({ date: key, count: dayCounts.get(key) ?? 0 });
        }

        // Current streak: consecutive active days ending today (or yesterday, so an
        // in-progress day doesn't zero out the streak before the user has solved anything today).
        let currentStreak = 0;
        const cursor = new Date(today);
        if (!activeDays.has(dayKey(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1);
        while (activeDays.has(dayKey(cursor))) {
            currentStreak++;
            cursor.setUTCDate(cursor.getUTCDate() - 1);
        }

        // Longest streak: longest run of consecutive active days overall.
        let longestStreak = 0;
        let run = 0;
        let prevDate: Date | null = null;
        const sortedDays = Array.from(activeDays).sort();
        for (const key of sortedDays) {
            const d = new Date(key + "T00:00:00Z");
            if (prevDate) {
                const diffDays = Math.round((d.getTime() - prevDate.getTime()) / 86_400_000);
                run = diffDays === 1 ? run + 1 : 1;
            } else {
                run = 1;
            }
            longestStreak = Math.max(longestStreak, run);
            prevDate = d;
        }

        const recentSubmissions: RecentSubmission[] = [...userSubmissions]
            .filter((s) => s.createdAt)
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
            .slice(0, 10)
            .map((s) => ({
                problemTitle: s.problemTitle,
                problemSlug: s.problemSlug,
                difficulty: s.difficulty as Difficulty,
                status: s.status as RecentSubmission["status"],
                createdAt: new Date(s.createdAt!).toISOString(),
            }));

        const stats: DashboardStats = {
            totalSolved: solvedProblemDifficulty.size,
            totalProblems: allProblems.length,
            solvedByDifficulty,
            totalByDifficulty,
            totalSubmissions,
            acceptanceRate,
            currentStreak,
            longestStreak,
            lastSolvedDate: sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : null,
            heatmap,
            recentSubmissions,
        };

        return stats;
    });
}
