import fastifyPlugin from "fastify-plugin";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: string; email: string; name: string };
        user: { id: string; email: string; name: string };
    }
}

const COOKIE_NAME = "token";

async function authPlugin(app: FastifyInstance) {
    await app.register(cookie);

    await app.register(jwt, {
        secret: process.env.JWT_SECRET || "dev-secret-change-me",
        cookie: {
            cookieName: COOKIE_NAME,
            signed: false,
        },
    });

    app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify();
        } catch {
            reply.status(401).send({ error: "Unauthorized" });
        }
    });
}

export default fastifyPlugin(authPlugin);
export { COOKIE_NAME };
