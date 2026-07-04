"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { User } from "@solidity-judge/shared";
import { getMe, login as apiLogin, logout as apiLogout, signup as apiSignup } from "./api";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMe()
            .then(setUser)
            .finally(() => setIsLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const user = await apiLogin(email, password);
        setUser(user);
    }, []);

    const signup = useCallback(async (email: string, password: string, name: string) => {
        const user = await apiSignup(email, password, name);
        setUser(user);
    }, []);

    const logout = useCallback(async () => {
        await apiLogout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
