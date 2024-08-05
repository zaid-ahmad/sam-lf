"use server";

import { sendMessage } from "@/app/api/twilio-webhook/route";
import { auth } from "@/auth";
import NewLeadEmail from "@/emails/NewLeadEmail";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { formatPhoneNumber } from "@/lib/utils";
import { appointmentSchema } from "@/lib/validations/schema";
import { revalidatePath } from "next/cache";
import twilio from "twilio";

async function sendEmail(
    admin_emails,
    customerName,
    customerPhone,
    customerAddress,
    customerQuadrant,
    leadId
) {
    const results = await Promise.all(
        admin_emails.map(async (email) => {
            try {
                const data = await resend.emails.send({
                    from: "SAM 2.0 <noreply@leadflowmanager.com>",
                    to: email,
                    subject: "New Lead | Awaiting Assignment",
                    react: NewLeadEmail({
                        customerName,
                        customerPhone,
                        customerAddress,
                        customerQuadrant,
                        leadId,
                    }),
                });

                return {
                    email,
                    success: true,
                    data: data,
                };
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
                return {
                    email,
                    success: false,
                    error: error.message,
                };
            }
        })
    );

    const allSuccessful = results.every((result) => result.success);

    return {
        success: allSuccessful,
        results: results,
    };
}

async function sendSMS(phoneNumber, dateTime) {
    const accountSId = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = twilio(accountSId, authToken);

    const result = await client.messages.create({
        body: `
        Leaf Filter Appointment Confirmation ${dateTime}. 

We look forward to meeting you!

To make any changes, reply with :
REBOOK - To have your appointment rescheduled.
CANCEL-APT - To cancel your appointment.
STOP - To unsubscribe.
        `,
        from: "+19123015571",
        to: formatPhoneNumber(phoneNumber),
    });

    if (result) {
        return true;
    }

    return false;
}

export async function addLeadToDatabase(formData, date, timeSlot) {
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
                date: date,
                timeslot: timeSlot,
                homeOwnerType:
                    validatedData.homeownerType === "PLEASE_SELECT"
                        ? null
                        : validatedData.homeownerType || null,
                age:
                    validatedData.age === "PLEASE_SELECT"
                        ? null
                        : validatedData.age || null,
                concerns: validatedData.concerns,
                surrounding: validatedData.surroundings,
                serviceNeeded: validatedData.serviceNeeds,
                canvasser: {
                    connect: { id: user.id },
                },
                branch: user.branchCode,
            },
        });

        const [admin_emails, superadmin_emails] = await Promise.all([
            prisma.user.findMany({
                where: {
                    branchCode: user.branchCode,
                    role: "ADMIN",
                },
                select: {
                    email: true,
                },
            }),
            prisma.user.findMany({
                where: {
                    role: "SUPERADMIN",
                },
                select: {
                    email: true,
                },
            }),
        ]);

        const combined_email_list = [
            ...admin_emails.map((admin) => admin.email),
            ...superadmin_emails.map((superadmin) => superadmin.email),
        ];
        /*
        if (user.branchCode === "3CGY") {
            sendMessage(
                "+14039885931",
                "There's a new appointment on SAM 2.0. Please assign it."
            );
        }
 */
        const isEmailSent = await sendEmail(
            combined_email_list,
            validatedData.firstName + " " + validatedData.lastName,
            validatedData.primaryPhone,
            validatedData.address,
            validatedData.quadrant,
            newLead.id
        );

        const isSMSSent = await sendSMS(
            validatedData.primaryPhone,
            validatedData.appointmentDateTime
        );

        if (!isSMSSent) {
            return { failure: "failed to send SMS" };
        }

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
