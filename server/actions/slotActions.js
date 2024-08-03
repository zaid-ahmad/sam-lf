"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getSlots() {
    try {
        const session = await auth();

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                branchCode: true,
            },
        });

        const slots = await prisma.slotTemplate.findMany();

        return {
            success: true,
            data: slots,
            branchCode: user.branchCode,
        };
    } catch (error) {
        console.error("Failed to fetch slots:", error);
        return { success: false, error: "Failed to fetch slots" };
    }
}

export async function createSlot(data) {
    try {
        const newSlot = await prisma.slotTemplate.create({
            data: {
                branchCode: data.branchCode,
                timeSlot: data.timeSlot,
                limit: parseInt(data.limit),
            },
        });
        return { success: true, data: newSlot };
    } catch (error) {
        console.error("Failed to create slot:", error);
        return { success: false, error: "Failed to create slot" };
    }
}

export async function updateSlot(id, data) {
    try {
        const updatedSlot = await prisma.slotTemplate.update({
            where: { id },
            data: {
                branchCode: data.branchCode,
                timeSlot: data.timeSlot,
                limit: parseInt(data.limit),
                booked: data.booked,
            },
        });
        return { success: true, data: updatedSlot };
    } catch (error) {
        console.error("Failed to update slot:", error);
        return { success: false, error: "Failed to update slot" };
    }
}

export async function deleteSlot(id) {
    try {
        await prisma.slotTemplate.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete slot:", error);
        return { success: false, error: "Failed to delete slot" };
    }
}

async function checkAvailability(branchCode, date, timeSlot) {
    const slotTemplate = await prisma.slotTemplate.findUnique({
        where: {
            branchCode_timeSlot: {
                branchCode,
                timeSlot,
            },
        },
    });

    if (!slotTemplate) {
        throw new Error("Slot template not found");
    }

    const bookingsCount = await prisma.lead.count({
        where: {
            branch: branchCode,
            date,
            timeslot: timeSlot,
        },
    });

    return {
        isAvailable: bookingsCount < slotTemplate.limit,
        remainingSlots: Math.max(0, slotTemplate.limit - bookingsCount),
    };
}

export async function getAvailableSlots(branchCode, date) {
    const slotTemplates = await prisma.slotTemplate.findMany({
        where: { branchCode },
    });

    const availabilityPromises = slotTemplates.map((template) =>
        checkAvailability(branchCode, date, template.timeSlot)
    );

    const availabilities = await Promise.all(availabilityPromises);

    return slotTemplates.map((template, index) => ({
        ...template,
        ...availabilities[index],
    }));
}
