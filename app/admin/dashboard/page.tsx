"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiUsers, FiFileText, FiLoader } from "react-icons/fi";

// Define the types for our data
interface Referral {
  _id: string;
  name: string;
  contact: string;
  lineSpeed: number;
  referredBy: { name: string };
  createdAt: string;
}

interface SummaryStats {
  agentCount: number;
  referralCount: number;
}

// A simple utility to get a greeting based on the time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<SummaryStats>({ agentCount: 0, referralCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both sets of data in parallel for speed
        const [referralsRes, summaryRes] = await Promise.all([
          fetch("/api/referrals"),
          fetch("/api/admin/summary"),
        ]);
        
        const referralsData = await referralsRes.json();
        const summaryData = await summaryRes.json();

        setReferrals(referralsData);
        setStats(summaryData);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">{getGreeting()}, {session?.user?.name}!</h1>
        <p className="mt-1 text-gray-600">Here's a summary of your program's activity.</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <motion.div variants={itemVariants} className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-blue-100 p-3">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Agents</h3>
              <p className="mt-1 text-4xl font-bold">{stats.agentCount}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
           <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3">
              <FiFileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Referrals</h3>
              <p className="mt-1 text-4xl font-bold">{stats.referralCount}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Referrals List */}
      <motion.div variants={itemVariants} className="rounded-xl bg-white p-6 shadow-md">
        <h3 className="text-xl font-semibold">Recent Referrals</h3>
        <div className="mt-4">
          {referrals.length > 0 ? (
            <ul className="space-y-4">
              {referrals.slice(0, 5).map((ref) => ( // Show top 5
                <li key={ref._id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-semibold">{ref.name}</p>
                    <p className="text-sm text-gray-500">Referred by {ref.referredBy?.name || "N/A"}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{ref.lineSpeed} Mbps</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-gray-500">No recent referrals to display.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}