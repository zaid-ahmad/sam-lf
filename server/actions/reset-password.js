"use server";

import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";

export default async function resetPassword(values) {
    const { email, newPassword } = values;
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
        },
    });

    redirect("/auth");
}
