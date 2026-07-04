import { FastifyInstance } from "fastify";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { hashPassword, comparePassword } from "../services/auth.service";
import { COOKIE_NAME } from "../plugins/auth";

const SignupBody = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    name: z.string().min(1).max(100),
});

const LoginBody = z.object({
    email: z.string().email(),
    password: z.string().min(1).max(100),
});

const COOKIE_OPTIONS = {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function authRoutes(app: FastifyInstance) {
    app.post("/auth/signup", async (req, reply) => {
        const body = SignupBody.safeParse(req.body);
        if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

        const { email, password, name } = body.data;

        const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
        if (existing) return reply.status(409).send({ error: "Email already registered" });

        const passwordHash = await hashPassword(password);
        const userId = nanoid();

        await db.insert(users).values({ id: userId, email, passwordHash, name });

        const token = app.jwt.sign({ id: userId, email, name });
        reply.setCookie(COOKIE_NAME, token, COOKIE_OPTIONS);

        return { user: { id: userId, email, name } };
    });

    app.post("/auth/login", async (req, reply) => {
        const body = LoginBody.safeParse(req.body);
        if (!body.success) return reply.status(400).send({ error: body.error.flatten() });

        const { email, password } = body.data;

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) return reply.status(401).send({ error: "Invalid email or password" });

        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) return reply.status(401).send({ error: "Invalid email or password" });

        const token = app.jwt.sign({ id: user.id, email: user.email, name: user.name });
        reply.setCookie(COOKIE_NAME, token, COOKIE_OPTIONS);

        return { user: { id: user.id, email: user.email, name: user.name } };
    });

    app.post("/auth/logout", async (_req, reply) => {
        reply.clearCookie(COOKIE_NAME, { path: "/" });
        return { ok: true };
    });

    app.get("/auth/me", { preHandler: [app.authenticate] }, async (req) => {
        return { user: req.user };
    });
}
