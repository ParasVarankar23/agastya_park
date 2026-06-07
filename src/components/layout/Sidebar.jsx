"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname =
    usePathname();

  const [open, setOpen] =
    useState(false);

  const menus = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
    },
    {
      name: "Owners",
      icon: "🏠",
      path: "/admin/owners",
    },
    {
      name: "Maintenance",
      icon: "🧾",
      path: "/admin/maintenance",
    },
    {
      name: "Profile",
      icon: "👤",
      path: "/admin/profile",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}

      <button
        onClick={() =>
          setOpen(true)
        }
        className="fixed top-2 left-4 z-50 md:hidden bg-green-600 text-white p-3 rounded-xl shadow-lg"
      >
        ☰
      </button>

      {/* Overlay */}

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-screen
          w-72
          bg-white
          border-r
          z-50
          transition-transform
          duration-300

          ${open
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        <div className="h-20 md:left-50 left-100 border-b flex items-center px-6">

          <div>

            <h1 className="text-2xl font-bold text-green-700">
              Agastya Park
            </h1>

            <p className="text-sm text-gray-500">
              Devad, Panvel
            </p>

          </div>

        </div>

        <nav className="p-4">

          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() =>
                setOpen(false)
              }
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                mb-2
                transition

                ${pathname === menu.path
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >

              <span className="text-lg">
                {menu.icon}
              </span>

              <span>
                {menu.name}
              </span>

            </Link>
          ))}

        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">

          <div className="bg-green-50 rounded-xl p-4">

            <p className="font-semibold text-green-700">
              Agastya Park
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Maintenance Management System
            </p>

          </div>

        </div>

      </aside>
    </>
  );
}