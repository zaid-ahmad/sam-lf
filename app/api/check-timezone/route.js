import { NextResponse } from "next/server";

export async function GET() {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return NextResponse.json({ time: now.toISOString(), timezone });
}
