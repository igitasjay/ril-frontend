import axios from "axios";
import { Booking, Bus, Route } from "../types";

const API_BASE_URL = "http://localhost:4000";

export async function getAvailability(
  from: string,
  to: string,
): Promise<Bus[]> {
  const response = await axios.get(`${API_BASE_URL}/availability`, {
    params: { from, to },
  });

  return response.data.availableroutes;
}

export async function getRoutes(): Promise<Route[]> {
  const response = await axios.get(`${API_BASE_URL}/routes`);
  return response.data;
}

export async function createBooking(
  busId: string,
  routeId: string,
  seatNumbers: number[],
  passengerName: string,
  totalPrice: number,
): Promise<Booking> {
  const response = await axios.post(`${API_BASE_URL}/booking`, {
    busId,
    routeId,
    seatNumbers,
    passengerName,
    totalPrice,
  });
  return response.data.data;
}

export async function confirmBooking(bookingId: string): Promise<Booking> {
  const response = await axios.post(`${API_BASE_URL}/confirm-booking`, {
    bookingId,
  });
  return response.data.data;
}
