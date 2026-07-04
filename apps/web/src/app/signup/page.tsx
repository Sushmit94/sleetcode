"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
    const { signup } = useAuth();
    const router = useRouter();

    return (
        <AuthForm
            mode="signup"
            onSubmit={async ({ email, password, name }) => {
                await signup(email, password, name);
                router.push("/problems");
            }}
        />
    );
}
