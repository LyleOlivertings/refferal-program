import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();

    // Ensure the user is logged in
    // @ts-ignore
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Find the logged-in user in the database using their session ID
    // @ts-ignore
    const agent = await User.findById(session.user.id).select(
      "name email referralCode" // Select only the fields we need
    );

    if (!agent) {
      return NextResponse.json({ message: "Agent not found." }, { status: 404 });
    }

    // Return the agent's data
    return NextResponse.json(agent, { status: 200 });
    
  } catch (error) {
    console.error("Agent API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}