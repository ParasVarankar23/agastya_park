    "use client";

    import React, { useEffect, useState } from "react";
    import {
        FiUser,
        FiMail,
        FiShield,
        FiCalendar,
        FiEdit,
        FiLock,
    } from "react-icons/fi";

    export default function Profile() {
        const [profile, setProfile] =
            useState(null);

        useEffect(() => {
            fetchProfile();
        }, []);

        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    "/api/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                if (data.success) {
                    setProfile(data.user);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (!profile) {
            return (
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            );
        }

        return (
            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-800">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your account settings
                    </p>

                </div>

                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Profile Card */}

                    <div className="bg-white rounded-3xl shadow-lg border p-8">

                        <div className="flex flex-col items-center">

                            <div
                                className="
                    w-28
                    h-28
                    rounded-full
                    bg-green-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-4xl
                    font-bold
                "
                            >
                                {profile.name?.charAt(0)}
                            </div>

                            <h2 className="text-2xl font-bold mt-4">
                                {profile.name}
                            </h2>

                            <p className="text-gray-500">
                                Administrator
                            </p>

                        </div>

                        <div className="mt-8 space-y-4">

                            <button
                                className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    h-12
                    rounded-xl
                    bg-green-600
                    text-white
                    hover:bg-green-700
                "
                            >
                                <FiEdit />
                                Edit Profile
                            </button>

                            <button
                                onClick={() =>
                                    window.location.href =
                                    "/admin/change-password"
                                }
                                className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    h-12
                    rounded-xl
                    border
                    hover:bg-gray-50
                "
                            >
                                <FiLock />
                                Change Password
                            </button>

                        </div>

                    </div>

                    {/* Details */}

                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border p-8">

                        <h2 className="text-2xl font-bold mb-8">
                            Account Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div className="border rounded-2xl p-5">

                                <div className="flex items-center gap-3 mb-3">

                                    <FiUser
                                        size={20}
                                        className="text-green-600"
                                    />

                                    <h3 className="font-semibold">
                                        Full Name
                                    </h3>

                                </div>

                                <p className="text-gray-700">
                                    {profile.name}
                                </p>

                            </div>

                            <div className="border rounded-2xl p-5">

                                <div className="flex items-center gap-3 mb-3">

                                    <FiMail
                                        size={20}
                                        className="text-green-600"
                                    />

                                    <h3 className="font-semibold">
                                        Email Address
                                    </h3>

                                </div>

                                <p className="text-gray-700">
                                    {profile.email}
                                </p>

                            </div>

                            <div className="border rounded-2xl p-5">

                                <div className="flex items-center gap-3 mb-3">

                                    <FiShield
                                        size={20}
                                        className="text-green-600"
                                    />

                                    <h3 className="font-semibold">
                                        Role
                                    </h3>

                                </div>

                                <p className="text-gray-700">
                                    Administrator
                                </p>

                            </div>

                            <div className="border rounded-2xl p-5">

                                <div className="flex items-center gap-3 mb-3">

                                    <FiCalendar
                                        size={20}
                                        className="text-green-600"
                                    />

                                    <h3 className="font-semibold">
                                        Account Created
                                    </h3>

                                </div>

                                <p className="text-gray-700">
                                    {new Date(
                                        profile.createdAt
                                    ).toLocaleDateString()}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        );
    }