import { spawn } from "node:child_process";
import { mkdir, mkdtemp, cp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const FORGE_BIN = path.resolve(__dirname, "..", "..", "..", "..", ".foundry", "bin", "forge");
const TEMPLATE_DIR = path.resolve(__dirname, "..", "..", "sandbox-template");
const TIMEOUT_MS = 30_000;

export async function runSandbox(
    userCode: string,
    testCode: string
): Promise<{ stdout: string; timedOut: boolean }> {
    const dir = await mkdtemp(path.join(tmpdir(), "solidity-judge-"));

    try {
        await mkdir(path.join(dir, "src"), { recursive: true });
        await mkdir(path.join(dir, "test"), { recursive: true });
        await cp(path.join(TEMPLATE_DIR, "lib"), path.join(dir, "lib"), { recursive: true });
        await cp(path.join(TEMPLATE_DIR, "foundry.toml"), path.join(dir, "foundry.toml"));
        await cp(path.join(TEMPLATE_DIR, "remappings.txt"), path.join(dir, "remappings.txt"));
        await writeFile(path.join(dir, "src", "Solution.sol"), userCode);
        await writeFile(path.join(dir, "test", "Solution.t.sol"), testCode);

        return await new Promise((resolve, reject) => {
            const proc = spawn(FORGE_BIN, ["test", "--json", "--no-match-test", "SKIP"], {
                cwd: dir,
            });

            let stdout = "";
            let timedOut = false;

            const timer = setTimeout(() => {
                timedOut = true;
                proc.kill("SIGKILL");
            }, TIMEOUT_MS);

            proc.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
            proc.stderr.on("data", (chunk) => { stdout += chunk.toString(); });
            proc.on("error", (err) => {
                clearTimeout(timer);
                reject(err);
            });
            proc.on("close", () => {
                clearTimeout(timer);
                resolve({ stdout, timedOut });
            });
        });
    } finally {
        await rm(dir, { recursive: true, force: true });
    }
}
