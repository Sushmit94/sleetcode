import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
    title: "SolidityCode",
    description: "Master the Ethereum stack — audit, optimize, and deploy secure smart contracts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-white text-slate-900 min-h-screen font-sans antialiased">
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
