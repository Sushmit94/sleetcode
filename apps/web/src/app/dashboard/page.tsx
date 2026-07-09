"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ContributionGraph } from "@/components/ContributionGraph";
import { useAuth } from "@/lib/auth-context";
import { getDashboardStats } from "@/lib/api";
import { DashboardStats, Difficulty } from "@solidity-judge/shared";

const diffColor: Record<Difficulty, string> = {
    Easy: "text-emerald-600",
    Medium: "text-amber-600",
    Hard: "text-rose-600",
};

const diffBar: Record<Difficulty, string> = {
    Easy: "bg-emerald-500",
    Medium: "bg-amber-500",
    Hard: "bg-rose-500",
};

const STATUS_META: Record<string, { label: string; color: string }> = {
    success: { label: "Accepted", color: "text-emerald-600" },
    failed: { label: "Failed", color: "text-rose-600" },
    error: { label: "Error", color: "text-rose-600" },
    running: { label: "Running", color: "text-amber-600" },
    queued: { label: "Queued", color: "text-slate-400" },
};

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
    );
}

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?next=/dashboard");
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        if (!user) return;
        getDashboardStats()
            .then(setStats)
            .catch((err) => {
                console.error("Failed to fetch dashboard stats:", err);
                setError("Failed to load dashboard stats.");
            });
    }, [user]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-white text-slate-900 flex flex-col">
                <Navbar />
                <main className="max-w-4xl mx-auto w-full px-4 py-8 text-slate-400 text-sm">Loading...</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col">
            <Navbar />
            <main className="max-w-4xl mx-auto w-full px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1">Welcome back, {user.name}</h2>
                    <p className="text-sm text-slate-500">Here is how your Solidity practice is going.</p>
                </div>

                {error && (
                    <div className="rounded-lg border border-rose-100 bg-rose-50 text-rose-600 text-sm px-4 py-3 mb-6">
                        {error}
                    </div>
                )}

                {!stats ? (
                    <div className="text-sm text-slate-400">Loading stats...</div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <StatCard label="Solved" value={`${stats.totalSolved}/${stats.totalProblems}`} />
                            <StatCard
                                label="Current Streak"
                                value={`${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`}
                            />
                            <StatCard
                                label="Longest Streak"
                                value={`${stats.longestStreak} day${stats.longestStreak === 1 ? "" : "s"}`}
                            />
                            <StatCard label="Acceptance" value={`${stats.acceptanceRate}%`} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Solved by difficulty</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => {
                                    const solved = stats.solvedByDifficulty[d];
                                    const total = stats.totalByDifficulty[d];
                                    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
                                    return (
                                        <div key={d}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-sm font-medium ${diffColor[d]}`}>{d}</span>
                                                <span className="text-xs text-slate-400">
                                                    {solved}/{total}
                                                </span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${diffBar[d]}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Submission activity</h3>
                            <ContributionGraph data={stats.heatmap} />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <div className="px-5 py-3 border-b border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-700">Recent submissions</h3>
                            </div>
                            {stats.recentSubmissions.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-slate-400">
                                    No submissions yet — go solve a problem!
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <tbody>
                                        {stats.recentSubmissions.map((s, i) => {
                                            const meta = STATUS_META[s.status] ?? { label: s.status, color: "text-slate-400" };
                                            return (
                                                <tr
                                                    key={i}
                                                    className="border-t border-slate-50 first:border-t-0 hover:bg-slate-50/60 transition-colors"
                                                >
                                                    <td className="px-5 py-3">
                                                        <Link
                                                            href={`/problems/${s.problemSlug}`}
                                                            className="text-slate-800 hover:text-indigo-600 font-medium transition-colors"
                                                        >
                                                            {s.problemTitle}
                                                        </Link>
                                                    </td>
                                                    <td className={`px-4 py-3 font-medium ${diffColor[s.difficulty]}`}>
                                                        {s.difficulty}
                                                    </td>
                                                    <td className={`px-4 py-3 font-medium ${meta.color}`}>{meta.label}</td>
                                                    <td className="px-5 py-3 text-right text-slate-400">
                                                        {new Date(s.createdAt).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
