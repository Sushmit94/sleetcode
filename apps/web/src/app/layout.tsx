import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SolidityJudge",
    description: "LeetCode for Solidity — practice smart contract development",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="bg-bg text-white min-h-screen font-sans antialiased">
                {children}
            </body>
        </html>
    );
}