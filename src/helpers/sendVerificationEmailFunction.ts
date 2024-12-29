import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmailTemplate({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification Eamil sent successfully" };
  } catch (error) {
    console.error("Error sending verification Email: ", error);
    return { success: false, message: "Failed to send verification Email" };
  }
}
