import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",        // ✅ use "dialect" instead of "driver"
    dbCredentials: {
        url: process.env.DATABASE_URL!,  // ✅ use "url" instead of "connectionString"
    },
} satisfies Config;