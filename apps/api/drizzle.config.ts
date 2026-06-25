import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config();
export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",        // ✅ use "dialect" instead of "driver"
    dbCredentials: {
        url: process.env.DATABASE_URL!,  // ✅ use "url" instead of "connectionString"
    },
} satisfies Config;