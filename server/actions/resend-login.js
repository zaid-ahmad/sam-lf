"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/prisma";

const VALID_ROLES = ["ADMIN", "CANVASSER", "SALES_REP"];

async function validateAndCreateUser(email, branchCode, role) {
    if (!email || !branchCode || !role) {
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

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({ data: { email, branchCode, role } });
    }

    return user;
}

async function sendLoginLink(email) {
    const result = await signIn("resend", { email, redirect: false });
    if (result?.error) {
        throw new Error("Whoops. Something went wrong. Please try again.");
    }
    return true;
}

export default async function resendLogin(values, isLogin) {
    try {
        if (!isLogin) {
            const { email, branchCode, role } = values;
            await validateAndCreateUser(email, branchCode, role);
        }

        return await sendLoginLink(values.email);
    } catch (error) {
        console.error("Error in resendLogin:", error);
        throw error;
    }
}
