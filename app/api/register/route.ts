import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import Referral from "@/models/Referral";

export async function POST(request: Request) {
  try {
    const { name, contact, address, lineSpeed, referralCode } = await request.json();

    // Basic validation
    if (!name || !contact || !address || !lineSpeed || !referralCode) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find the agent who owns the referral code
    const referringAgent = await User.findOne({ referralCode: referralCode });

    if (!referringAgent) {
      return NextResponse.json(
        { message: "Invalid referral code." },
        { status: 404 }
      );
    }

    // Create the new referral and link it to the agent's ID
    await Referral.create({
      name,
      contact,
      address,
      lineSpeed,
      referredBy: referringAgent._id, // Linking to the agent
    });

    return NextResponse.json(
      { message: "Registration successful! We will be in contact soon." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}