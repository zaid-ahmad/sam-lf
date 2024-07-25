"use client";
import NewLeadEmail from "@/emails/NewLeadEmail";
import { render } from "@react-email/components";

export function renderNewLeadEmail({
    customerName,
    customerPhone,
    customerAddress,
    customerQuadrant,
}) {
    return render(
        NewLeadEmail({
            customerName,
            customerPhone,
            customerAddress,
            customerQuadrant,
        })
    );
}
