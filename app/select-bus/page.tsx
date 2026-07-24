"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrip } from "@/src/context/TripContext";
import { getAvailability, getRoutes } from "@/src/services/api";
import { Bus, Route } from "@/src/types";

export default function SelectBus() {
  const router = useRouter();
  const { tripDetails, setSelectedBus, setSelectedRoute } = useTrip();

  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tripDetails) {
      router.push("/");
      return;
    }

    async function fetchBuses() {
      const results = await getAvailability(
        tripDetails?.from ?? "",
        tripDetails?.to ?? "",
      );
      setBuses(results);
    }

    async function fetchRoutes() {
      const result = await getRoutes();
      setRoutes(result);
    }

    async function fetchData() {
      try {
        await Promise.all([fetchBuses(), fetchRoutes()]);
      } catch (error) {
        setError(`One of the requests failed: ${error}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="p-6">Loading buses...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Available Buses</h1>
      {buses.length === 0 ? (
        <p>No buses found for this route.</p>
      ) : (
        buses.map((bus) => (
          <button
            key={bus.id}
            type="button"
            className="w-full text-left"
            onClick={() => {
              const matchingroute = routes.find((r) => r.id === bus.routeId);
              setSelectedBus(bus);
              if (matchingroute) setSelectedRoute(matchingroute);
              router.push("/select-seat");
            }}
          >
            <div className="border rounded p-4 mb-3 cursor-pointer hover:bg-gray-50">
              <p className="font-medium">{bus.plateNumber}</p>
              <p className="text-sm text-gray-600">
                {bus.seats.filter((s) => s.status === "available").length} seats
                available
              </p>
            </div>
          </button>
        ))
      )}
    </main>
  );
}
