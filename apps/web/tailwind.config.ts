import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
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