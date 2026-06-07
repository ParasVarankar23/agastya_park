"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    
setLoading(true);

try {
  const response = await fetch(
    "/api/signup",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    toast.success(
      "Account Created Successfully 🎉"
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } else {
    toast.error(
      data.message
    );
  }
} catch (error) {
  console.error(error);

  toast.error(
    "Something went wrong"
  );
} finally {
  setLoading(false);
}


  };

  return (<div className="min-h-screen bg-slate-50 flex">

    
    {/* LEFT SECTION */}

    <div className="hidden lg:flex w-1/2 bg-green-700 text-white relative overflow-hidden">

      <div className="absolute top-0 left-0 w-80 h-70 bg-white/10 rounded-full -translate-x-40 -translate-y-30"></div>

      <div className="absolute bottom-0 right-0 w-80 h-70 bg-white/10 rounded-full translate-x-40 translate-y-30"></div>

      <div className="relative z-10 flex flex-col justify-center px-16">

        <div>

          <h1 className="text-6xl font-black tracking-tight">
            Agastya Park
          </h1>

          <p className="text-xl mt-3 text-green-100">
            Devad, Panvel
          </p>

        </div>

        <div className="mt-10">

          <h2 className="text-4xl font-bold leading-tight">
            Society Management
            <br />
            Made Simple
          </h2>

          <p className="mt-6 text-lg text-green-100 leading-8">
            Manage owners, maintenance,
            payments, reports and
            society operations through
            one centralized dashboard.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-5 mt-12">

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">

            <h3 className="text-4xl font-bold">
              38
            </h3>

            <p className="mt-2 text-green-100">
              Total Rooms
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">

            <h3 className="text-4xl font-bold">
              4
            </h3>

            <p className="mt-2 text-green-100">
              Floors
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">

            <h3 className="text-4xl font-bold">
              ₹1.5
            </h3>

            <p className="mt-2 text-green-100">
              Per Sq. Ft.
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">

            <h3 className="text-4xl font-bold">
              24/7
            </h3>

            <p className="mt-2 text-green-100">
              Management
            </p>

          </div>

        </div>

      </div>

    </div>

    {/* RIGHT SECTION */}

    <div className="flex-1 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white shadow-2xl rounded-3xl p-10 border border-slate-100">

          <div className="text-center">

            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto">

              <span className="text-4xl">
                👤
              </span>

            </div>

            <h2 className="text-4xl font-bold text-slate-900 mt-6">
              Create Account
            </h2>

            <p className="text-slate-500 mt-2">
              Create your administrator account
            </p>

          </div>

          <form
            onSubmit={handleSignup}
            className="mt-10 space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter Full Name"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter Email Address"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="text-center mt-8">

            <span className="text-slate-500">
              Already have an account?
            </span>

            <a
              href="/login"
              className="ml-2 font-semibold text-green-600 hover:text-green-700"
            >
              Login
            </a>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}
