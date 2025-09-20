import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectMongoDB from "@/lib/mongodb";
import Referral from "@/models/Referral";

// PATCH handler to update the status of a specific referral
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Await the request body first
    const { status } = await request.json();
    const { id } = params;

    if (!status || !['Pending', 'Subscribed', 'Cancelled'].includes(status)) {
      return NextResponse.json({ message: "Invalid status provided." }, { status: 400 });
    }

    await connectMongoDB();

    const updatedReferral = await Referral.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedReferral) {
      return NextResponse.json({ message: "Referral not found." }, { status: 404 });
    }

    return NextResponse.json(updatedReferral, { status: 200 });

  } catch (error) {
    console.error("PATCH Referral API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
