# Bus Transportation Booking App

A Bus Transportation Booking web application (PMT-inspired) built for the Renaissance Innovation Labs Frontend Developer Internship technical assessment.

## Live Links

- **Frontend (Vercel):** [ADD YOUR VERCEL URL HERE]
- **Backend API (Render):** [ADD YOUR RENDER URL HERE]
- **GitHub Repository:** [ADD YOUR GITHUB REPO URL HERE]

## Tech Stack

**Frontend**
| Tool | Purpose |
|---|---|
| Next.js (App Router) | Routing and page structure |
| TypeScript | Type safety across the app |
| Tailwind CSS | Styling |
| React Context (`useContext` + `useState`) | Shared state across the booking flow |
| Axios | API requests |
| Paystack Inline JS (sandbox) | Payment |

**Backend**
| Tool | Purpose |
|---|---|
| Node.js + Express | API server |
| TypeScript | Type safety |
| In-memory data structures | Storage (see *Assumptions*) |

## Project Structure

```
backend/
  src/
    models/       # Route, Bus, Seat, Booking type definitions
    services/     # Business logic (route/bus lookup, seat locking, booking creation)
    controllers/  # Request/response handling
    routes/       # Express routers, one per resource
    data/         # Seed data (routes, buses) and runtime data (bookings)
    index.ts      # App entry point

frontend/
  src/
    app/
      page.tsx              # Trip type + trip details form
      select-bus/page.tsx    # Available buses for the chosen route
      select-seat/page.tsx   # Seat grid
      summary/page.tsx       # Booking summary, passenger details, payment
      confirmation/page.tsx  # Final confirmation screen
      layout.tsx             # Wraps the app in TripProvider
    context/       # TripContext — shared state across all pages
    services/      # API layer (Axios calls)
    types/         # Shared TypeScript types
```

## Setup Instructions

### Backend
```bash
cd backend
pnpm install
```
Create `.env`:
```
PORT=4000
```
```bash
pnpm dev
```
Server runs at `http://localhost:4000`.

### Frontend
```bash
cd frontend
pnpm install
```
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_PAYSTACK_KEY=pk_test_your_paystack_public_key
```
```bash
pnpm dev
```
App runs at `http://localhost:3000`.

### Deployment
- Backend deployed on **Render**; same `PORT` env var pattern (Render sets this automatically).
- Frontend deployed on **Vercel**; `NEXT_PUBLIC_API_BASE_URL` set to the live Render URL, `NEXT_PUBLIC_PAYSTACK_KEY` set to the same Paystack test key, both configured in Vercel's Environment Variables dashboard.

## API Documentation

| Method | Endpoint | Body / Query | Response |
|---|---|---|---|
| GET | `/routes` | — | `Route[]` |
| GET | `/buses` | — | `Bus[]` |
| GET | `/availability` | query: `from`, `to` | `{ availableroutes: Bus[] }` — buses running the matched route |
| POST | `/booking` | `{ busId, routeId, seatNumbers, passengerName, totalPrice }` | `201 { status, data: Booking }` on success; `409 { status, error }` if a seat is unavailable or the bus doesn't exist |
| POST | `/confirm-booking` | `{ bookingId }` | `200 { status, data: Booking }` on success; `409 { status, error }` if the booking doesn't exist or is already confirmed |

All endpoints validate required fields and return `400` with a clear error message when fields are missing.

## Approach

The backend follows a layered architecture (routes → controllers → services → data/models), so each piece has one job: routes wire URLs to controllers, controllers only handle HTTP in/out, services hold the actual business logic, and models define data shape. This kept the seat-locking logic (the core hard problem — preventing two people from booking the same seat) isolated and testable independent of HTTP concerns.

On the frontend, trip data flows through a single React Context (`TripContext`) rather than being passed as props between the five pages of the booking flow (trip details → bus selection → seat selection → summary → confirmation). Each page reads what it needs from context and writes back the piece it's responsible for, so no page needs to know about any other page's internal state.

Payment uses Paystack's sandbox inline checkout. A booking is created as `"pending"` (which locks the seat immediately, preventing double-booking during the payment step) and only flips to `"confirmed"` after Paystack reports a successful payment and the frontend calls `/confirm-booking`.

## Assumptions Made

- Seat availability, once booked (even as `"pending"`), is locked immediately — this is what "prevent double bookings" is built around, and it's proven by attempting the same seat twice and getting a `409`.
- Data is stored **in-memory**, not in a database. This was a deliberate scope decision given the timeline — the assessment explicitly allows "JSON, in-memory, or a simple database." As a result, all data (routes, buses, bookings, seat status) resets when the backend restarts.
- The `date` query parameter on `/availability` is accepted per the spec's URL shape but is not currently used to filter results, since there's no per-day bus scheduling model in this version — every bus on a matched route is treated as available regardless of date.
- "Hire a Bus" is captured as a trip type but currently follows the same booking flow as one-way/round-trip rather than a distinct flow, given time constraints.
- Pending (unconfirmed) bookings have no expiry — if a user abandons payment mid-flow, that seat stays locked. A production system would need a timeout/cleanup job for this.

## Known Limitations / Possible Improvements

- Both "bus not found" and "seat already booked" currently return the same `409` status from `/booking` and `/confirm-booking`; a `404` would be more precise for the not-found case specifically.
- No persistent database — see *Assumptions*.
- No automated test suite; all endpoints were manually verified with curl throughout development.

## Bonus Items

**Completed**
- TypeScript across both frontend and backend
- Form validation (trip details form, email format check before payment)

**Not completed (time constraints)**
- MongoDB/PostgreSQL integration
- Simple authentication
- Search/autocomplete on location fields
- Local storage persistence
- Automated tests
