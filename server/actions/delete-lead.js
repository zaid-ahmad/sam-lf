"use server";

import prisma from "@/lib/prisma";

export async function deleteLead(formData) {
    try {
        const id = formData.get("id");
        const inPastLeads = formData.get("inPastLeads");
        await prisma.lead.delete({ where: { id } });

        if (inPastLeads) {
            revalidatePath("/past-leads");
        } else {
            revalidatePath("/dashboard");
        }
    } catch (error) {
        console.error("Error deleting lead:", error);
        throw error;
    }
}
