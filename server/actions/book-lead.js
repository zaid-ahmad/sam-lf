"use server";

import { auth } from "@/auth";
import NewLeadEmail from "@/emails/NewLeadEmail";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { formatPhoneNumber } from "@/lib/utils";
import { appointmentSchema } from "@/lib/validations/schema";
import { revalidatePath } from "next/cache";

async function sendEmail(
    admin_emails,
    customerName,
    customerPhone,
    customerAddress,
    customerQuadrant,
    leadId
) {
    const data = await resend.emails.send({
        from: "SAM 2.0 <noreply@zaidahmad.com>",
        to: admin_emails,
        subject: "New Lead",
        react: NewLeadEmail({
            customerName,
            customerPhone,
            customerAddress,
            customerQuadrant,
            leadId,
        }),
    });

    return {
        success: true,
        data: data,
    };
}

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

        const admin_emails = await prisma.user.findMany({
            where: {
                branchCode: user.branchCode,
                role: "ADMIN",
            },
            select: {
                email: true,
            },
        });

        const admin_email_list = admin_emails.map((admin) => admin.email);

        const isEmailSent = await sendEmail(
            admin_email_list,
            validatedData.firstName + " " + validatedData.lastName,
            validatedData.primaryPhone,
            validatedData.address,
            validatedData.quadrant,
            newLead.id
        );

        if (!isEmailSent || !isEmailSent.success) {
            return { failure: "failed to send email" };
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
