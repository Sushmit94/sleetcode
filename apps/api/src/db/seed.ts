import "dotenv/config"; // ADD AS LINE 1
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { db } from "./client";
import { problems } from "./schema";
import { nanoid } from "nanoid";

const PROBLEMS_DIR = path.resolve(__dirname, "..", "..", "problems");

interface ProblemMeta {
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
}

async function seed() {
    console.log("Seeding problems...");

    const slugs = readdirSync(PROBLEMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    for (const slug of slugs) {
        const dir = path.join(PROBLEMS_DIR, slug);
        const meta: ProblemMeta = JSON.parse(readFileSync(path.join(dir, "meta.json"), "utf-8"));
        const description = readFileSync(path.join(dir, "description.md"), "utf-8");
        const starterCode = readFileSync(path.join(dir, "starter.sol"), "utf-8");
        const testCode = readFileSync(path.join(dir, "test.sol"), "utf-8");

        const content = {
            title: meta.title,
            difficulty: meta.difficulty,
            tags: meta.tags,
            description,
            starterCode,
            testCode,
        };

        await db
            .insert(problems)
            .values({ id: nanoid(), slug, ...content })
            .onConflictDoUpdate({ target: problems.slug, set: content });

        console.log(`  ✓ ${meta.title} (${slug})`);
    }

    console.log("Done.");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
