import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  // In this part we are checking if the user's input for username meets our criteria or not, and after this we will check if the user exists and is verified  in the database or not, if yes, will return the user already exists and if not we will let the user take the username.
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get("username") };

    const result = usernameQuerySchema.safeParse(queryParams);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      console.log("Username is already taken");

      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 400,
        },
      );
    }
    console.log("Username is available");

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error checking username:", error);

    return Response.json(
      {
        success: false,
        message: `Error occured checking usernae ${error}`,
      },
      {
        status: 200,
      },
    );
  }
}
