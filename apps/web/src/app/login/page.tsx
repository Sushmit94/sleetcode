"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/problems";

    return (
        <AuthForm
            mode="login"
            onSubmit={async ({ email, password }) => {
                await login(email, password);
                router.push(next);
            }}
        />
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    );
}
