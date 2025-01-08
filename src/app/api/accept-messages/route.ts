import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  dbConnect();
  const session = await getServerSession(authOptions);
  //TODO: Add type for session
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }
  // Because we converted the userId into string therefore we have to convert the type into
  const userID = user._id;
  const acceptingMessage = request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      { isAcceptingMessage: acceptingMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found to update message acceptance status",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance message status updated successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: true,
        message: `Error updating message acceptance status ${error}`,
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  dbConnect();
  const session = await getServerSession(authOptions);
  //TODO: Add type for session
  const user = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found to fetch message acceptance status",
        },
        { status: 404 },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: true,
        message: `Error fetcing message acceptance status ${error}`,
      },
      { status: 500 },
    );
  }
}
