"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const sendOTP = async (e) => {
    e.preventDefault();

    
setLoading(true);

try {
  const response = await fetch(
    "/api/forgot-password/send-otp",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    toast.success(
      "OTP Sent Successfully"
    );

    setStep(2);
  } else {
    toast.error(data.message);
  }
} catch (error) {
  toast.error(
    "Something went wrong"
  );
} finally {
  setLoading(false);
}


  };

  const verifyOTP = async (e) => {
    e.preventDefault();

    
setLoading(true);

try {
  const response = await fetch(
    "/api/forgot-password/verify-otp",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    toast.success(
      "OTP Verified"
    );

    setStep(3);
  } else {
    toast.error(data.message);
  }
} catch {
  toast.error(
    "Something went wrong"
  );
} finally {
  setLoading(false);
}


  };

  const resetPassword = async (e) => {
    e.preventDefault();

    
setLoading(true);

try {
  const response = await fetch(
    "/api/forgot-password/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
        confirmPassword,
      }),
    }
  );

  const data =
    await response.json();

  if (data.success) {
    toast.success(
      "Password Updated Successfully"
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } else {
    toast.error(data.message);
  }
} catch {
  toast.error(
    "Something went wrong"
  );
} finally {
  setLoading(false);
}


  };

  return (<div className="min-h-screen bg-slate-50 flex">

    
    {/* LEFT SIDE */}

    <div className="hidden lg:flex w-1/2 bg-green-700 text-white relative overflow-hidden">

      <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full -translate-x-40 -translate-y-40"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-40 translate-y-40"></div>

      <div className="relative z-10 flex flex-col justify-center px-16">

        <h1 className="text-6xl font-black">
          Agastya Park
        </h1>

        <p className="text-xl mt-3 text-green-100">
          Devad, Panvel
        </p>

        <h2 className="text-4xl font-bold mt-10">
          Secure Password Recovery
        </h2>

        <p className="mt-6 text-lg text-green-100 leading-8">
          Recover your administrator
          account securely using
          email verification and OTP.
        </p>

        <div className="grid grid-cols-2 gap-5 mt-12">

          <div className="bg-white/10 rounded-2xl p-5">
            <h3 className="text-4xl font-bold">
              38
            </h3>
            <p>Total Rooms</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5">
            <h3 className="text-4xl font-bold">
              4
            </h3>
            <p>Floors</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5">
            <h3 className="text-4xl font-bold">
              OTP
            </h3>
            <p>Verification</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-5">
            <h3 className="text-4xl font-bold">
              100%
            </h3>
            <p>Secure</p>
          </div>

        </div>

        <div className="mt-16 text-sm text-green-100">
          © {new Date().getFullYear()}
          {" "}
          Agastya Park Devad Panvel
          <br />
          Created By Paras Varankar
        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="flex-1 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-10">

        {/* STEP BAR */}

        <div className="flex items-center justify-center mb-10">

          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step >= 1 ? "bg-green-600" : "bg-gray-300"}`}>
            1
          </div>

          <div className={`w-16 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-300"}`} />

          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step >= 2 ? "bg-green-600" : "bg-gray-300"}`}>
            2
          </div>

          <div className={`w-16 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-300"}`} />

          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${step >= 3 ? "bg-green-600" : "bg-gray-300"}`}>
            3
          </div>

        </div>

        {step === 1 && (
          <form onSubmit={sendOTP}>

            <h2 className="text-3xl font-bold text-center">
              Forgot Password
            </h2>

            <p className="text-center text-slate-500 mt-2 mb-6">
              Enter your email address
            </p>

            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full h-12 px-4 rounded-xl border border-slate-300"
            />

            <button
              type="submit"
              className="w-full h-12 mt-5 rounded-xl bg-green-600 text-white font-semibold"
            >
              {loading
                ? "Sending..."
                : "Send OTP"}
            </button>

          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOTP}>

            <h2 className="text-3xl font-bold text-center">
              Verify OTP
            </h2>

            <p className="text-center text-slate-500 mt-2 mb-6">
              Enter OTP received on email
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              className="w-full h-12 px-4 rounded-xl border border-slate-300"
            />

            <button
              type="submit"
              className="w-full h-12 mt-5 rounded-xl bg-green-600 text-white font-semibold"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword}>

            <h2 className="text-3xl font-bold text-center">
              Reset Password
            </h2>

            <p className="text-center text-slate-500 mt-2 mb-6">
              Create a new password
            </p>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl border border-slate-300 mb-4"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl border border-slate-300"
            />

            <button
              type="submit"
              className="w-full h-12 mt-5 rounded-xl bg-green-600 text-white font-semibold"
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>

          </form>
        )}

      </div>

    </div>

  </div>

);
}
