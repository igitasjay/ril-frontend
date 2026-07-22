"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/src/context/TripContext";
import { TripDetails } from "@/src/types";

export default function Home() {
  const router = useRouter();
  const { setTripDetails } = useTrip();

  const [tripType, setTripType] = useState<TripDetails["tripType"]>("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const tripTypes: { label: string; value: TripDetails["tripType"] }[] = [
    { label: "One-way Trip", value: "one-way" },
    { label: "Round Trip", value: "round-trip" },
    { label: "Hire a Bus", value: "hire" },
  ];

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Book a Trip</h1>

      <div className="flex gap-2 mb-6">
        {tripTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTripType(t.value)}
            className={`px-3 py-2 rounded border text-sm ${
              tripType === t.value
                ? "bg-gray-500 text-white border-gray-500"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="Departure location"
        className="border rounded px-3 py-2 w-full mb-3"
      />
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Destination"
        className="border rounded px-3 py-2 w-full mb-3"
      />
      <input
        type="date"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-3"
      />
      {tripType === "round-trip" && (
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-3"
        />
      )}
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        type="button"
        onClick={() => {
          if (!from || !to || !departureDate) {
            setError("Please fill in all required fields");
            return;
          }
          setError("");
          const details: TripDetails = {
            tripType,
            from,
            to,
            departureDate,
            ...(tripType === "round-trip" && { returnDate }),
          };
          setTripDetails(details);
          router.push("/select-bus");
        }}
        className="bg-white text-black px-4 py-2 rounded w-full mt-2"
      >
        Search Buses
      </button>
    </main>
  );
}
