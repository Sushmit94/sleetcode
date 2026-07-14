"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function LandingNavbar() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();

    return (
        <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center px-6 gap-8 sticky top-0 z-30">
            <Link href="/" className="text-indigo-600 font-bold text-lg tracking-tight">
                SolidityCode
            </Link>

            <div className="hidden md:flex items-center gap-6">
                <Link href="/problems" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    Problems
                </Link>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    Bug Hunt
                </a>
                <a href="#activity" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                    Activity
                </a>
                {user && (
                    <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                        Dashboard
                    </Link>
                )}
            </div>

            <div className="hidden sm:flex items-center flex-1 max-w-xs ml-4">
                <div className="relative w-full">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search vulnerabilities..."
                        className="w-full text-sm bg-slate-100 rounded-lg pl-9 pr-3 py-2 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-4">
                {!isLoading &&
                    (user ? (
                        <>
                            <span className="text-xs text-slate-500">{user.name}</span>
                            <button
                                onClick={async () => {
                                    await logout();
                                    router.push("/");
                                }}
                                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    ))}
            </div>
        </nav>
    );
}
