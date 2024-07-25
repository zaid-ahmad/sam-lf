import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export default resend;
