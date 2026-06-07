"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutModal({
    open,
    onClose,
}) {
    const router = useRouter();

    const [seconds, setSeconds] =
        useState(10);

    useEffect(() => {
        if (!open) return;

        setSeconds(10);

        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    handleLogout();
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () =>
            clearInterval(timer);
    }, [open]);

    const handleLogout = async () => {
        localStorage.removeItem(
            "token"
        );

        await fetch(
            "/api/logout",
            {
                method: "POST",
            }
        );

        router.push("/");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-6 rounded-xl w-[400px]">

                <h2 className="text-xl font-bold mb-4">
                    Logout Confirmation
                </h2>

                <p className="mb-4">
                    You will be logged out in{" "}
                    <span className="font-bold text-red-600">
                        {seconds}
                    </span>{" "}
                    seconds.
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                        Logout Now
                    </button>

                </div>

            </div>

        </div>
    );
}