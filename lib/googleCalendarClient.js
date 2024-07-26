import { google } from "googleapis";
import path from "path";

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "calendar-credentials.json"),
    scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth });

export { calendar };
