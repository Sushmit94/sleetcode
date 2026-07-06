"use client";

import ReactMarkdown from "react-markdown";
import { Problem } from "@solidity-judge/shared";

const diffColor: Record<string, string> = {
    Easy: "text-emerald-600",
    Medium: "text-amber-600",
    Hard: "text-rose-600",
};

export function ProblemPanel({ problem }: { problem: Problem }) {
    return (
        <div className="h-full overflow-y-auto p-5 text-sm text-slate-700 leading-relaxed">
            <div className="mb-3 flex items-center gap-3">
                <h1 className="text-lg font-semibold text-slate-900">{problem.title}</h1>
                <span className={`text-xs font-medium ${diffColor[problem.difficulty]}`}>
                    {problem.difficulty}
                </span>
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
                {problem.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-xs bg-slate-100 border border-slate-200 text-slate-500"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="prose prose-slate prose-sm max-w-none">
                <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>
        </div>
    );
}
