"use client";

import { SubmissionResult } from "@solidity-judge/shared";

interface Props {
    result: SubmissionResult | null;
    isSubmitting: boolean;
}

export function TestResults({ result, isSubmitting }: Props) {
    if (isSubmitting) {
        return (
            <div className= "flex items-center gap-2 p-4 text-sm text-gray-400" >
            <span className="animate-spin" >⟳</span>
        Compiling and running Foundry tests…
        </div>
    );
    }

    if (!result) {
        return (
            <div className= "p-4 text-sm text-gray-500" >
            Submit your solution to see test results.
      </div>
    );
    }

    if (result.compileError) {
        return (
            <div className= "p-4" >
            <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-2" >
          ✗ Compile Error
            </div>
            < pre className = "text-xs text-red-300 bg-red-950/30 rounded p-3 overflow-auto whitespace-pre-wrap" >
                { result.compileError }
                </pre>
                </div>
    );
    }

    const passed = result.tests?.filter((t) => t.passed).length ?? 0;
    const total = result.tests?.length ?? 0;

    return (
        <div className= "p-4 text-sm" >
        {/* Summary banner */ }
        < div
    className = {`flex items-center gap-3 px-4 py-2 rounded mb-4 font-medium ${result.passed
            ? "bg-green-500/10 text-green-400 border border-green-500/30"
            : "bg-red-500/10 text-red-400 border border-red-500/30"
        }`
}
      >
    <span>{ result.passed ? "✓ Accepted" : "✗ Wrong Answer" } </span>
    < span className = "text-xs opacity-70" >
        { passed } / { total } tests passed
{ result.executionTimeMs ? ` · ${result.executionTimeMs}ms` : "" }
</span>
    </div>

{/* Per-test breakdown */ }
<div className="space-y-2" >
{
    result.tests?.map((test) => (
        <div
            key= { test.name }
            className = {`rounded px-3 py-2 text-xs flex flex-col gap-0.5 ${test.passed
                ? "bg-green-500/5 border border-green-500/20"
                : "bg-red-500/5 border border-red-500/20"
            }`}
    >
    <div className="flex items-center justify-between" >
        <span className={ test.passed ? "text-green-400" : "text-red-400" }>
            { test.passed ? "✓" : "✗" } { test.name }
</span>
{
    test.gasUsed != null && (
        <span className="text-gray-500" > { test.gasUsed.toLocaleString() } gas </span>
              )
}
</div>
{
    test.reason && (
        <span className="text-red-300 font-mono" > { test.reason } </span>
            )
}
</div>
        ))}
</div>
    </div>
  );
}