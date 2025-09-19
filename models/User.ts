
import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  // ... your schema fields are correct
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["agent", "admin"], default: "agent" },
  referralCode: {
    type: String,
    unique: true,
    required: function() {
      return (this as any).role === 'agent';
    },
    sparse: true, 
  },
}, { timestamps: true });

// And change this line:
// const User = models.User || mongoose.model("User", UserSchema);

// To this:
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;