import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpiryValid = user.verifyCodeExpiry > new Date();

    if (isCodeValid && isCodeExpiryValid) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 },
      );
    } else if (!isCodeExpiryValid) {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired, please sign up again to get a new code.",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.log("Error verifying user: ", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying user",
      },
      { status: 500 },
    );
  }
}
