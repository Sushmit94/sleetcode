"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProblem, submitSolution } from "@/lib/api";
import { Problem, SubmissionResult } from "@solidity-judge/shared";
import { TestResults } from "@/components/TestResults";
import { Navbar } from "@/components/Navbar";







export default function ProblemPage() {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getProblem(slug).then(setProblem).catch(console.error);
  }, [slug]);

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    try {
      const res = await submitSolution(problem.id, code);
      setResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) return <div className="p-8 text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-bg text-white flex flex-col">
      <Navbar />
      <main className="flex flex-1 overflow-hidden">
        {/* Left: problem description */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-border">
          <h1 className="text-xl font-semibold mb-2">{problem.title}</h1>
          <p className="text-sm text-gray-400 mb-4">{problem.description}</p>
        </div>

        {/* Right: editor + results */}
        <div className="w-1/2 flex flex-col">
          <textarea
            className="flex-1 bg-surface text-sm font-mono p-4 resize-none focus:outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Write your Solidity solution here..."
          />
          <div className="border-t border-border">
            <div className="flex justify-end p-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-accent text-white text-sm rounded hover:bg-accent/80 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </button>
            </div>
            <TestResults result={result} isSubmitting={isSubmitting} />
          </div>
        </div>
      </main>
    </div>
  );
}