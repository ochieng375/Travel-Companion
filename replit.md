# Overview

This is a travel company web application called "Safari Private Tours" — a full-stack platform for a Kenyan safari/tour company. It allows customers to browse tour packages, view the vehicle fleet, read testimonials, make bookings, and send contact inquiries. It includes an admin dashboard for managing bookings, fleet, packages, testimonials, and customer inquiries.

The business is based in Ongata Rongai, Kenya, offering safari experiences (Maasai Mara, Amboseli, Tsavo, etc.) with vehicles like Suzuki Alto, Toyota Premio, and Toyota Noah.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State/Data Fetching**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with CSS variables for theming, using an earthy luxury palette (terracotta/bronze primary, cream backgrounds, forest green accents)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and scroll animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Fonts**: Playfair Display (serif, headings) and Lato (sans-serif, body text) from Google Fonts
- **Build Tool**: Vite with React plugin

### Backend
- **Framework**: Express.js on Node.js with TypeScript
- **Runtime**: tsx for development, esbuild for production bundling
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js, sessions stored in PostgreSQL via connect-pg-simple
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod

### Shared Code (`shared/` directory)
- `schema.ts` — Drizzle table definitions and Zod insert schemas for vehicles, packages, testimonials, bookings, and contacts
- `models/auth.ts` — User and session table definitions (required for Replit Auth)
- `routes.ts` — API route definitions with Zod response schemas (acts as a typed API contract)

### Database Schema (PostgreSQL via Drizzle)
- **vehicles** — id (UUID), name, description, capacity, features (JSONB string[]), imageUrl, status (available/booked/maintenance), timestamps
- **packages** — id (UUID), name, description, duration, price, itinerary (JSONB string[]), imageUrl, isPopular, timestamps
- **testimonials** — id (UUID), clientName, content, rating, imageUrl, timestamps
- **bookings** — id (UUID), customerName, email, phone, message, packageId, vehicleId, status, timestamps
- **contacts** — id (UUID), name, email, message, isRead, timestamps
- **users** — id (UUID), email, firstName, lastName, profileImageUrl, timestamps (Replit Auth)
- **sessions** — sid, sess (JSONB), expire (Replit Auth session storage)

### Key Pages
- **Home** (`/`) — Hero section with safari image, featured packages, value propositions
- **Tour Packages** (`/packages`) — Grid of all tour packages with booking capability
- **Our Fleet** (`/fleet`) — Vehicle showcase with specs and features
- **Testimonials** (`/testimonials`) — Client reviews with star ratings
- **Contact** (`/contact`) — Contact form and company information
- **Admin** (`/admin`) — Protected dashboard with tabs for overview, bookings, fleet, packages, inquiries, testimonials management

### Data Flow
- Custom React hooks in `client/src/hooks/` wrap TanStack Query for each resource (vehicles, packages, testimonials, bookings, contacts)
- The `shared/routes.ts` file defines API contracts with paths, methods, and Zod response schemas used by both client hooks and server routes
- Database seeding happens automatically on server start if tables are empty (seeds vehicles and packages)

### Authentication Flow
- Replit Auth via OpenID Connect — users are redirected to `/api/login` for authentication
- Admin page checks `isAuthenticated` and redirects unauthenticated users
- Session management uses PostgreSQL-backed session store
- Auth middleware (`isAuthenticated`) protects admin API endpoints

### Build System
- Development: `tsx server/index.ts` with Vite dev server middleware (HMR)
- Production: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: `drizzle-kit push` to sync schema

## External Dependencies

- **PostgreSQL** — Primary database (required, connection via `DATABASE_URL` environment variable)
- **Replit Auth (OpenID Connect)** — Authentication provider (uses `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET` environment variables)
- **Google Fonts** — Playfair Display and Lato font families loaded via CSS
- **Unsplash** — Safari/travel images referenced by URL in seed data and page components
- **ui-avatars.com** — Fallback avatar generation for testimonials
- **Drizzle Kit** — Database schema management and migrations