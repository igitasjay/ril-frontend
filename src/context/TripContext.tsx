"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { TripDetails, Bus, Route, Booking } from "@/src/types";

interface TripContextType {
  tripDetails: TripDetails | null;
  setTripDetails: (details: TripDetails) => void;
  selectedBus: Bus | null;
  setSelectedBus: (bus: Bus) => void;
  selectedSeats: number[];
  toggleSeat: (seatNumber: number) => void;
  selectedRoute: Route | null;
  setSelectedRoute: (route: Route) => void;
  currentBooking: Booking | null;
  setCurrentBooking: (booking: Booking) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

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
        selectedRoute,
        setSelectedRoute,
        currentBooking,
        setCurrentBooking,
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
