# Vheego

A vehicle rental platform that connects vehicle owners with customers and travellers.

Owners can list their vehicles. Customers can search, book, and pay. Both sides get real-time updates on bookings and messages.

---

## Tech Stack

| Layer | What it uses |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Frontend | React 19, TypeScript, Inertia.js |
| Styling | Tailwind CSS v4, Radix UI |
| Auth | Laravel Fortify |
| Payments | Stripe |
| Real-time | Laravel Reverb (WebSockets) |
| Queue | Database driver |
| Database | SQLite (default), MySQL or PostgreSQL |
| Build | Vite 7 |
| Testing | Pest |

---

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 20+
- SQLite (default) or a MySQL/PostgreSQL database

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Fazal-dev/Vheego.git
cd Vheego
```

### 2. Run the setup script

This installs all dependencies, sets up your `.env`, generates an app key, and runs migrations.

```bash
composer run setup
```

### 3. Set up your environment

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Key variables you need to update:

```env
APP_NAME=Vheego
APP_URL=http://localhost

# Database (SQLite by default, no setup needed)
DB_CONNECTION=sqlite

# Stripe keys (get these from stripe.com)
STRIPE_KEY=your_stripe_publishable_key
STRIPE_SECRET=your_stripe_secret_key

# Mail settings
MAIL_MAILER=smtp
MAIL_HOST=your_mail_host
MAIL_PORT=587
MAIL_USERNAME=your_mail_user
MAIL_PASSWORD=your_mail_password
MAIL_FROM_ADDRESS=hello@vheego.com
```

### 4. Start the dev server

This runs the Laravel server, queue worker, Vite dev server, and Reverb WebSocket server all at once:

```bash
composer run dev
```

Then open `http://localhost:8000` in your browser.

---

## Available Scripts

| Command | What it does |
|---|---|
| `composer run setup` | Full install + migrate (first-time setup) |
| `composer run dev` | Start all dev services |
| `composer run test` | Run the test suite |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint the frontend code |
| `npm run format` | Format frontend files with Prettier |

---

## Project Structure

```
Vheego/
├── app/                  # Laravel controllers, models, services
├── bootstrap/            # App bootstrap files
├── config/               # Laravel config files
├── database/
│   ├── migrations/       # Database schema
│   ├── factories/        # Test data factories
│   └── seeders/          # Seed data
├── public/               # Public assets
├── resources/
│   ├── js/               # React + TypeScript frontend
│   └── views/            # Blade entry point
├── routes/               # Web and API routes
├── storage/              # Logs, file uploads
├── tests/                # Pest test suite
├── .env.example          # Environment template
├── composer.json         # PHP dependencies
├── package.json          # JS dependencies
└── vite.config.ts        # Vite build config
```

---

## Running in Production

Build the frontend assets first:

```bash
npm run build
```

Then run the usual Laravel production steps:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

Make sure you run the queue worker in the background:

```bash
php artisan queue:listen
```

And the Reverb WebSocket server:

```bash
php artisan reverb:start
```

---

## Testing

```bash
composer run test
```

Tests use Pest. You can also run them directly:

```bash
php artisan test
```

---

## Code Style

The frontend uses ESLint and Prettier. Run them before pushing:

```bash
npm run lint
npm run format
```

PHP uses Laravel Pint:

```bash
./vendor/bin/pint
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and write tests
4. Push and open a pull request

---

## License

MIT
