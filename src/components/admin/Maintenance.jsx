"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Maintenance() {
  const [formData, setFormData] =
    useState({
      ownerName: "",
      roomNo: "",
      squareFoot: "",
      maintenanceRate: 1.5,
      month: "",
      year: new Date().getFullYear(),
      paidAmount: "",
    });

  const [loading, setLoading] =
    useState(false);

  const monthlyMaintenance =
    Number(formData.squareFoot || 0) *
    Number(formData.maintenanceRate);

  const remainingAmount =
    monthlyMaintenance -
    Number(formData.paidAmount || 0);

  const paymentStatus =
    remainingAmount <= 0
      ? "Paid"
      : Number(formData.paidAmount) > 0
        ? "Partial"
        : "Pending";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "/api/maintenance",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...formData,
            monthlyMaintenance,
            remainingAmount,
            paymentStatus,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        toast.success(
          "Maintenance Saved Successfully"
        );

        setFormData({
          ownerName: "",
          roomNo: "",
          squareFoot: "",
          maintenanceRate: 1.5,
          month: "",
          year:
            new Date().getFullYear(),
          paidAmount: "",
        });
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
    <div className="max-w-7xl mx-auto">

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Maintenance Management
        </h1>

        <p className="text-gray-500">
          Manage monthly maintenance
          records and payments.
        </p>

      </div>

      <div className="bg-white rounded-3xl shadow-lg border p-8">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          {/* Owner Name */}

          <div>
            <label className="block mb-2 font-medium">
              Owner Name
            </label>

            <input
              type="text"
              name="ownerName"
              value={
                formData.ownerName
              }
              onChange={
                handleChange
              }
              placeholder="Enter Owner Name"
              className="w-full h-12 border rounded-xl px-4"
              required
            />
          </div>

          {/* Room No */}

          <div>
            <label className="block mb-2 font-medium">
              Room Number
            </label>

            <input
              type="text"
              name="roomNo"
              value={
                formData.roomNo
              }
              onChange={
                handleChange
              }
              placeholder="101"
              className="w-full h-12 border rounded-xl px-4"
              required
            />
          </div>

          {/* Square Foot */}

          <div>
            <label className="block mb-2 font-medium">
              Square Foot
            </label>

            <input
              type="number"
              name="squareFoot"
              value={
                formData.squareFoot
              }
              onChange={
                handleChange
              }
              placeholder="600"
              className="w-full h-12 border rounded-xl px-4"
              required
            />
          </div>

          {/* Rate */}

          <div>
            <label className="block mb-2 font-medium">
              Maintenance Rate
            </label>

            <input
              type="number"
              name="maintenanceRate"
              value={
                formData.maintenanceRate
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
            />
          </div>

          {/* Month */}

          <div>
            <label className="block mb-2 font-medium">
              Month
            </label>

            <select
              name="month"
              value={
                formData.month
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
              required
            >
              <option value="">
                Select Month
              </option>

              <option>
                January
              </option>

              <option>
                February
              </option>

              <option>
                March
              </option>

              <option>
                April
              </option>

              <option>
                May
              </option>

              <option>
                June
              </option>

              <option>
                July
              </option>

              <option>
                August
              </option>

              <option>
                September
              </option>

              <option>
                October
              </option>

              <option>
                November
              </option>

              <option>
                December
              </option>
            </select>
          </div>

          {/* Year */}

          <div>
            <label className="block mb-2 font-medium">
              Year
            </label>

            <input
              type="number"
              name="year"
              value={
                formData.year
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
            />
          </div>

          {/* Monthly Maintenance */}

          <div>
            <label className="block mb-2 font-medium">
              Monthly Maintenance
            </label>

            <input
              type="text"
              readOnly
              value={`₹ ${monthlyMaintenance}`}
              className="w-full h-12 bg-green-50 border rounded-xl px-4 font-semibold text-green-700"
            />
          </div>

          {/* Paid Amount */}

          <div>
            <label className="block mb-2 font-medium">
              Paid Amount
            </label>

            <input
              type="number"
              name="paidAmount"
              value={
                formData.paidAmount
              }
              onChange={
                handleChange
              }
              placeholder="Enter Paid Amount"
              className="w-full h-12 border rounded-xl px-4"
            />
          </div>

          {/* Remaining */}

          <div>
            <label className="block mb-2 font-medium">
              Remaining Amount
            </label>

            <input
              type="text"
              readOnly
              value={`₹ ${remainingAmount}`}
              className="w-full h-12 bg-red-50 border rounded-xl px-4 font-semibold text-red-600"
            />
          </div>

          {/* Status */}

          <div>
            <label className="block mb-2 font-medium">
              Payment Status
            </label>

            <input
              type="text"
              readOnly
              value={paymentStatus}
              className={`w-full h-12 border rounded-xl px-4 font-semibold ${paymentStatus ===
                  "Paid"
                  ? "text-green-600"
                  : paymentStatus ===
                    "Partial"
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
            />
          </div>

          {/* Save */}

          <div className="md:col-span-2">

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
                ? "Saving..."
                : "Save Maintenance"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}