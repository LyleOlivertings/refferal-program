import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Count agents by filtering users with the 'agent' role
    const agentCount = await User.countDocuments({ role: 'agent' });

    // Count all referrals
    const referralCount = await Referral.countDocuments();

    return NextResponse.json({
      agentCount,
      referralCount,
    });
    
  } catch (error) {
    console.error("Admin Summary API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}