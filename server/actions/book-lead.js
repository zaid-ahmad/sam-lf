"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { formatPhoneNumber } from "@/lib/utils";
import { appointmentSchema } from "@/lib/validations/schema";
import { revalidatePath } from "next/cache";

async function sendSMS(phoneNumber) {
    const accountSId = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = require("twilio")(accountSId, authToken);

    const result = await client.messages.create({
        body: "Your appointment has been booked!",
        from: "+19123015571",
        to: formatPhoneNumber(phoneNumber),
    });

    if (result) {
        return true;
    }

    return false;
}

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

        // Sends email notification to the admins of the branch
        // const emailVerdict = await sendEmail(user.branch);

        // if (!emailVerdict) {
        //     return { failure: "failed to send email" };
        // }

        // Sends SMS notification to the customer about the appointment
        const SMSverdict = await sendSMS(newLead.phone1);

        if (!SMSverdict) {
            return { failure: "failed to send SMS" };
        }

        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.error("Error adding lead to database:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "An unknown error occurred" };
    }
}
