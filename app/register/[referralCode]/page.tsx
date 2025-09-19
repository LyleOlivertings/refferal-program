"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function RegisterPage() {
  const { referralCode } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    lineSpeed: "10",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Submitting...");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, referralCode }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  // ... rest of the form JSX
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Sign Up for Internet</h1>
        <p className="text-sm text-gray-600 mb-6">
          Referred by code: {referralCode}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form inputs for name, contact, address, lineSpeed dropdown */}
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}