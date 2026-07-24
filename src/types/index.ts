export interface Route {
  id: string;
  from: string;
  to: string;
  basePrice: number;
}

export interface Seat {
  seatNumber: number;
  status: "available" | "booked";
  selected?: boolean;
}

export interface Bus {
  id: string;
  plateNumber: string;
  routeId: string;
  totalSeats: string;
  seats: Seat[];
}

export interface Booking {
  id: string;
  busId: string;
  routeId: string;
  seatNumbers: number[];
  passengerName: string;
  totalPrice: number;
  status: "pending" | "confirmed";
}

export interface TripDetails {
  tripType: "one-way" | "round-trip" | "hire";
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
}
