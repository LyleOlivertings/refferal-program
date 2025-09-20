"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

type Referral = {
  _id: string;
  name: string;
  contact: string;
  address: string;
  lineSpeed: number;
  status: 'Pending' | 'Subscribed' | 'Cancelled';
  createdAt: string;
};

// Helper to get color and icon for status badges
const getStatusProps = (status: Referral['status']) => {
  switch (status) {
    case 'Subscribed':
      return { icon: FiCheckCircle, color: 'bg-green-100 text-green-800' };
    case 'Cancelled':
      return { icon: FiXCircle, color: 'bg-red-100 text-red-800' };
    default:
      return { icon: FiClock, color: 'bg-yellow-100 text-yellow-800' };
  }
};

export default function AgentReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await fetch("/api/agent/referrals");
        const data = await res.json();
        setReferrals(data);
      } catch (error) {
        console.error("Failed to fetch referrals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">My Referrals</h1>
        <p className="mt-1 text-gray-600">Track the status of all your submitted referrals.</p>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-hidden rounded-xl bg-white shadow-md"
      >
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <FiLoader className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {referrals.map((ref) => {
                  const Status = getStatusProps(ref.status);
                  return (
                    <motion.tr key={ref._id} variants={itemVariants}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{ref.name}</div>
                        <div className="text-sm text-gray-500">{ref.contact}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${Status.color}`}>
                          <Status.icon />
                          {ref.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ref.lineSpeed} Mbps</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}