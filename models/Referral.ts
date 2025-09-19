

// To this:
import mongoose, { Schema, Model } from "mongoose";

const ReferralSchema = new Schema({
  // ... your schema fields are correct
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  lineSpeed: { type: Number, required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });



// To this:
const Referral = mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);

export default Referral;