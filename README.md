# CineBook — Movie Ticket Booking Website

A complete, production-quality movie ticket booking platform built with React.js, HTML, CSS, and JavaScript. Data is stored locally using localStorage (simulating MongoDB operations).

## Features

- **Movie Browsing** — Search, filter by genre/language/format/rating, sort by popularity
- **Movie Details** — Full movie information with cast, crew, formats, and available cinemas
- **Complete Booking Flow** — Date → Cinema → Show Time → Seat Selection → Summary → Confirmation
- **Interactive Seat Map** — Real-time seat selection with premium/standard/economy zones
- **User Authentication** — Register, login, logout, profile management
- **Booking History** — View all past bookings with details
- **Cinema Directory** — Browse cinemas by location with facilities info
- **Admin Panel** — CRUD operations for movies, cinemas, shows; view bookings and users
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Offers Page** — Promotional deals display

## Tech Stack

- **React.js** — UI components, routing, state management
- **CSS** — Custom design system with CSS variables (no frameworks)
- **JavaScript** — Application logic and data services
- **MongoDB** — Database schema designed (localStorage used for demo)

## Getting Started

### Prerequisites

- Node.js 16+ installed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

## Demo Accounts

| Role  | Email                | Password    |
|-------|---------------------|-------------|
| User  | aarav@example.com   | password123 |
| User  | priya@example.com   | password123 |
| Admin | admin@cinebook.com  | admin123    |

## Project Structure

```
project/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── MovieCard.jsx
│   │   ├── CinemaCard.jsx
│   │   └── SeatMap.jsx
│   ├── pages/           # Route pages
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── Booking.jsx
│   │   ├── Cinemas.jsx
│   │   ├── CinemaDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Offers.jsx
│   │   └── Admin.jsx
│   ├── context/         # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── services/        # Data service layer
│   │   └── dataService.js
│   ├── data/            # Sample data
│   │   ├── movies.js
│   │   ├── cinemas.js
│   │   ├── shows.js
│   │   └── users.js
│   ├── utils/           # Utility functions
│   │   └── helpers.js
│   ├── styles/          # Global styles
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── database/            # MongoDB schema & seed
│   ├── schema.js
│   └── seed.js
├── index.html
├── package.json
└── README.md
```

## MongoDB Schema

Collections: `users`, `movies`, `cinemas`, `shows`, `bookings`

See `database/schema.js` for complete field documentation and relationships.

## Booking Flow

```
Home → Movies → Movie Details → Book Tickets
  → Select Date → Select Show → Select Seats
  → Booking Summary → Confirm → Confirmation
```

Each show maintains independent seat availability. Booked seats are tracked per-show and cannot be double-booked.

## Design System

The UI uses a custom CSS design system with:
- CSS variables for colors, typography, spacing, borders
- Dark cinematic theme with red accent (#e50914)
- Consistent component patterns
- Responsive breakpoints (1024px, 768px, 480px)

## Notes

- This is a demo/educational project
- No real payment processing
- Data persists in browser localStorage
- To use with MongoDB, update `src/services/dataService.js` with MongoDB driver calls
