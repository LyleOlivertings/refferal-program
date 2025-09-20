import mongoose, { Schema, Model } from "mongoose";

const ReferralSchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  lineSpeed: { type: Number, required: true },
  referredBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  // ADD THIS NEW FIELD
  status: {
    type: String,
    enum: ['Pending', 'Subscribed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

const Referral = mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);

export default Referral;