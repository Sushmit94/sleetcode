"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getProblems } from "@/lib/api";
import { Problem } from "@solidity-judge/shared";

const diffColor: Record<string, string> = {
  Easy: "text-emerald-600",
  Medium: "text-amber-600",
  Hard: "text-rose-600",
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch((err) => console.error("Failed to fetch problems:", err));
  }, []);

  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const filtered =
    filter === "All" ? problems : problems.filter((p) => p.difficulty === filter);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">Problems</h2>
          <p className="text-sm text-slate-500">
            Write Solidity contracts. Your code is compiled and tested with{" "}
            <span className="text-indigo-600 font-medium">Foundry</span> in an isolated sandbox.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === d
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                  : "text-slate-500 hover:text-slate-900 border border-transparent"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Problem table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wide border-b border-slate-100">
                <th className="text-left px-4 py-3 w-8 font-medium">#</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium">Tags</th>
                <th className="text-right px-4 py-3 font-medium">Acceptance</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-t border-slate-50 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/problems/${p.slug}`}
                      className="text-slate-800 hover:text-indigo-600 transition-colors font-medium"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 font-medium ${diffColor[p.difficulty]}`}>
                    {p.difficulty}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded-md text-xs bg-slate-100 border border-slate-200 text-slate-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    {p.acceptanceRate > 0 ? `${p.acceptanceRate.toFixed(0)}%` : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
