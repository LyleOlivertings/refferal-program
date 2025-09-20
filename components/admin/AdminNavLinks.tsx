"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiUsers, FiSettings, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";

// Define your navigation links here
const navLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: FiGrid },
  // ADD THIS NEW LINK
  { name: "Manage Referrals", href: "/admin/referrals", icon: FiFileText },
  { name: "Agents", href: "/admin/agents", icon: FiUsers },
  { name: "Settings", href: "/admin/settings", icon: FiSettings },
];

export function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link key={link.name} href={link.href}>
            <motion.div
              whileHover={{ backgroundColor: "#374151" }} // gray-700
              className={`flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}