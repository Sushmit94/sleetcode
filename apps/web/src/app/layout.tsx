import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
    title: "SolidityJudge",
    description: "LeetCode for Solidity — practice smart contract development",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className="bg-bg text-white min-h-screen font-sans antialiased">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
