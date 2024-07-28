import { z } from "zod";

export const appointmentSchemaForm = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    primaryPhone: z
        .string()
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
    secondaryPhone: z
        .string()
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format")
        .optional()
        .or(z.literal("")),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters"),
    quadrant: z.enum(["NW", "NE", "SW", "SE"]).or(z.literal("")),
    postalCode: z.string().optional(),
    addressNotes: z.string().optional().or(z.literal("")),
    appointmentDateTime: z
        .string()
        .min(1, "Please select an appointment date and time"),
    homeownerType: z.enum(["MR_SHO", "MRS_SHO", "BOTH_ATTEND", "ONE_LEG"]),
    age: z.string({
        required_error: "Please select an age range",
    }),
    concerns: z.array(z.string()).refine((value) => value.length > 0, {
        message: "You have to select at least one item.",
    }),
    surroundings: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    serviceNeeds: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    images: z
        .array(z.instanceof(File))
        .max(4, "Maximum 4 images allowed")
        .optional()
        .default([]),
});

export const appointmentSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    primaryPhone: z
        .string()
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format"),
    secondaryPhone: z
        .string()
        .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid phone number format")
        .optional()
        .or(z.literal("")),
    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters"),
    quadrant: z.enum(["NW", "NE", "SW", "SE"]).or(z.literal("")),
    postalCode: z.string().optional(),
    addressNotes: z.string().optional().or(z.literal("")),
    appointmentDateTime: z
        .string()
        .min(1, "Please select an appointment date and time"),
    homeownerType: z.enum(["MR_SHO", "MRS_SHO", "BOTH_ATTEND", "ONE_LEG"]),
    age: z.string({
        required_error: "Please select an age range",
    }),
    concerns: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    surroundings: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    serviceNeeds: z
        .array(z.string())
        .refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    images: z
        .array(z.string())
        .max(4, "Maximum 4 images allowed")
        .optional()
        .default([]),
});

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
});

export const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." }),
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters." }),
    branchCode: z
        .string()
        .length(4, { message: "Branch code must be 4 characters." })
        .toUpperCase(),
    role: z.enum(["CANVASSER", "SALES_REP"], {
        required_error: "Please select a role.",
    }),
});
