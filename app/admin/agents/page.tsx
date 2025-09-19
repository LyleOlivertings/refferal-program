"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiLoader, FiUsers, FiFileText } from "react-icons/fi";
import { CreateAgentModal } from "@/components/admin/CreateAgentModal";

type Agent = {
  _id: string;
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
  createdAt: string;
};

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/agents");
      const data = await res.json();
      setAgents(data);
    } catch (error) {
      console.error("Failed to fetch agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <CreateAgentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAgentCreated={fetchAgents} // Refresh the list after creation
      />
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Management</h1>
            <p className="mt-1 text-gray-600">View, create, and manage your agent profiles.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md"
          >
            <FiUserPlus />
            <span>Create Agent</span>
          </motion.button>
        </header>

        {loading ? (
          <div className="flex justify-center py-12">
            <FiLoader className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {agents.map((agent) => (
              <motion.div
                key={agent._id}
                variants={itemVariants}
                className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-bold">{agent.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{agent.email}</p>
                <p className="mt-2 text-sm text-gray-500">Referral Code: <span className="font-mono text-gray-800">{agent.referralCode}</span></p>
                <div className="mt-4 flex items-center justify-start space-x-4 border-t pt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiFileText />
                    <span>{agent.referralCount} Referrals</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}