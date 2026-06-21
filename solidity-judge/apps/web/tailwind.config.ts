import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            colors: {
                bg: "#0d1117",
                surface: "#161b22",
                border: "#30363d",
                accent: "#58a6ff",
                green: { 400: "#3fb950", 500: "#2ea043" },
                red: { 400: "#f85149" },
                yellow: { 400: "#d29922" },
            },
        },
    },
    plugins: [],
};

export default config;