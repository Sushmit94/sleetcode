import axios from "axios";
import { Problem, SubmissionResult, User } from "@solidity-judge/shared";

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    withCredentials: true, // send/receive the httpOnly auth cookie
});

export async function signup(email: string, password: string, name: string): Promise<User> {
    const { data } = await client.post("/auth/signup", { email, password, name });
    return data.user;
}

export async function login(email: string, password: string): Promise<User> {
    const { data } = await client.post("/auth/login", { email, password });
    return data.user;
}

export async function logout(): Promise<void> {
    await client.post("/auth/logout");
}

export async function getMe(): Promise<User | null> {
    try {
        const { data } = await client.get("/auth/me");
        return data.user;
    } catch {
        return null;
    }
}

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
