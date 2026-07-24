"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/src/context/TripContext";

export default function Confirmation() {
  const router = useRouter();
  const { currentBooking } = useTrip();

  useEffect(() => {
    if (!currentBooking) {
      router.push("/");
    }
  }, []);

  if (!currentBooking) return null;

  return (
    <main className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Booking confirmed! 🎉</h1>
      <p className="text-gray-600 mb-6">
        Your seat is locked in. Keep your booking reference for your records.
      </p>

      <div className="border rounded p-4 mb-6 text-left space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Booking reference</span>
          <span className="font-medium">{currentBooking.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Seat(s)</span>
          <span className="font-medium">
            {currentBooking.seatNumbers.join(", ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status</span>
          <span className="font-medium capitalize">
            {currentBooking.status}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full bg-black text-white p-3 rounded font-semibold"
      >
        Book another trip
      </button>
    </main>
  );
}
