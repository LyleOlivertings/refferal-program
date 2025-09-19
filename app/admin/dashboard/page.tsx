"use client";
import { useEffect, useState } from "react";
// Example of a modern UI component you would build
// import { ReferralTable } from "@/components/ReferralTable";
// import { motion } from "framer-motion";

interface Referral {
  _id: string;
  name: string;
  contact: string;
  address: string;
  lineSpeed: number;
  referredBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await fetch("/api/referrals");
        const data = await res.json();
        setReferrals(data);
      } catch (error) {
        console.error("Failed to fetch referrals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* Here you would render your ReferralTable component */}
      {/* <ReferralTable data={referrals} /> */}
      <pre>{JSON.stringify(referrals, null, 2)}</pre>
    </div>
    // </motion.div>
  );
}