export type Difficulty = "Easy" | "Medium" | "Hard";

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    description: string; // markdown
    starterCode: string;
    tags: string[];
    totalSubmissions: number;
    acceptanceRate: number;
}

export interface TestResult {
    name: string;
    passed: boolean;
    reason: string | null;
    gasUsed: number | null;
}

export interface SubmissionResult {
    jobId: string;
    status: "queued" | "running" | "success" | "failed" | "error";
    passed?: boolean;
    tests?: TestResult[];
    compileError?: string | null;
    executionTimeMs?: number;
}

export interface HeatmapEntry {
    date: string; // YYYY-MM-DD
    count: number;
}

export interface RecentSubmission {
    problemTitle: string;
    problemSlug: string;
    difficulty: Difficulty;
    status: "queued" | "running" | "success" | "failed" | "error";
    createdAt: string; // ISO timestamp
}

export interface DashboardStats {
    totalSolved: number;
    totalProblems: number;
    solvedByDifficulty: Record<Difficulty, number>;
    totalByDifficulty: Record<Difficulty, number>;
    totalSubmissions: number;
    acceptanceRate: number; // 0-100
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate: string | null; // YYYY-MM-DD
    heatmap: HeatmapEntry[];
    recentSubmissions: RecentSubmission[];
}
