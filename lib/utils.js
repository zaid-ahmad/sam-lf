import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";

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

const branchTimezones = {
    "3CGY": "America/Edmonton",
    "3VAN": "America/Vancouver",
    "3VIL": "America/Vancouver",
    "3EDM": "America/Edmonton",
    "3PEW": "America/Toronto",
    "3HAL": "America/Halifax",
    "3HAM": "America/Toronto",
    "3TOR": "America/Toronto",
    "3MON": "America/Montreal",
    "3OTT": "America/Toronto",
    "3LDN": "America/Toronto",
    "3KEL": "America/Vancouver",
    "3WIN": "America/Winnipeg",
};

export function displayTodaysDate(branchCode) {
    const timezone = branchTimezones[branchCode] || "UTC";
    return moment().tz(timezone).format("MMMM D, YYYY");
}

export function displayTomorrowsDate(branchCode) {
    const timezone = branchTimezones[branchCode] || "UTC";
    return moment().tz(timezone).add(1, "days").format("MMMM D, YYYY");
}

export function getStartEndDateWithOffset(branchCode, date = null) {
    const timezone = branchTimezones[branchCode];

    // Use the provided date or get the current date in the branch's timezone
    let targetDate;
    if (date) {
        // Parse the date string using a specific format
        targetDate = moment(date, "MMMM D, YYYY").tz(timezone);
        if (!targetDate.isValid()) {
            // If parsing fails, fall back to current date
            console.warn(
                `Invalid date format: ${date}. Falling back to current date.`
            );
            targetDate = moment().tz(timezone);
        }
    } else {
        targetDate = moment().tz(timezone);
    }

    // Set the start of day in the branch's timezone
    const startOfDay = targetDate.clone().startOf("day");

    // Set the end of day in the branch's timezone
    const endOfDay = targetDate.clone().endOf("day");

    // Convert to UTC for database query
    const startOfDayUTC = startOfDay.utc().toDate();
    const endOfDayUTC = endOfDay.utc().toDate();

    return {
        startOfDayUTC,
        endOfDayUTC,
        currentDateString: targetDate.format("MMMM Do, YYYY"),
        timezone,
    };
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

export function dirtyToFormattedPhoneNumber(phoneNumber) {
    // Remove any non-digit characters from the phone number
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Check if the number is valid (assuming US format with country code)
    if (cleaned.length !== 11 && cleaned.length !== 10) {
        return "Invalid phone number";
    }

    // Remove the country code if present
    const number = cleaned.length === 11 ? cleaned.slice(1) : cleaned;

    // Format the number
    const areaCode = number.slice(0, 3);
    const firstPart = number.slice(3, 6);
    const secondPart = number.slice(6);

    return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export function getGoogleMapsUrl(address) {
    const encodedAddress = encodeURIComponent(address);
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}
