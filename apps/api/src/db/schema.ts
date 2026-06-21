import { pgTable, text, integer, real, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const difficultyEnum = pgEnum("difficulty", ["Easy", "Medium", "Hard"]);

export const problems = pgTable("problems", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    difficulty: difficultyEnum("difficulty").notNull(),
    description: text("description").notNull(),
    starterCode: text("starter_code").notNull(),
    testCode: text("test_code").notNull(), // hidden from user
    tags: text("tags").array().notNull().default([]),
    totalSubmissions: integer("total_submissions").notNull().default(0),
    acceptanceRate: real("acceptance_rate").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
    id: text("id").primaryKey(),
    problemId: text("problem_id").notNull(),
    userCode: text("user_code").notNull(),
    status: text("status").notNull().default("queued"), // queued|running|success|failed|error
    passed: integer("passed"), // 1 or 0
    testResults: text("test_results"), // JSON string
    compileError: text("compile_error"),
    executionTimeMs: integer("execution_time_ms"),
    createdAt: timestamp("created_at").defaultNow(),
});