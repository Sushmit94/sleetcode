export type Difficulty = "Easy" | "Medium" | "Hard";

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