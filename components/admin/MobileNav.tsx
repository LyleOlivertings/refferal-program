"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { AdminNavLinks } from "./AdminNavLinks";
import { signOut } from "next-auth/react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="lg:hidden">
        <FiMenu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r bg-gray-800 text-white"
          >
            <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
              <h1 className="text-xl font-bold">YourApp</h1>
              <button onClick={() => setIsOpen(false)}>
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AdminNavLinks />
            </div>
            <div className="border-t border-gray-700 p-4">
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <FiLogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
