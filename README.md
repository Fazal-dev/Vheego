<div align="center">

# 🚗 Vheego

**A full-stack vehicle rental platform connecting owners with customers.**

Vheego handles the entire rental lifecycle — browsing, booking, Stripe payments, OTP-based trip handover, reviews, payout management, and admin oversight — all in one application.

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat&logo=stripe&logoColor=white)](https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Models](#-database-models)
- [Requirements](#-requirements)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Booking Lifecycle](#-booking-lifecycle)
- [Running in Production](#-running-in-production)
- [Testing](#-testing)
- [Code Style](#-code-style)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

Vheego is a **multi-role vehicle rental platform** built with Laravel 12, React 19, and Inertia.js. It supports three distinct user roles — **Customer**, **Owner**, and **Admin** — each with their own dashboard, workflows, and permissions.

Key highlights:
- **Stripe Checkout** integration with dynamic pricing (base rental + insurance fee + 8% VAT)
- **OTP-based trip handover** — both trip start and trip end require a 4-digit code exchange
- **Real-time notifications** via Laravel Reverb (WebSockets) when new bookings arrive
- **Tiered cancellation and refund policy** credited directly to the user's wallet
- **Admin-controlled payout system** with configurable commission rates per owner
- **Star ratings and reviews** submitted by customers at trip completion

---

## ✨ Features

### 👤 Customer

| Feature | Details |
|---|---|
| Vehicle Search | Filter by type, transmission, fuel type, seats, and sort by price |
| Vehicle Details | Full image gallery, specs, description, highlights, owner profile, and reviews |
| Availability Check | Real-time check before booking to prevent double bookings |
| Stripe Checkout | Secure card payment via Stripe (base rent + insurance bond + 8% VAT) |
| Booking Confirmation | Email sent automatically after successful payment |
| Customer Dashboard | Active trip card with progress bar, countdown timer, and trip stats |
| Booking List | Filter bookings by status: OnTrip, Booked, Completed, Cancelled |
| Trip Start | Multi-step wizard: license → document checklist → odometer → OTP handshake |
| Trip End | Multi-step wizard: odometer reading → star rating + review → OTP verification |
| Booking Cancellation | Cancel with tiered refund applied to wallet balance |
| Wallet Balance | Refunds credited directly to the user's wallet |

**Refund Policy:**

| Time Before Trip | Refund |
|---|---|
| More than 24 hours | 100% refund |
| 12 – 24 hours | 50% refund |
| Less than 12 hours | No refund |

---

### 🚗 Owner

| Feature | Details |
|---|---|
| Vehicle Listing | Create listings with 8 photos, full specs, description, highlights, and pickup location |
| Vehicle Management | View, edit, and delete your own vehicle listings |
| Real-time Notifications | Instant booking alerts via WebSocket (Laravel Reverb) |
| Owner Dashboard | Stats for active trips, total earnings, occupancy rate, and pending payouts |
| Earnings Chart | Monthly earnings and bookings chart (last 8 months) |
| Upcoming Bookings | Overview of upcoming confirmed bookings |
| Fleet Overview | Top 3 vehicles by monthly earnings with ratings and current renter |
| Trip Validation | Server-side step validation for trip start and end workflows |
| Booking History | View all bookings for your vehicles filtered by status |
| Revenue Page | Detailed earnings breakdown per booking |
| Payout History | View all received payouts with references and statuses |
| Bank Details | Submit and update bank account for payout deposits |

---

### 🛡️ Admin

| Feature | Details |
|---|---|
| Vehicle Approval | Review and approve or reject vehicle listings before they go live |
| Admin Dashboard | Platform-wide stats: total revenue, bookings, active vehicles, users, owners, pending approvals |
| Revenue Chart | Monthly revenue and bookings for the last 6 months |
| Booking Status Breakdown | Pie/bar chart across all booking statuses |
| Recent Bookings Table | Latest 8 bookings across the whole platform |
| Payout Management | View all owner payouts, trigger individual or bulk payouts |
| Commission Settings | Adjust commission rate per owner |
| Month-over-Month Deltas | Track revenue, bookings, and new user growth vs. last month |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Laravel 12, PHP 8.2+ |
| **Frontend** | React 19, TypeScript 5.7 |
| **SSR / Routing** | Inertia.js, Laravel Wayfinder |
| **Styling** | Tailwind CSS v4, Radix UI, shadcn/ui, Lucide React |
| **Charts** | Recharts |
| **Forms / UX** | React Day Picker, Input OTP, React Dropzone, React Advanced Cropper, Stepperize, SweetAlert2, React Hot Toast |
| **Tables** | TanStack React Table |
| **Auth** | Laravel Fortify (with Two-Factor Authentication) |
| **Payments** | Stripe Checkout (card payments in LKR) |
| **Real-time** | Laravel Reverb (WebSockets), Laravel Echo, Pusher JS |
| **Mail** | Booking confirmation via SMTP |
| **Queue** | Laravel Queue (database driver) |
| **Database** | SQLite (default), MySQL or PostgreSQL |
| **Build Tool** | Vite 7 |
| **Testing** | Pest, Pest Laravel Plugin |
| **Linting** | ESLint 9, Prettier, Laravel Pint |

---

## 🏗 Architecture

```
Browser (React + TypeScript)
        │
        │  Inertia.js (no separate API, server-rendered page props)
        │
Laravel 12 (PHP 8.2+)
        │
        ├── Auth          → Laravel Fortify (session-based, 2FA)
        ├── Payments      → Stripe Checkout (redirect flow)
        ├── Real-time     → Laravel Reverb (WebSocket server)
        ├── Mail          → SMTP (booking confirmations)
        └── Queue         → Database driver (background jobs)
        │
Database (SQLite / MySQL / PostgreSQL)
```

---

## 🗄 Database Models

### Entity Overview

| Model | Table | Purpose |
|---|---|---|
| `User` | `users` | All users — customers, owners, and admins. Stores role, wallet balance, bank details (JSON), and 2FA data. |
| `Vehicle` | `vehicles` | Vehicles listed by owners. Stores specs, 8 image URLs (JSON), approval status (`Inactive`/`Active`), and current availability. |
| `Booking` | `bookings` | Links a customer to a vehicle. Tracks status, OTPs, odometer readings, Stripe reference, and payment info. |
| `Review` | `reviews` | Customer review after trip completion. Linked to a booking and vehicle. Stores star rating (1–5) and comment. |
| `Payout` | `payouts` | Admin-issued payout to an owner. Stores gross amount, commission %, net amount, status, and payment reference. |
| `VehicleHistory` | `vehicle_histories` | Immutable audit log of vehicle status changes (e.g., Created → Booked → On Trip → Available). |

### Relationships

```
User ──< Booking >── Vehicle
User ──< Vehicle
User ──< Payout
Vehicle ──< Review
Booking ──< Review (one review per booking)
Vehicle ──< VehicleHistory
```

---

## ✅ Requirements

- **PHP** 8.2 or higher
- **Composer** 2+
- **Node.js** 20+
- **Database**: SQLite (works out of the box), MySQL, or PostgreSQL
- A **Stripe** account (for payment processing)
- An **SMTP** mail service (Mailtrap, Mailgun, etc.)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Fazal-dev/Vheego.git
cd Vheego
```

### 2. Run the setup script

This single command installs PHP and JS dependencies, copies `.env.example` → `.env`, generates the application key, runs all migrations, and builds the frontend:

```bash
composer run setup
```

### 3. Configure your environment

Open `.env` and fill in the required values. See [Environment Variables](#-environment-variables) below.

### 4. Link the storage disk

```bash
php artisan storage:link
```

> This is required so that uploaded vehicle images (stored in `storage/app/public`) are publicly accessible.

### 5. Start the development server

Starts **4 services concurrently** — Laravel server, queue worker, Vite dev server, and Reverb WebSocket server:

```bash
composer run dev
```

Then open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🔑 Environment Variables

After setup, open `.env` and fill in the following:

```env
APP_NAME=Vheego
APP_URL=http://localhost

# ── Database ──────────────────────────────────────────────────────────────
# SQLite (default, no config needed)
DB_CONNECTION=sqlite

# MySQL (optional)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=vheego
# DB_USERNAME=root
# DB_PASSWORD=secret

# ── Stripe ────────────────────────────────────────────────────────────────
# Get these from https://dashboard.stripe.com/apikeys
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...

# ── Mail ──────────────────────────────────────────────────────────────────
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@vheego.com
MAIL_FROM_NAME="Vheego"

# ── Reverb (WebSockets) ───────────────────────────────────────────────────
# These defaults work for local development.
# Change them for production.
REVERB_APP_ID=vheego
REVERB_APP_KEY=vheego-key
REVERB_APP_SECRET=vheego-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

---

## 📜 Available Scripts

### Composer

| Command | What it does |
|---|---|
| `composer run setup` | Install all deps, copy `.env`, generate key, run migrations, build frontend |
| `composer run dev` | Start Laravel server + queue worker + Vite + Reverb concurrently |
| `composer run dev:ssr` | Same as dev but with SSR support via `php artisan inertia:start-ssr` |
| `composer run test` | Clear config cache and run the full Pest test suite |

### NPM

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build frontend assets for production |
| `npm run build:ssr` | Build frontend + SSR bundle |
| `npm run lint` | Run ESLint and auto-fix issues |
| `npm run format` | Format all files in `resources/` with Prettier |
| `npm run format:check` | Check formatting without overwriting files |
| `npm run types` | Run TypeScript type check without emitting files |

### Artisan (individual services)

```bash
php artisan serve              # Laravel dev server
php artisan queue:listen       # Queue worker
php artisan reverb:start       # WebSocket server
php artisan storage:link       # Link public storage disk
php artisan migrate            # Run database migrations
php artisan tinker             # Interactive REPL
```

---

## 📁 Project Structure

```
Vheego/
├── app/
│   ├── Events/
│   │   └── NewBookingReceived.php        # Broadcast event on new booking
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminController.php           # Vehicle approval workflow
│   │   │   │   ├── AdminDashboardController.php  # Platform-wide stats & charts
│   │   │   │   └── AdminPayoutController.php     # Payout management & commission
│   │   │   ├── Owner/
│   │   │   │   ├── OwnerController.php            # Owner dashboard, fleet overview
│   │   │   │   ├── OwnerRevenueController.php     # Revenue breakdown
│   │   │   │   ├── OwnerPayoutsController.php     # Payout history
│   │   │   │   └── OwnerBankDetailsController.php # Bank account management
│   │   │   ├── Auth/                              # Fortify auth controllers
│   │   │   ├── Settings/                          # Profile & password settings
│   │   │   ├── BookingController.php              # Owner-side trip step validation
│   │   │   ├── CustomerController.php             # All customer flows (browse, book, trips, payment)
│   │   │   └── VehicleController.php              # Vehicle CRUD (owner)
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Mail/
│   │   └── BookingConfirmation.php       # Booking confirmation email
│   ├── Models/
│   │   ├── Booking.php
│   │   ├── Payout.php
│   │   ├── Review.php
│   │   ├── User.php
│   │   ├── Vehicle.php
│   │   └── VehicleHistory.php
│   └── Providers/
│
├── database/
│   ├── migrations/                       # Full schema history (13 migrations)
│   ├── factories/                        # Faker data factories
│   └── seeders/
│
├── resources/
│   └── js/
│       ├── pages/
│       │   ├── User/                     # Customer pages
│       │   │   ├── dashboard.tsx         # Customer dashboard (active trip, bookings)
│       │   │   ├── customerDashboard.tsx
│       │   │   ├── vehicleSearch.tsx     # Browse & filter vehicles
│       │   │   ├── vehicle-details.tsx   # Vehicle detail page with reviews
│       │   │   ├── booking-list.tsx      # Customer booking history
│       │   │   ├── payment-success.tsx   # Post-payment success screen
│       │   │   └── payment-cancel.tsx    # Payment cancelled screen
│       │   ├── Owner/                    # Owner pages
│       │   │   ├── ownerDashboard.tsx    # Owner dashboard with earnings chart
│       │   │   ├── Revenue.tsx           # Revenue breakdown
│       │   │   ├── Payouts.tsx           # Payout history
│       │   │   ├── BankDetails.tsx       # Bank account form
│       │   │   └── booking-owner-list.tsx
│       │   ├── Vehicle/                  # Vehicle management pages
│       │   │   ├── vehicleCreate.tsx     # Multi-step vehicle creation with image upload
│       │   │   ├── vehicleEdit.tsx
│       │   │   ├── vehicleList.tsx
│       │   │   └── vehicleShow.tsx
│       │   ├── Admin/                    # Admin pages
│       │   │   ├── Dashboard.tsx         # Platform dashboard
│       │   │   ├── VehicleApproval/      # Vehicle review & approve/reject
│       │   │   └── payout/               # Payout management
│       │   ├── auth/                     # Login, register, verify email, 2FA
│       │   ├── settings/                 # Profile & password settings
│       │   ├── Welcome.tsx               # Public landing page
│       │   └── dashboard.tsx             # Role-based redirect dashboard
│       ├── components/                   # Reusable UI components (shadcn/ui based)
│       ├── layouts/                      # App shell layouts (customer, owner, admin)
│       ├── hooks/                        # Custom React hooks
│       ├── actions/                      # Inertia form action helpers
│       ├── types/                        # Shared TypeScript interfaces
│       ├── lib/                          # Utility functions (cn, date helpers, etc.)
│       └── wayfinder/                    # Auto-generated Laravel Wayfinder route helpers
│
├── routes/
│   ├── web.php                           # All customer, owner, and admin routes
│   ├── auth.php                          # Fortify authentication routes
│   ├── settings.php                      # Profile and settings routes
│   └── channels.php                      # Broadcast channel authorization
│
├── tests/                                # Pest test suite
│
├── .env.example                          # Environment variable template
├── composer.json                         # PHP dependencies & scripts
├── package.json                          # JS dependencies & scripts
├── vite.config.ts                        # Vite build configuration
├── tsconfig.json                         # TypeScript configuration
└── phpunit.xml                           # PHPUnit / Pest configuration
```

---

## 👥 User Roles

Roles are enforced via the `role` middleware on all protected route groups.

| Role | Access Prefix | What they can do |
|---|---|---|
| `customer` | `/customer/...` | Browse, book, and manage vehicle rentals |
| `owner` | `/owner/...` | List vehicles, manage trips, view revenue and payouts |
| `admin` | `/admin/...` | Approve vehicles, manage payouts, view platform stats |

A user is assigned a role at registration. Role-based redirects send each user to their appropriate dashboard on login.

---

## 🔄 Booking Lifecycle

```
[Customer pays via Stripe]
          │
          ▼
      ┌────────┐
      │ Booked │  ←─── Booking created after Stripe webhook success
      └────┬───┘
           │  Owner gives customer start OTP
           ▼
      ┌─────────┐
      │ OnTrip  │  ←─── Customer enters OTP + license + odometer to start
      └────┬────┘
           │  Customer submits odometer, review, and end OTP
           ▼
      ┌───────────┐
      │ Completed │  ←─── Review saved, vehicle marked available, payout queued
      └───────────┘

Alternatively, from Booked:
      ┌───────────┐
      │ Cancelled │  ←─── Refund calculated and credited to customer wallet
      └───────────┘
```

### Vehicle Status Log (VehicleHistory)

Every status change is recorded in `vehicle_histories` as an immutable audit trail:

```
Created → Booked → On Trip → Available
                ↘
                 Deleted
```

---

## 🏭 Running in Production

### 1. Build frontend assets

```bash
npm run build
```

### 2. Cache Laravel configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

### 3. Link storage

```bash
php artisan storage:link
```

### 4. Run background services

Queue worker (process jobs like emails):

```bash
php artisan queue:listen
```

Reverb WebSocket server:

```bash
php artisan reverb:start
```

> In production, run both with a process manager like **Supervisor** to keep them alive.

---

## 🧪 Testing

```bash
composer run test
```

Or run Pest directly:

```bash
php artisan test
```

Run a specific test file:

```bash
php artisan test tests/Feature/ExampleTest.php
```

---

## 🎨 Code Style

**Frontend** — ESLint + Prettier:

```bash
npm run lint         # Lint and auto-fix
npm run format       # Format with Prettier
npm run types        # TypeScript type check
```

**PHP** — Laravel Pint (PSR-12 compliant):

```bash
./vendor/bin/pint
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and add tests where applicable
4. Ensure code style passes:
   ```bash
   npm run lint && ./vendor/bin/pint
   ```
5. Push your branch and open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Developer & Owner

Vheego is solely designed, developed, and owned by **Fazal**.

> This is an original project. All code, architecture, and design decisions were made by Fazal.

[![GitHub](https://img.shields.io/badge/GitHub-Fazal--dev-181717?style=flat&logo=github&logoColor=white)](https://github.com/Fazal-dev)

---

<div align="center">

Built with ❤️ using [Laravel](https://laravel.com) + [React](https://react.dev) + [Inertia.js](https://inertiajs.com)

</div>
