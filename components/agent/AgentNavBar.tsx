"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";

export function AgentNavbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: "auto" },
  };
  
  const dropdownVariants = {
    closed: { opacity: 0, scale: 0.95, y: -10 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Links */}
          <div className="flex items-center space-x-8">
            <Link href="/agent/dashboard" className="text-xl font-bold text-indigo-600">
              Agent Portal
            </Link>
            <div className="hidden md:flex md:space-x-6">
              <Link href="/agent/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link href="/agent/referrals" className="text-sm font-medium text-gray-700 hover:text-indigo-600">My Referrals</Link>
            </div>
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 rounded-full p-2 text-sm text-gray-700 hover:bg-gray-100">
                <FiUser className="h-5 w-5" />
                <span>{session?.user?.name || "Agent"}</span>
                <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={dropdownVariants}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                  >
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <FiLogOut />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-500">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Animated) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link href="/agent/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">Dashboard</Link>
              <Link href="/agent/referrals" className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">My Referrals</Link>
              <div className="border-t border-gray-200 pt-4">
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex w-full items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}