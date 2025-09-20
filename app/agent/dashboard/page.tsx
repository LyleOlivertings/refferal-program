"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// Add AnimatePresence to this line
import { motion, AnimatePresence } from "framer-motion";
import { FiClipboard, FiCheck, FiLoader } from "react-icons/fi";

export default function AgentDashboard() {
  const { data: session, status } = useSession();
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const fetchAgentData = async () => {
        try {
          const res = await fetch("/api/agent/me");
          const data = await res.json();
          if (data.referralCode) {
            const link = `${window.location.origin}/register/${data.referralCode}`;
            setReferralLink(link);
          }
        } catch (error) {
          console.error("Failed to fetch agent data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAgentData();
    }
  }, [status]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-3xl"
    >
      <div className="space-y-6 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Referral Link
          </h1>
          <p className="mt-2 text-gray-600">
            Share this link to register new customers.
          </p>
        </div>

        <div className="space-y-4">
          <label className="sr-only">Your Unique Referral Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full rounded-md border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleCopy}
              className="flex flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {copied ? (
                <FiCheck className="h-5 w-5" />
              ) : (
                <FiClipboard className="h-5 w-5" />
              )}
            </button>
          </div>
          <AnimatePresence>
            {copied && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-sm text-green-600"
              >
                Copied to clipboard!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}