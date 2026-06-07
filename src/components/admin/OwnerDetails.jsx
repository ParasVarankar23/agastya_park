"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

export default function OwnerDetails() {
  const [formData, setFormData] =
    useState({
      ownerName: "",
      roomNo: "",
      floor: "Ground",
      email: "",
      mobile: "",
      squareFoot: "",
      maintenanceRate: 1.5,
    });

  const [loading, setLoading] =
    useState(false);

  const monthlyMaintenance =
    Number(formData.squareFoot || 0) *
    Number(formData.maintenanceRate);

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
        "/api/owners",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      const data =
        await response.json();

      if (data.success) {
        toast.success(
          "Owner Added Successfully"
        );

        setFormData({
          ownerName: "",
          roomNo: "",
          floor: "Ground",
          email: "",
          mobile: "",
          squareFoot: "",
          maintenanceRate: 1.5,
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
    <div className="max-w-6xl mx-auto">

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Owner Details
        </h1>

        <p className="text-gray-500">
          Add and manage owner
          information.
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
              className="w-full h-12 border rounded-xl px-4"
              placeholder="Enter Owner Name"
              required
            />
          </div>

          {/* Room Number */}

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
              className="w-full h-12 border rounded-xl px-4"
              placeholder="101"
              required
            />
          </div>

          {/* Floor */}

          <div>
            <label className="block mb-2 font-medium">
              Floor
            </label>

            <select
              name="floor"
              value={
                formData.floor
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
            >
              <option>
                Ground
              </option>
              <option>
                First
              </option>
              <option>
                Second
              </option>
              <option>
                Third
              </option>
              <option>
                Fourth
              </option>
            </select>
          </div>

          {/* Mobile */}

          <div>
            <label className="block mb-2 font-medium">
              Mobile Number
            </label>

            <input
              type="text"
              name="mobile"
              value={
                formData.mobile
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
              placeholder="9876543210"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
              className="w-full h-12 border rounded-xl px-4"
              placeholder="owner@gmail.com"
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
              className="w-full h-12 border rounded-xl px-4"
              placeholder="500"
              required
            />
          </div>

          {/* Maintenance Rate */}

          <div>
            <label className="block mb-2 font-medium">
              Rate Per Sq.Ft
            </label>

            <input
              type="number"
              step="0.1"
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

          {/* Monthly Maintenance */}

          <div>
            <label className="block mb-2 font-medium">
              Monthly Maintenance
            </label>

            <input
              type="text"
              value={`₹ ${monthlyMaintenance}`}
              readOnly
              className="w-full h-12 bg-gray-100 border rounded-xl px-4 font-semibold text-green-700"
            />
          </div>

          {/* Button */}

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
                : "Save Owner"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}