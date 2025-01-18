import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json(
        {
          success: "false",
          message: "User not founda",
        },
        { status: 404 },
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: "false",
          message: "User is not accepting Messages",
        },
        { status: 403 },
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }, // 201 code is too show that new resource has been created.
    );
  } catch (error) {
    console.error("Error adding Message:", error);
    return Response.json(
      { message: "Internal server error:", success: false },
      { status: 500 },
    );
  }
}
