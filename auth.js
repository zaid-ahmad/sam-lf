import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export const { handlers, auth, signIn, signOut } = NextAuth({
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;

                const existingUser = await prisma.user.findUnique({
                    where: {
                        id: token.sub,
                    },
                });

                session.user.role = existingUser.role;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (!token.sub) return token;

            return token;
        },
    },
    providers: [
        Resend({
            from: "noreply@zaidahmad.com",
        }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    jwt: {
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    },
});
