"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const links = [
    { href: "/", label: "Home" },
    { href: "/problems", label: "Problems" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

    return (
        <nav className="h-12 border-b border-border bg-surface flex items-center px-4 gap-6">
            <Link href="/" className="text-accent font-semibold text-sm tracking-tight">
                ⬡ SolidityJudge
            </Link>
            <div className="flex items-center gap-4">
                {links.map((link) => {
                    const active =
                        link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors ${
                                active ? "text-white font-medium" : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
            <span className="text-xs text-gray-500 ml-auto hidden sm:inline">
                Practice smart contracts with real Foundry tests
            </span>
            <div className="flex items-center gap-3 ml-4">
                {!isLoading &&
                    (user ? (
                        <>
                            <span className="text-xs text-gray-400">{user.name}</span>
                            <button
                                onClick={async () => {
                                    await logout();
                                    router.push("/");
                                }}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm bg-accent text-black font-medium px-3 py-1 rounded"
                            >
                                Sign up
                            </Link>
                        </>
                    ))}
            </div>
        </nav>
    );
}
