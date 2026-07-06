"use client";

import { SubmissionResult } from "@solidity-judge/shared";

interface Props {
    result: SubmissionResult | null;
    isSubmitting: boolean;
}

export function TestResults({ result, isSubmitting }: Props) {
    if (isSubmitting) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-slate-500">
                <span className="animate-spin">⟳</span>
                Compiling and running Foundry tests…
            </div>
        );
    }

    if (!result) {
        return (
            <div className="p-4 text-sm text-slate-400">
                Submit your solution to see test results.
            </div>
        );
    }

    if (result.compileError) {
        return (
            <div className="p-4">
                <div className="flex items-center gap-2 text-rose-600 font-medium text-sm mb-2">
                    ✗ Compile Error
                </div>
                <pre className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-3 overflow-auto whitespace-pre-wrap">
                    {result.compileError}
                </pre>
            </div>
        );
    }

    const passed = result.tests?.filter((t) => t.passed).length ?? 0;
    const total = result.tests?.length ?? 0;

    return (
        <div className="p-4 text-sm">
            {/* Summary banner */}
            <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-4 font-medium ${
                    result.passed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}
            >
                <span>{result.passed ? "✓ Accepted" : "✗ Wrong Answer"}</span>
                <span className="text-xs opacity-70">
                    {passed} / {total} tests passed
                    {result.executionTimeMs ? ` · ${result.executionTimeMs}ms` : ""}
                </span>
            </div>

            {/* Per-test breakdown */}
            <div className="space-y-2">
                {result.tests?.map((test) => (
                    <div
                        key={test.name}
                        className={`rounded-lg px-3 py-2 text-xs flex flex-col gap-0.5 ${
                            test.passed
                                ? "bg-emerald-50/50 border border-emerald-100"
                                : "bg-rose-50/50 border border-rose-100"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className={test.passed ? "text-emerald-700" : "text-rose-700"}>
                                {test.passed ? "✓" : "✗"} {test.name}
                            </span>
                            {test.gasUsed != null && (
                                <span className="text-slate-400">{test.gasUsed.toLocaleString()} gas</span>
                            )}
                        </div>
                        {test.reason && (
                            <span className="text-rose-600 font-mono">{test.reason}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
