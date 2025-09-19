import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectMongoDB from "../lib/mongodb";
import User from "../models/User";

// IMPORTANT: Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const seedDatabase = async () => {
  console.log("Attempting to connect to the database...");
  await connectMongoDB();
  console.log("Database connected. Starting to seed data...");

  try {
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "strongAdminPassword123", // Use a strong, unique password
        role: "admin",
      },
      {
        name: "Agent One",
        email: "agent1@example.com",
        password: "strongAgentPassword123", // Use a strong, unique password
        role: "agent",
      },
    ];

    for (const userData of users) {
      const userExists = await User.findOne({ email: userData.email });

      if (userExists) {
        console.log(`User with email ${userData.email} already exists. Skipping.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const referralCode =
        userData.role === "agent" ? crypto.randomBytes(4).toString("hex") : null;

      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        referralCode: referralCode,
      });

      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    }

    console.log("\nDatabase seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    console.log("Closing database connection.");
    await mongoose.disconnect();
  }
};

seedDatabase();