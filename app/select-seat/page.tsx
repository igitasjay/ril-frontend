"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/src/context/TripContext";

export default function SelectSeat() {
  const router = useRouter();
  const { selectedBus, selectedSeats, toggleSeat } = useTrip();

  useEffect(() => {
    if (!selectedBus) {
      router.push("/");
    }
  }, []);

  if (!selectedBus) return null;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Select Your Seat</h1>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {selectedBus.seats.map((seat) => {
          const selected = selectedSeats.includes(seat.seatNumber);
          const booked: boolean = seat.status === "booked";

          return (
            <button
              key={seat.seatNumber}
              disabled={booked}
              onClick={() => toggleSeat(seat.seatNumber)}
              className={`p-3 rounded border text-center font-medium transition
              ${booked ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through" : ""}
              ${selected && !booked ? "bg-blue-600 text-white border-blue-600" : ""}
              ${!selected && !booked ? "bg-white text-gray-800 hover:bg-gray-50 border-gray-300" : ""}`}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Selected: {selectedSeats.join(", ") || "none"}
      </p>

      <button
        disabled={selectedSeats.length === 0}
        onClick={() => router.push("/summary")}
        className="w-full p-3 rounded font-semibold text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </main>
  );
}
