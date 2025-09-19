import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // <-- 1. Import the new 'auth' function
import connectMongoDB from "@/lib/mongodb";
import Referral from "@/models/Referral";

export async function GET(request: Request) {
  try {
    // 2. Use the new auth() function to get the session
    const session = await auth(); 

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const referrals = await Referral.find({})
      .populate({
        path: "referredBy",
        select: "name email", 
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(referrals, { status: 200 });
  } catch (error) {
    // A specific check for auth-related errors can be useful
    if ((error as any).type === 'CredentialsSignin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.error("Referrals API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}