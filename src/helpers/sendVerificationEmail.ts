import {resend} from "@/lib/resend";
import verificationEmail from '../../emails/verificationEmail';
import { ApiResponse } from "@/types/ApiResponses";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Secret feedback | Verification Code',
            react: verificationEmail({username: username, otp: verifyCode}),
        });
        return {success: true, message: "Verification email send successfully"}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}