import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function extractFirstName(email) {
    // Split the email address at the @ symbol
    const [localPart] = email.split("@");

    // Split the local part by dots and take the first part
    const [firstName] = localPart.split(".");

    // Capitalize the first letter and make the rest lowercase
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export function displayTodaysDate() {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return today.toLocaleDateString("en-US", options);
}

export function getTodayAndTomorrow() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return { today, tomorrow };
}

export const computeSHA256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
};

export function formatPhoneNumber(phoneNumber) {
    // Remove all non-numeric characters except the plus sign
    const cleaned = phoneNumber.replace(/[^\d]/g, "");

    // Add the country code prefix
    const formatted = `+1${cleaned}`;

    return formatted;
}
