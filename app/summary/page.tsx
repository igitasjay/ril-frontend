"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/src/context/TripContext";

export default function Summary() {
  const router = useRouter();
  const { tripDetails, selectedBus, selectedRoute, selectedSeats } = useTrip();

  useEffect(() => {
    if (
      !tripDetails ||
      !selectedBus ||
      !selectedRoute ||
      selectedSeats.length === 0
    ) {
      router.push("/");
    }
  }, []);

  if (!tripDetails || !selectedBus || !selectedRoute) return null;

  const totalPrice = selectedRoute.basePrice * selectedSeats.length;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Booking Summary</h1>

      <div className="border rounded p-4 mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Trip type</span>
          <span className="font-medium">{tripDetails.tripType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">From</span>
          <span className="font-medium">{tripDetails.from}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">To</span>
          <span className="font-medium">{tripDetails.to}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Departure</span>
          <span className="font-medium">{tripDetails.departureDate}</span>
        </div>
        {tripDetails.returnDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Return</span>
            <span className="font-medium">{tripDetails.returnDate}</span>
          </div>
        )}
      </div>

      <div className="border rounded p-4 mb-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Bus</span>
          <span className="font-medium">{selectedBus.plateNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Seats</span>
          <span className="font-medium">{selectedSeats.join(", ")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total price</span>
          <span className="text-lg font-semibold">{`₦${totalPrice.toLocaleString()}`}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => console.log("proceed to payment")}
        className="w-full bg-black text-white p-3 rounded font-semibold"
      >
        Proceed to Payment
      </button>
    </main>
  );
}
