"use client";

import ReactMarkdown from "react-markdown";
import { Problem } from "@solidity-judge/shared";

const diffColor: Record<string, string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
};

export function ProblemPanel({ problem }: { problem: Problem }) {
    return (
        <div className= "h-full overflow-y-auto p-5 text-sm text-gray-200 leading-relaxed" >
        <div className="mb-3 flex items-center gap-3" >
            <h1 className="text-lg font-semibold text-white" > { problem.title } </h1>
                < span className = {`text-xs font-medium ${diffColor[problem.difficulty]}`
}>
    { problem.difficulty }
    </span>
    </div>

    < div className = "flex gap-2 mb-5 flex-wrap" >
    {
        problem.tags.map((tag) => (
            <span
            key= { tag }
            className = "px-2 py-0.5 rounded text-xs bg-surface border border-border text-gray-400"
            >
            { tag }
            </span>
        ))
    }
        </div>

        < div className = "prose prose-invert prose-sm max-w-none" >
            <ReactMarkdown>{ problem.description } </ReactMarkdown>
            </div>
            </div>
  );
}