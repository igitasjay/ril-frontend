"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TripDetails, Bus } from "@/src/types";

interface TripContextType {
  tripDetails: TripDetails | null;
  setTripDetails: (details: TripDetails) => void;
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus) => void;
  selectedSeats: number[];
  toggleSeat: (seatNumber: number) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  function toggleSeat(seatNumber: number) {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((n) => n !== seatNumber)
        : [...prev, seatNumber],
    );
  }

  return (
    <TripContext.Provider
      value={{
        tripDetails,
        setTripDetails,
        selectedBus,
        setSelectedBus,
        selectedSeats,
        toggleSeat,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvder");
  }

  return context;
}
