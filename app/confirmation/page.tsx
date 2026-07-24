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
      <p>Booking confirmed! 🎉</p>
    </main>
  );
}
