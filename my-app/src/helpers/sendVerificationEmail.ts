import { Resend } from 'resend'
import VerificationEmail from "../../email/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<any> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return { success: true, message: "verification email send successfuly" }
    } catch (emailError) {
        console.log("email error :: ", emailError);
        return { success: false, message: "failed to send verification email" }
    }
}