"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProblemPanel } from "@/components/ProblemPanel";
import { Editor } from "@/components/Editor";
import { TestResults } from "@/components/TestResults";
import { getProblem, submitCode, pollResult } from "@/lib/api";
import { Problem, SubmissionResult } from "@solidity-judge/shared";

export default function ProblemPage() {
    const { slug } = useParams<{ slug: string }>();

    const [problem, setProblem] = useState<Problem | null>(null);
    const [result, setResult] = useState<SubmissionResult | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        getProblem(slug)
            .then(setProblem)
            .catch((err) => console.error("Failed to fetch problem:", err));

        return () => {
            if (pollTimer.current) clearInterval(pollTimer.current);
        };
    }, [slug]);

    async function handleSubmit(code: string) {
        setIsSubmitting(true);
        setResult(null);
        try {
            const { jobId } = await submitCode(slug, code);
            pollTimer.current = setInterval(async () => {
                const res = await pollResult(jobId);
                if (res.status === "success" || res.status === "failed" || res.status === "error") {
                    if (pollTimer.current) clearInterval(pollTimer.current);
                    setResult(res);
                    setIsSubmitting(false);
                }
            }, 1500);
        } catch (err) {
            console.error("Submission failed:", err);
            setIsSubmitting(false);
        }
    }

    if (!problem) {
        return (
            <div className="min-h-screen bg-bg text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
                    Loading problem…
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-bg text-white flex flex-col">
            <Navbar />
            <div className="flex-1 grid grid-cols-2 min-h-0">
                <div className="border-r border-border min-h-0">
                    <ProblemPanel problem={problem} />
                </div>
                <div className="grid grid-rows-2 min-h-0">
                    <div className="min-h-0 border-b border-border">
                        <Editor
                            defaultCode={problem.starterCode}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                    <div className="min-h-0 overflow-y-auto">
                        <TestResults result={result} isSubmitting={isSubmitting} />
                    </div>
                </div>
            </div>
        </div>
    );
}
