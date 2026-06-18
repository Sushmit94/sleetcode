import axios from "axios";
import { Problem, SubmissionResult } from "@solidity-judge/shared";

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
});

export async function getProblems(): Promise<Problem[]> {
    const { data } = await client.get("/problems");
    return data;
}

export async function getProblem(slug: string): Promise<Problem> {
    const { data } = await client.get(`/problems/${slug}`);
    return data;
}

export async function submitCode(
    problemSlug: string,
    userCode: string
): Promise<{ jobId: string }> {
    const { data } = await client.post("/submit", { problemSlug, userCode });
    return data;
}

export async function pollResult(jobId: string): Promise<SubmissionResult> {
    const { data } = await client.get(`/result/${jobId}`);
    return data;
}