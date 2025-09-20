import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectMongoDB from "@/lib/mongodb";
import Referral from "@/models/Referral";

export async function GET() {
  try {
    const session = await auth();
    // @ts-ignore
    if (!session || !session.user?.id || session.user?.role !== 'agent') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const referrals = await Referral.find({ 
      // @ts-ignore
      referredBy: session.user.id 
    })
    .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(referrals, { status: 200 });

  } catch (error) {
    console.error("Agent Referrals API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}