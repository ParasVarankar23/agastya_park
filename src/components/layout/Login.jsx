"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

try {
  const response = await fetch(
    "/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    localStorage.setItem(
      "token",
      data.token
    );

    toast.success(
      "Login Successful 🎉"
    );

    setTimeout(() => {
      router.push("/admin");
    }, 1000);
  } else {
    toast.error(
      data.message ||
        "Invalid Credentials"
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

  return (<div className="min-h-screen flex">

        {/* LEFT SIDE */}

    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-green-900 via-green-700 to-emerald-500 text-white relative overflow-hidden">

      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full"></div>

      <div className="absolute bottom-10 right-10 w-56 h-56 bg-white/10 rounded-full"></div>

      <div className="relative z-10 flex flex-col justify-center px-16">

        <h1 className="text-6xl font-black mb-4">
          Agastya Park
        </h1>

        <p className="text-2xl text-green-100 mb-6">
          Devad, Panvel
        </p>

        <h2 className="text-3xl font-bold mb-6">
          Maintenance Management System
        </h2>

        <p className="text-lg leading-8 text-green-50">
          Smart Society Management Platform
          for Owner Management,
          Maintenance Tracking,
          Payment Records and Reports.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-10">

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl">
            <h3 className="text-3xl font-bold">
              38
            </h3>
            <p>Total Rooms</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl">
            <h3 className="text-3xl font-bold">
              4
            </h3>
            <p>Floors</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl">
            <h3 className="text-3xl font-bold">
              ₹1.5
            </h3>
            <p>Per Sq.Ft</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl">
            <h3 className="text-3xl font-bold">
              2026
            </h3>
            <p>Management</p>
          </div>

        </div>

        <div className="mt-12 text-sm text-green-100">
          © {new Date().getFullYear()}
          {" "}
          Agastya Park Devad Panvel
          <br />
          Created By Paras Varankar
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-10">

        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">

            <span className="text-4xl">
              🏢
            </span>

          </div>

          <h2 className="text-4xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-gray-500 mt-3">
            Login to continue
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />

          </div>

          <div>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-3 text-sm text-green-600 font-medium"
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>

          <div className="flex justify-end">

            <a
              href="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </a>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-gradient-to-r
            from-green-600
            to-emerald-500
            hover:scale-[1.02]
            transition
            shadow-lg
          "
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>

  </div>

);
}
