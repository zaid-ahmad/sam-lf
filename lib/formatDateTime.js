import { parse } from "date-fns";

export default function parseAppointmentDateTime(dateTimeString) {
    // Format as ISO string
    return parse(dateTimeString, "MMMM do, yyyy 'at' h:mm aa", new Date());
}
