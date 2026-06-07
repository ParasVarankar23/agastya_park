"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutModal from "./LogoutModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] =
    useState(false);

  return (
    <>
      <nav className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between">

        <div>
          <h1 className="text-xl font-bold text-green-700">
            Agastya Park
          </h1>
          <p className="text-xs text-gray-500">
            Devad, Panvel
          </p>
        </div>

        <div className="relative">

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-xl transition"
          >

            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
              P
            </div>

            <div className="hidden md:block text-left">
              <p className="font-medium">
                Paras Varankar
              </p>
              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border shadow-xl overflow-hidden z-50">

              <div className="p-4 border-b">
                <p className="font-semibold">
                  Paras Varankar
                </p>
                <p className="text-sm text-gray-500">
                  Administrator
                </p>
              </div>

              <Link
                href="/admin/profile"
                className="block px-4 py-3 hover:bg-gray-50"
              >
                👤 View Profile
              </Link>

              <button
                onClick={() =>
                  setLogoutOpen(true)
                }
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
              >
                🚪 Logout
              </button>

            </div>
          )}

        </div>

      </nav>

      <LogoutModal
        open={logoutOpen}
        onClose={() =>
          setLogoutOpen(false)
        }
      />
    </>
  );
}