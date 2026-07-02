import { SubmissionResult, TestResult } from "@solidity-judge/shared";

export function parseForgeOutput(
    raw: string,
    timedOut: boolean,
    startTime: number
): Omit<SubmissionResult, "jobId"> {
    if (timedOut) {
        return {
            status: "error",
            passed: false,
            tests: [],
            compileError: "Time limit exceeded (30s)",
            executionTimeMs: 30_000,
        };
    }

    const executionTimeMs = Date.now() - startTime;

    // Try to find JSON output (forge test --json)
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
        // No JSON — likely a compile error
        const errorMatch = raw.match(/error\[.*?\].*?(?=\n\n|\z)/is);
        return {
            status: "error",
            passed: false,
            tests: [],
            compileError: errorMatch ? errorMatch[0].slice(0, 2000) : raw.slice(0, 2000),
            executionTimeMs,
        };
    }

    let parsed: any;
    try {
        parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    } catch {
        return {
            status: "error",
            passed: false,
            tests: [],
            compileError: "Failed to parse forge output:\n" + raw.slice(0, 1000),
            executionTimeMs,
        };
    }

    // forge test --json shape:
    // { "test/Solution.t.sol": { "test_xxx": { "status": "Success"|"Failure", "reason": null|"...", "gas": 12345 } } }
    const tests: TestResult[] = [];

    for (const [, suite] of Object.entries(parsed)) {
        if (typeof suite !== "object" || suite === null) continue;
        const testResults = (suite as any).test_results;
        if (typeof testResults !== "object" || testResults === null) continue;
        for (const [name, result] of Object.entries(testResults)) {
            tests.push({
                name,
                passed: (result as any).status === "Success",
                reason: (result as any).reason ?? null,
                gasUsed: (result as any).kind?.Unit?.gas ?? (result as any).gas ?? null,
            });
        }
    }

    const passed = tests.length > 0 && tests.every((t) => t.passed);

    return {
        status: passed ? "success" : "failed",
        passed,
        tests,
        compileError: null,
        executionTimeMs,
    };
}