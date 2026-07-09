"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problems" },
    { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    return (
        <nav className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur flex items-center px-6 gap-8 sticky top-0 z-30">
            <Link href="/" className="text-indigo-600 font-bold text-lg tracking-tight">
                SolidityCode
            </Link>
            <div className="hidden md:flex items-center gap-6">
                {links.map((link) => {
                    const active =
                        link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors ${
                                active ? "text-slate-900 font-medium" : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
            <span className="text-xs text-slate-400 ml-auto hidden sm:inline">
                Practice smart contracts with real Foundry tests
            </span>
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
