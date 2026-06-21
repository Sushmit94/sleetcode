import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@solidity-judge/shared"],
};

export default nextConfig;