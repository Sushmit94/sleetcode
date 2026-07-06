"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface AuthFormProps {
    mode: "login" | "signup";
    onSubmit: (fields: { email: string; password: string; name: string }) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await onSubmit({ email, password, name });
        } catch (err: any) {
            const apiError = err?.response?.data?.error;
            setError(
                typeof apiError === "string"
                    ? apiError
                    : mode === "login"
                    ? "Invalid email or password"
                    : "Could not create account"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-white px-4"
            style={{
                backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
                backgroundSize: "22px 22px",
                backgroundColor: "#fafbff",
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 p-8"
            >
                <Link href="/" className="text-indigo-600 font-bold text-lg tracking-tight">
                    SolidityCode
                </Link>

                <h1 className="text-lg font-semibold text-slate-900 mt-4 mb-1">
                    {mode === "login" ? "Log in" : "Create an account"}
                </h1>
                <p className="text-sm text-slate-500 mb-5">
                    {mode === "login" ? "Welcome back." : "Start solving Solidity problems."}
                </p>

                {mode === "signup" && (
                    <div className="mb-3">
                        <label className="block text-xs text-slate-500 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="block text-xs text-slate-500 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-xs text-slate-500 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        minLength={mode === "signup" ? 8 : undefined}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                </div>

                {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-indigo-600 text-white text-sm font-medium py-2.5 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Please wait…"
                        : mode === "login"
                        ? "Log in"
                        : "Sign up"}
                </button>

                <p className="text-xs text-slate-500 mt-4 text-center">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-indigo-600 hover:underline">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link href="/login" className="text-indigo-600 hover:underline">
                                Log in
                            </Link>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
}
