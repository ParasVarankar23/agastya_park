"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
    FiLock,
    FiEye,
    FiEyeOff,
    FiShield,
} from "react-icons/fi";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showOld, setShowOld] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            newPassword !== confirmPassword
        ) {
            return toast.error(
                "Passwords do not match"
            );
        }

        setLoading(true);

        try {
            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "/api/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        oldPassword,
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

                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(
                    data.message
                );
            }
        } catch (error) {
            toast.error(
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Change Password
                </h1>

                <p className="text-gray-500 mt-2">
                    Update your account password
                </p>

            </div>

            <div className="bg-white rounded-3xl border shadow-lg p-8">

                {/* Icon */}

                <div className="flex justify-center mb-8">

                    <div
                        className="
              w-20
              h-20
              rounded-3xl
              bg-green-100
              flex
              items-center
              justify-center
            "
                    >
                        <FiShield
                            size={40}
                            className="text-green-600"
                        />
                    </div>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Old Password */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Old Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showOld
                                        ? "text"
                                        : "password"
                                }
                                value={oldPassword}
                                onChange={(e) =>
                                    setOldPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter Old Password"
                                className="
                  w-full
                  h-12
                  border
                  rounded-xl
                  pl-12
                  pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
                                required
                            />

                            <FiLock
                                className="
                  absolute
                  left-4
                  top-4
                  text-gray-400
                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowOld(
                                        !showOld
                                    )
                                }
                                className="
                  absolute
                  right-4
                  top-4
                "
                            >
                                {showOld ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* New Password */}

                    <div>

                        <label className="block mb-2 font-medium">
                            New Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showNew
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter New Password"
                                className="
                  w-full
                  h-12
                  border
                  rounded-xl
                  pl-12
                  pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
                                required
                            />

                            <FiLock
                                className="
                  absolute
                  left-4
                  top-4
                  text-gray-400
                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNew(
                                        !showNew
                                    )
                                }
                                className="
                  absolute
                  right-4
                  top-4
                "
                            >
                                {showNew ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <input
                                type={
                                    showConfirm
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm New Password"
                                className="
                  w-full
                  h-12
                  border
                  rounded-xl
                  pl-12
                  pr-12
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
                                required
                            />

                            <FiLock
                                className="
                  absolute
                  left-4
                  top-4
                  text-gray-400
                "
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirm(
                                        !showConfirm
                                    )
                                }
                                className="
                  absolute
                  right-4
                  top-4
                "
                            >
                                {showConfirm ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full
              h-12
              rounded-xl
              bg-green-600
              hover:bg-green-700
              text-white
              font-semibold
              transition
            "
                    >
                        {loading
                            ? "Updating Password..."
                            : "Update Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}