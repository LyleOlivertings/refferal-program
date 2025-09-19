"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
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
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session?.user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Your referral dashboard is ready.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Your Unique Referral Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 flex items-center justify-center font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {copied ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <FiClipboard className="w-5 h-5" />
              )}
            </button>
          </div>
          {copied && (
             <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center text-green-600"
              >
                Copied to clipboard!
              </motion.p>
          )}
        </div>
        <p className="text-xs text-center text-gray-500">
          Share this link with potential customers to register them under your name.
        </p>
      </motion.div>
    </div>
  );
}