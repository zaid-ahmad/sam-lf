import RescheduleRequest from "@/emails/RescheduleRequest";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";
import { dirtyToFormattedPhoneNumber } from "@/lib/utils";
import { NextResponse } from "next/server";
import twilio from "twilio";

const { validateRequest } = twilio;

export async function POST(req) {
    // Get the raw body as a string
    const body = await req.text();

    // Parse the body
    const params = new URLSearchParams(body);
    const twilioSignature = req.headers.get("x-twilio-signature") || "";
    const url =
        process.env.WEBHOOK_URL ||
        "https://1388-2001-56a-7ded-a800-11f4-5f5e-4051-c317.ngrok-free.app/api/twilio-webhook"; // Set this in your environment variables

    // Verify that the request is coming from Twilio
    if (
        !validateRequest(
            process.env.TWILIO_AUTH_TOKEN || "",
            twilioSignature,
            url,
            Object.fromEntries(params)
        )
    ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const incomingMessage = params.get("Body")?.trim().toUpperCase();
    const phoneNumber = params.get("From");

    if (!phoneNumber) {
        return NextResponse.json(
            { error: "Missing phone number" },
            { status: 400 }
        );
    }

    switch (incomingMessage) {
        case "REBOOK":
            // Handle rebooking logic
            await handleRebook(phoneNumber);
            break;
        case "CANCEL-APT":
            // Handle cancellation logic
            await handleCancel(phoneNumber);
            break;
        case "STOP":
            // Handle opt-out logic
            await handleStop(phoneNumber);
            break;
        default:
            // Handle unknown responses
            await sendMessage(
                phoneNumber,
                "Sorry, we didn't understand your response. Please reply with REBOOK, CANCEL, or STOP."
            );
    }

    return NextResponse.json({ success: true });
}

async function handleRebook(phoneNumber) {
    try {
        // 1. Look up the Lead in the database using the phone number
        const lead = await prisma.lead.findFirst({
            where: { phone1: dirtyToFormattedPhoneNumber(phoneNumber) },
            select: {
                id: true,
                branch: true,
                firstName: true,
                lastName: true,
                phone1: true,
                address: true,
                quadrant: true,
                status: true, // Added status to the select
            },
        });

        if (!lead) {
            await sendMessage(
                phoneNumber,
                "We couldn't find your information in our system. Please call our office to reschedule."
            );
            return;
        }

        // Check if the lead already has a REBOOK status
        if (lead.status === "REBOOK") {
            await sendMessage(
                phoneNumber,
                "We've already received your request to reschedule. A representative will contact you soon. If you haven't heard from us within 24 hours, please call our office."
            );
            return;
        }

        // Update the lead status to REBOOK
        await prisma.lead.update({
            where: { id: lead.id },
            data: { status: "REBOOK" },
        });

        // Send an email to the branch admins
        await sendEmailToBranchAdmins(lead.branch, lead);

        // Send a confirmation message to the customer
        await sendMessage(
            phoneNumber,
            "Thank you for your request to reschedule. A representative from your local branch will contact you shortly to arrange a new appointment time."
        );
    } catch (error) {
        console.error("Error in handleRebook:", error);
        await sendMessage(
            phoneNumber,
            "We're sorry, but there was an error processing your request. Please call our office to reschedule."
        );
    }
}

async function handleCancel(phoneNumber) {
    await prisma.lead.update({
        where: { phone1: dirtyToFormattedPhoneNumber(phoneNumber) },
        data: { status: "CANCELLED" },
    });
    /*
    const lead = await prisma.lead.findFirst({
        where: { phone1: dirtyToFormattedPhoneNumber(phoneNumber) },
        select: {
            id: true,
        },
    });
    await prisma.lead.delete({
        where: { id: lead.id },
    });
    */
    await sendMessage(
        phoneNumber,
        "Your appointment has been cancelled. Thank you for letting us know."
    );
}

async function sendEmailToBranchAdmins(branch, lead) {
    const admin_emails = await prisma.user.findMany({
        where: {
            branchCode: branch,
            role: "ADMIN",
        },
        select: {
            email: true,
        },
    });

    const admin_email_list = admin_emails.map((admin) => admin.email);

    const data = await resend.emails.send({
        from: "SAM 2.0 <noreply@leadflowmanager.com>",
        to: admin_email_list,
        subject: `Rescheduling Request for ${lead.firstName} ${lead.lastName}`,
        react: RescheduleRequest({
            customerName: lead.firstName + " " + lead.lastName,
            customerPhone: lead.phone1,
            customerAddress: lead.address,
            customerQuadrant: lead.quadrant,
            leadId: lead.id,
        }),
    });
}

async function handleStop(phoneNumber) {
    await prisma.lead.update({
        where: { phone1: dirtyToFormattedPhoneNumber(phoneNumber) },
        data: { status: "CANCELLED" },
    });
    /* 
    const lead = await prisma.lead.findFirst({
        where: { phone1: dirtyToFormattedPhoneNumber(phoneNumber) },
        select: {
            id: true,
        },
    });
    await prisma.lead.delete({
        where: { id: lead.id },
    });
    */
    // Implement opt-out logic here
    await sendMessage(
        phoneNumber,
        "You have been unsubscribed from our messages. You will not receive any more texts from us."
    );
}

export async function sendMessage(to, body) {
    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
        body: body,
        from: "+19123015571",
        to: to,
    });
}
