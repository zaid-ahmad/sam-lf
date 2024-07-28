"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

const VALID_ROLES = ["CANVASSER", "SALES_REP"];

async function validateAndCreateUser(
    firstName,
    lastName,
    email,
    password,
    branchCode,
    role
) {
    if (!email || !password || !branchCode || !role) {
        throw new Error("All fields are required.");
    }

    const branch = await prisma.branch.findUnique({
        where: { code: branchCode },
    });

    if (!branch) {
        throw new Error("Invalid branch code.");
    }

    if (!VALID_ROLES.includes(role)) {
        throw new Error("Invalid role.");
    }

    const hashedPassword = await hash(password, 12);

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        throw new Error("User already exists.");
    }

    user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            branchCode,
            role,
        },
    });

    return user;
}

async function authenticateUser(email, password) {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password.");
        }
    }
    const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
    });
    if (result?.error) {
        throw new Error("Invalid email or password.");
    }
    return true;
}

export default async function handleAuth(values, isLogin) {
    try {
        let authResult;

        if (isLogin) {
            authResult = await authenticateUser(values.email, values.password);
        } else {
            const { firstName, lastName, email, password, branchCode, role } =
                values;
            await validateAndCreateUser(
                firstName,
                lastName,
                email,
                password,
                branchCode,
                role
            );
            authResult = await authenticateUser(email, password);
        }

        // Return the result of the authentication, which includes the URL to redirect to
        return { success: true, redirectUrl: "/dashboard" };
    } catch (error) {
        console.error("Error in handleAuth:", error);
        return { error: error.message };
    }
}
