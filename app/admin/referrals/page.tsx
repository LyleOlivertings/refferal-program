"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiLoader, FiCheckCircle, FiClock, FiXCircle, FiPhone, FiMail } from "react-icons/fi";

type Referral = {
  _id: string;
  name: string;
  contact: string;
  address: string;
  lineSpeed: number;
  status: 'Pending' | 'Subscribed' | 'Cancelled';
  referredBy: { name: string; email: string };
  createdAt: string;
};

// Helper to get color and icon for status badges
const getStatusProps = (status: Referral['status']) => {
  switch (status) {
    case 'Subscribed':
      return { icon: FiCheckCircle, color: 'bg-green-100 text-green-800', ring: 'ring-green-500' };
    case 'Cancelled':
      return { icon: FiXCircle, color: 'bg-red-100 text-red-800', ring: 'ring-red-500' };
    default:
      return { icon: FiClock, color: 'bg-yellow-100 text-yellow-800', ring: 'ring-yellow-500' };
  }
};

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = async () => {
    try {
      const res = await fetch("/api/referrals");
      const data = await res.json();
      setReferrals(data);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Referral['status']) => {
    // Optimistically update the UI
    setReferrals(prev => prev.map(ref => ref._id === id ? { ...ref, status: newStatus } : ref));

    try {
      await fetch(`/api/admin/referrals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert UI on error if needed
      fetchReferrals();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Manage Referrals</h1>
        <p className="mt-1 text-gray-600">Update referral statuses and contact new customers.</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <FiLoader className="animate-spin text-4xl text-indigo-600" />
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {referrals.map((ref) => {
            const Status = getStatusProps(ref.status);
            return (
              <motion.div key={ref._id} variants={itemVariants} className={`rounded-xl bg-white p-5 shadow-md ring-2 ring-transparent transition-all hover:shadow-lg hover:ring-indigo-500`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">{ref.name}</p>
                    <p className="text-sm text-gray-600">{ref.address}</p>
                    <p className="mt-1 text-xs text-gray-500">Referred by: {ref.referredBy?.name || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Contact Buttons */}
                    <a href={`tel:${ref.contact}`} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600">
                      <FiPhone size={20} />
                    </a>
                    <a href={`mailto:${ref.contact}`} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600">
                      <FiMail size={20} />
                    </a>
                    
                    {/* Status Dropdown */}
                    <select
                      value={ref.status}
                      onChange={(e) => handleStatusChange(ref._id, e.target.value as Referral['status'])}
                      className={`rounded-full border-none text-sm font-medium focus:ring-2 focus:ring-offset-2 ${Status.color} ${Status.ring}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Subscribed">Subscribed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}