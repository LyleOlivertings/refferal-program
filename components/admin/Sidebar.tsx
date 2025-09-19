import { AdminNavLinks } from "./AdminNavLinks";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "@/lib/auth"; // We will use a server-side sign out

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-gray-800 text-white lg:flex">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">YourApp</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AdminNavLinks />
      </div>
      <div className="border-t border-gray-700 p-4">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white">
            <FiLogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  );
}