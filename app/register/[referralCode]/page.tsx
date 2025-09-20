"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifi, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

// Define the available internet packages
const internetPackages = [
  { speed: 5, price: 350, description: "Basic browsing & email" },
  { speed: 10, price: 450, description: "HD streaming for 1-2 devices" },
  { speed: 25, price: 550, description: "Great for families & HD streaming" },
  { speed: 50, price: 650, description: "Superfast for gaming & 4K" },
  { speed: 100, price: 850, description: "For power users & multiple 4K streams" },
];

export default function RegisterPage() {
  const { referralCode } = useParams();
  
  // State for form fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(internetPackages[1].speed); // Default to 10Mbps

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage("");
    setMessageType("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          contact, 
          address, 
          lineSpeed: selectedPackage, 
          referralCode 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "An error occurred.");
      }
      
      setFormMessage(data.message);
      setMessageType("success");

    } catch (error: any) {
      setFormMessage(error.message);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (messageType === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center rounded-xl bg-white p-10 shadow-lg">
          <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold">Registration Complete!</h1>
          <p className="mt-2 text-gray-600">{formMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 py-12 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-3xl"
      >
        <header className="text-center">
          <FiWifi className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            TnT Infrastructure
          </h1>
          <p className="mt-2 text-lg text-gray-600">Internet Packages</p>
          <p className="mt-4 text-sm text-gray-500">
            Referred by code: <span className="font-mono font-semibold text-indigo-600">{referralCode}</span>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8 rounded-xl bg-white p-8 shadow-2xl">
          {/* Package Selection */}
          <fieldset>
            <legend className="text-lg font-semibold">1. Select Your Package</legend>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {internetPackages.map((pkg) => (
                <label key={pkg.speed} className={`relative flex cursor-pointer rounded-lg border-2 p-4 shadow-sm transition-all ${selectedPackage === pkg.speed ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'}`}>
                  <input type="radio" name="package-selection" value={pkg.speed} checked={selectedPackage === pkg.speed} onChange={() => setSelectedPackage(pkg.speed)} className="sr-only" />
                  <div className="flex flex-1 flex-col">
                    <span className="text-xl font-bold">{pkg.speed} Mbps</span>
                    <span className="mt-1 text-sm text-gray-500">{pkg.description}</span>
                    <span className="mt-4 text-2xl font-bold">R{pkg.price}<span className="text-sm font-medium text-gray-500">/mo</span></span>
                  </div>
                  {selectedPackage === pkg.speed && (
                    <div className="absolute right-2 top-2 text-indigo-600">
                      <FiCheckCircle />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Personal Details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">2. Your Details</legend>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} required className="mt-1 w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Installation Address</label>
              <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={3} className="mt-1 w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </fieldset>

          {/* Submission */}
          <div>
            <AnimatePresence>
              {formMessage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`mb-4 flex items-center gap-2 rounded-md p-3 text-sm ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {messageType === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
                  {formMessage}
                </motion.div>
              )}
            </AnimatePresence>
            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
              {isSubmitting ? <FiLoader className="animate-spin" /> : "Submit Application"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}