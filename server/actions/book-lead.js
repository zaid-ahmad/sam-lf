"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations/schema";
export async function addLeadToDatabase(formData) {
    try {
        const session = await auth();

        if (!session) {
            return { failure: "not authenticated" };
        }

        if (!formData) {
            return { failure: "no data provided" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return { failure: "user not found" };
        }

        if (user.role !== "CANVASSER") {
            return { failure: "user is not a canvasser" };
        }

        // Validate the incoming data
        const validatedData = appointmentSchema.parse(formData);

        // Create the lead in the database
        const newLead = await prisma.lead.create({
            data: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                phone1: validatedData.primaryPhone,
                phone2: validatedData.secondaryPhone,
                email: validatedData.email,
                address: validatedData.address,
                quadrant: validatedData.quadrant,
                postalCode: validatedData.postalCode,
                images: validatedData.images || [],
                addressNotes: validatedData.addressNotes,
                appointmentDateTime: validatedData.appointmentDateTime,
                homeOwnerType: validatedData.homeownerType,
                age: validatedData.age,
                concerns: validatedData.concerns,
                surrounding: validatedData.surroundings,
                serviceNeeded: validatedData.serviceNeeds,
                canvasser: {
                    connect: { id: user.id },
                },
                branch: user.branchCode,
            },
        });

        // Send email notification to the admins about the new lead

        return { success: true };
    } catch (error) {
        console.error("Error adding lead to database:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unknown error occurred" };
    }
}
