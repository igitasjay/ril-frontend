"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTrip } from "@/src/context/TripContext";
import { confirmBooking, createBooking } from "@/src/services/api";
import { Booking } from "@/src/types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Summary() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    tripDetails,
    selectedBus,
    selectedRoute,
    selectedSeats,
    setCurrentBooking,
  } = useTrip();
  const [passengerName, setPassengerName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

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

  async function handlePaymentSuccess(bookingId: string) {
    try {
      const confirmed = await confirmBooking(bookingId);
      setCurrentBooking(confirmed);
      router.push("/confirmation");
    } catch (err) {
      setError("Payment succeeded but confirmation failed. Contact support.");
    } finally {
      setIsProcessing(false);
    }
  }

  function payWithPaystack(booking: Booking) {
    const paystack = (window as any).PaystackPop;

    if (!paystack || typeof paystack.setup !== "function") {
      setError(
        "Payment system is still loading. Please wait a moment and try again.",
      );
      setIsProcessing(false);
      return;
    }

    paystack
      .setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: emailAddress,
        amount: totalPrice * 100,
        ref: booking.id,
        callback: (response: any) => {
          handlePaymentSuccess(booking.id);
        },
        onClose: () => {
          setError("Payment was cancelled");
          setIsProcessing(false);
        },
      })
      .openIframe();
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Booking Summary</h1>

      <input
        value={passengerName}
        onChange={(e) => setPassengerName(e.target.value)}
        placeholder="Passenger name"
        className="border rounded px-3 py-2 w-full mb-4"
      />
      <input
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        placeholder="Email Address"
        className="border rounded px-3 py-2 w-full mb-1"
      />
      <p className="text-gray-300 text-xs mb-4">
        We use this email address to mail you a receipt of your transaction
      </p>

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

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <button
        type="button"
        disabled={isProcessing}
        onClick={async () => {
          if (!passengerName || !emailAddress) {
            setError("Complete the form");
            return;
          }

          if (!isValidEmail(emailAddress)) {
            setError("Enter a valid email address");
            return;
          }

          setError("");
          setIsProcessing(true);

          try {
            const booking = await createBooking(
              selectedBus.id,
              selectedRoute.id,
              selectedSeats,
              passengerName,
              totalPrice,
            );
            setCurrentBooking(booking);

            try {
              payWithPaystack(booking);
            } catch (paymentError) {
              console.error("Paystack setup failed:", paymentError);
              setError(
                "Booking created, but payment could not start. Contact support with reference " +
                  booking.id,
              );
              setIsProcessing(false);
            }
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
              setError(
                "One of your selected seats was just booked by someone else. Please go back and choose a different seat.",
              );
            } else {
              setError(
                "Something went wrong while creating your booking. Please try again.",
              );
            }
            setIsProcessing(false);
          }
        }}
        className="w-full bg-black text-white p-3 rounded font-semibold disabled:bg-gray-400"
      >
        {isProcessing ? "Processing..." : "Proceed to Payment"}
      </button>
    </main>
  );
}
