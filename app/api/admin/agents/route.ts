import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";

// GET handler to fetch all agents and their referral counts
export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    const agents = await User.aggregate([
      // 1. Filter for users who are agents
      { $match: { role: 'agent' } },
      // 2. Join with the referrals collection
      {
        $lookup: {
          from: 'referrals', // The actual name of the collection in MongoDB
          localField: '_id',
          foreignField: 'referredBy',
          as: 'referrals'
        }
      },
      // 3. Create a new field 'referralCount' with the size of the referrals array
      {
        $addFields: {
          referralCount: { $size: '$referrals' }
        }
      },
      // 4. Specify which fields to return (exclude sensitive data like password)
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          referralCode: 1,
          createdAt: 1,
          referralCount: 1
        }
      },
      // 5. Sort by creation date
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json(agents);

  } catch (error) {
    console.error("GET Agents API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST handler to create a new agent
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    await connectMongoDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = crypto.randomBytes(4).toString("hex");

    const newAgent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'agent',
      referralCode,
    });
    
    // Don't send the password back
    const { password: _, ...agentData } = newAgent.toObject();

    return NextResponse.json(agentData, { status: 201 });

  } catch (error) {
    console.error("POST Agent API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}