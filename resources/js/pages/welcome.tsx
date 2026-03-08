import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Car,
    CheckCircle,
    ChevronRight,
    CreditCard,
    MapPin,
    Menu,
    Search,
    Shield,
    Star,
    TrendingUp,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   All colours are shadcn CSS-variable classes.
   Change your shadcn theme → this page updates.
   ───────────────────────────────────────────── */

const IMAGES = {
    hero: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=90&auto=format&fit=crop',
    car1: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop',
    car2: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop',
    car3: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop',
    car4: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop',
    car5: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    car6: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80&auto=format&fit=crop',
    owner: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=85&auto=format&fit=crop',
};

const LISTINGS = [
    {
        id: 1,
        img: IMAGES.car1,
        name: 'BMW M4 Competition',
        location: 'Downtown',
        price: 185,
        rating: 4.9,
        trips: 63,
        tag: 'Top Rated',
    },
    {
        id: 2,
        img: IMAGES.car2,
        name: 'Porsche 911 Carrera',
        location: 'Airport',
        price: 240,
        rating: 4.8,
        trips: 41,
        tag: 'Luxury',
    },
    {
        id: 3,
        img: IMAGES.car3,
        name: 'Tesla Model 3',
        location: 'Midtown',
        price: 95,
        rating: 4.9,
        trips: 127,
        tag: 'Popular',
    },
    {
        id: 4,
        img: IMAGES.car4,
        name: 'Mercedes C-Class',
        location: 'Westside',
        price: 130,
        rating: 4.7,
        trips: 88,
        tag: null,
    },
    {
        id: 5,
        img: IMAGES.car5,
        name: 'Audi RS7',
        location: 'Harbor',
        price: 210,
        rating: 4.8,
        trips: 35,
        tag: 'New',
    },
    {
        id: 6,
        img: IMAGES.car6,
        name: 'Ford Mustang GT',
        location: 'Uptown',
        price: 115,
        rating: 4.6,
        trips: 74,
        tag: null,
    },
];

const STATS = [
    { value: '12,000+', label: 'Vehicles Listed' },
    { value: '98,000+', label: 'Happy Renters' },
    { value: '340+', label: 'Cities Covered' },
    { value: '4.9★', label: 'Average Rating' },
];

const HOW = [
    {
        icon: Search,
        step: '01',
        title: 'Search & Filter',
        desc: 'Browse thousands of verified vehicles by location, date, type, and budget.',
    },
    {
        icon: Shield,
        step: '02',
        title: 'Book Securely',
        desc: 'Every booking is protected. Secure payments, full insurance coverage included.',
    },
    {
        icon: Car,
        step: '03',
        title: 'Drive & Enjoy',
        desc: 'Pick up your keys and hit the road. Return hassle-free when your trip ends.',
    },
];

const OWNER_PERKS = [
    'Set your own price and availability',
    'Get paid within 24 hours of trip end',
    'Full insurance coverage on every trip',
    'Dedicated owner support team',
    'Real-time booking notifications',
    'Transparent payout dashboard',
];

function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.12 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return { ref, visible };
}

function Reveal({
    children,
    delay = 0,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const { ref, visible } = useScrollReveal();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default function Welcome({ auth }: any) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchLocation, setSearchLocation] = useState('');

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', fn);
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <>
            <Head title="Vheego — Find Your Perfect Ride" />

            {/* ── Google Fonts ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

                body { font-family: 'Outfit', sans-serif; }
                .font-display { font-family: 'Cormorant Garamond', serif; }

                @keyframes heroReveal {
                    from { opacity: 0; transform: translateY(40px); }
                    to   { opacity: 1; transform: translateY(0);     }
                }
                .hero-line-1 { animation: heroReveal .9s ease .1s both; }
                .hero-line-2 { animation: heroReveal .9s ease .3s both; }
                .hero-line-3 { animation: heroReveal .9s ease .5s both; }
                .hero-line-4 { animation: heroReveal .9s ease .7s both; }

                @keyframes kenBurns {
                    0%   { transform: scale(1.05); }
                    100% { transform: scale(1.12); }
                }
                .hero-img { animation: kenBurns 12s ease-in-out infinite alternate; }

                .card-hover {
                    transition: transform .35s ease, box-shadow .35s ease;
                }
                .card-hover:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 24px 48px -12px hsl(var(--foreground) / .12);
                }

                .shine {
                    position: relative;
                    overflow: hidden;
                }
                .shine::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 40%, hsl(var(--background) / .15) 50%, transparent 60%);
                    transform: translateX(-100%);
                    transition: transform .6s ease;
                }
                .shine:hover::after { transform: translateX(100%); }

                .tag-badge {
                    font-size: 10px;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    font-weight: 600;
                }
            `}</style>

            <div className="min-h-screen bg-background text-foreground">
                {/* ════════════════════════════════
                    NAV
                ════════════════════════════════ */}
                <nav
                    className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
                    style={{
                        background: scrolled
                            ? 'hsl(var(--background) / .95)'
                            : 'transparent',
                        backdropFilter: scrolled ? 'blur(16px)' : 'none',
                        borderBottom: scrolled
                            ? '1px solid hsl(var(--border))'
                            : 'none',
                    }}
                >
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <Car
                                    size={16}
                                    className="text-primary-foreground"
                                />
                            </div>
                            <span className="font-display text-xl font-semibold text-white">
                                Vheego
                            </span>
                        </div>

                        {/* Desktop links */}
                        <div className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
                            <a
                                href="#how-it-works"
                                className="transition-colors hover:text-foreground"
                            >
                                How it Works
                            </a>
                            <a
                                href="#listings"
                                className="transition-colors hover:text-foreground"
                            >
                                Browse Cars
                            </a>
                            <a
                                href="#owners"
                                className="transition-colors hover:text-foreground"
                            >
                                List Your Car
                            </a>
                        </div>

                        {/* CTA */}
                        <div className="hidden items-center gap-3 md:flex">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-white transition-colors hover:text-foreground"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-medium text-white transition-colors hover:text-foreground"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="shine inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                    >
                                        Get Started <ArrowRight size={14} />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            className="p-2 text-foreground md:hidden"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>

                    {/* Mobile menu */}
                    {menuOpen && (
                        <div className="space-y-3 border-t border-border bg-background px-6 py-4 md:hidden">
                            {['#how-it-works', '#listings', '#owners'].map(
                                (href, i) => (
                                    <a
                                        key={href}
                                        href={href}
                                        onClick={() => setMenuOpen(false)}
                                        className="block py-1 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        {
                                            [
                                                'How it Works',
                                                'Browse Cars',
                                                'List Your Car',
                                            ][i]
                                        }
                                    </a>
                                ),
                            )}
                            <div className="flex gap-3 pt-2">
                                <Link
                                    href="/login"
                                    className="flex-1 rounded-full border border-border py-2 text-center text-sm text-white"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 rounded-full bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ════════════════════════════════
                    HERO
                ════════════════════════════════ */}
                <section className="relative flex h-screen min-h-[700px] items-center overflow-hidden">
                    {/* Image */}
                    <div className="absolute inset-0">
                        <img
                            src={IMAGES.hero}
                            alt="Hero vehicle"
                            className="hero-img h-full w-full object-cover"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to right, hsl(var(--background) / .88) 0%, hsl(var(--background) / .55) 55%, hsl(var(--background) / .2) 100%)',
                            }}
                        />
                    </div>

                    <div className="relative mx-auto w-full max-w-7xl px-6">
                        <div className="max-w-2xl">
                            <div className="hero-line-1 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-primary uppercase">
                                <Zap size={11} /> Thousands of vehicles. One
                                platform.
                            </div>

                            <h1 className="font-display mb-6 leading-[1.05] font-bold text-white">
                                <span className="hero-line-2 block text-5xl sm:text-6xl lg:text-7xl">
                                    Drive What You
                                </span>
                                <span className="hero-line-3 block text-5xl italic sm:text-6xl lg:text-7xl">
                                    Actually Want.
                                </span>
                            </h1>

                            <p className="hero-line-4 mb-10 max-w-lg text-lg leading-relaxed text-white">
                                Rent premium vehicles from verified local
                                owners. Transparent pricing, full insurance, and
                                a fleet that fits any occasion.
                            </p>

                            {/* Search bar */}
                            {/* <div className="hero-line-4 flex flex-col sm:flex-row gap-3 max-w-xl">
                                <div className="flex-1 flex items-center gap-3 bg-background border border-border rounded-2xl px-4 py-3 shadow-lg">
                                    <MapPin size={16} className="text-muted-foreground shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="City, airport, or address…"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                    />
                                </div>
                                <Link
                                    href={`/vehicles?location=${encodeURIComponent(searchLocation)}`}
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-7 py-3 rounded-2xl hover:opacity-90 transition-opacity whitespace-nowrap shine shadow-lg"
                                >
                                    Find Cars <ArrowRight size={16} />
                                </Link>
                            </div> */}

                            {/* Trust markers */}
                            <div className="hero-line-4 mt-7 flex items-center gap-6">
                                {[
                                    { icon: Shield, label: 'Fully Insured' },
                                    { icon: Star, label: '4.9★ Rated' },
                                    { icon: Zap, label: 'Instant Booking' },
                                ].map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        className="flex items-center gap-1.5 text-xs text-white"
                                    >
                                        <Icon
                                            size={13}
                                            className="text-white"
                                        />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    STATS
                ════════════════════════════════ */}
                <section className="border-y border-border bg-muted/40">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 lg:grid-cols-4">
                        {STATS.map(({ value, label }, i) => (
                            <Reveal
                                key={label}
                                delay={i * 80}
                                className="text-center"
                            >
                                <div className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                                    {value}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {label}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* ════════════════════════════════
                    HOW IT WORKS
                ════════════════════════════════ */}
                <section id="how-it-works" className="px-6 py-24">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-16 text-center">
                            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                Simple Process
                            </p>
                            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                                Rent in three steps.
                            </h2>
                        </Reveal>

                        <div className="relative grid gap-8 md:grid-cols-3">
                            {/* Connector line (desktop) */}
                            <div className="absolute top-10 right-[calc(16.6%+1rem)] left-[calc(16.6%+1rem)] hidden h-px border-t border-dashed border-border md:block" />

                            {HOW.map(({ icon: Icon, step, title, desc }, i) => (
                                <Reveal key={title} delay={i * 120}>
                                    <div className="card-hover relative rounded-3xl border border-border bg-card p-8">
                                        <div className="absolute -top-4 left-8 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                                            {step}
                                        </div>
                                        <div className="mt-2 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                                            <Icon
                                                size={22}
                                                className="text-foreground"
                                            />
                                        </div>
                                        <h3 className="mb-2 text-lg font-semibold text-foreground">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    LISTINGS GRID
                ════════════════════════════════ */}
                <section id="listings" className="bg-muted/30 px-6 py-24">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                    Featured Vehicles
                                </p>
                                <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                                    Handpicked for you.
                                </h2>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                            >
                                View All <ChevronRight size={14} />
                            </Link>
                        </Reveal>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {LISTINGS.map((car, i) => (
                                <Reveal key={car.id} delay={i * 70}>
                                    <div className="card-hover group overflow-hidden rounded-3xl border border-border bg-card">
                                        {/* Image */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={car.img}
                                                alt={car.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {car.tag && (
                                                <span className="tag-badge absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-primary-foreground">
                                                    {car.tag}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <div className="mb-2 flex items-start justify-between gap-2">
                                                <h3 className="leading-tight font-semibold text-foreground">
                                                    {car.name}
                                                </h3>
                                                <div className="shrink-0 text-right">
                                                    <span className="font-bold text-foreground">
                                                        ${car.price}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        /day
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={11} />{' '}
                                                    {car.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Star
                                                        size={11}
                                                        className="fill-foreground text-foreground"
                                                    />
                                                    {car.rating} · {car.trips}{' '}
                                                    trips
                                                </span>
                                            </div>
                                            <Link
                                                href={`/login`}
                                                className="shine mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                            >
                                                Book Now{' '}
                                                <ArrowRight size={13} />
                                            </Link>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    OWNER SECTION
                ════════════════════════════════ */}
                <section id="owners" className="overflow-hidden px-6 py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid min-h-[520px] overflow-hidden rounded-[2.5rem] bg-foreground lg:grid-cols-2">
                            {/* Image */}
                            <div className="relative order-2 h-64 overflow-hidden lg:order-1 lg:h-auto">
                                <img
                                    src={IMAGES.owner}
                                    alt="Car owner"
                                    className="h-full w-full object-cover opacity-80"
                                />
                                {/* Floating earnings card */}
                                <div className="absolute bottom-6 left-6 rounded-2xl border border-border bg-background/95 px-5 py-4 shadow-2xl backdrop-blur-sm">
                                    <p className="mb-0.5 text-xs text-muted-foreground">
                                        Last month earnings
                                    </p>
                                    <p className="font-display text-2xl font-bold text-foreground">
                                        $3,840
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                        <TrendingUp
                                            size={11}
                                            className="text-emerald-500"
                                        />
                                        <span className="font-medium text-emerald-500">
                                            +18%
                                        </span>{' '}
                                        vs previous
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="order-1 flex flex-col justify-center p-10 lg:order-2 lg:p-14">
                                <p className="mb-4 text-xs font-semibold tracking-widest text-background/60 uppercase">
                                    For Vehicle Owners
                                </p>
                                <h2 className="font-display mb-6 text-4xl leading-[1.05] font-bold text-background sm:text-5xl">
                                    Your car earns while you don't drive.
                                </h2>
                                <p className="mb-8 max-w-md text-sm leading-relaxed text-background/70">
                                    List your vehicle on DriveHub and start
                                    earning passive income. Join thousands of
                                    owners making an average of $1,200/month.
                                </p>
                                <ul className="mb-10 space-y-3">
                                    {OWNER_PERKS.map((perk) => (
                                        <li
                                            key={perk}
                                            className="flex items-center gap-3 text-sm text-background/80"
                                        >
                                            <CheckCircle
                                                size={15}
                                                className="shrink-0 text-background"
                                            />
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/register"
                                    className="shine inline-flex items-center gap-2 self-start rounded-full bg-background px-7 py-3.5 font-semibold text-foreground transition-opacity hover:opacity-90"
                                >
                                    Start Listing <ArrowRight size={15} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    TRUST FEATURES
                ════════════════════════════════ */}
                <section className="bg-muted/30 px-6 py-24">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-16 text-center">
                            <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                                Why Vheego
                            </p>
                            <h2 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
                                Built on trust.
                            </h2>
                        </Reveal>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Full Insurance',
                                    desc: 'Every trip is covered up to $1M liability. Drive with peace of mind.',
                                },
                                {
                                    icon: Users,
                                    title: 'Verified Owners',
                                    desc: 'All hosts are identity-verified and background-checked before listing.',
                                },
                                {
                                    icon: CreditCard,
                                    title: 'Secure Payments',
                                    desc: 'Encrypted transactions, fraud protection, and instant refunds on cancellations.',
                                },
                                {
                                    icon: Zap,
                                    title: '24/7 Support',
                                    desc: "Real human support around the clock. On the road or off, we've got you.",
                                },
                            ].map(({ icon: Icon, title, desc }, i) => (
                                <Reveal key={title} delay={i * 80}>
                                    <div className="card-hover h-full rounded-3xl border border-border bg-card p-7">
                                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
                                            <Icon
                                                size={20}
                                                className="text-primary-foreground"
                                            />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ════════════════════════════════
                    CTA BANNER
                ════════════════════════════════ */}
                <section className="px-6 py-24">
                    <div className="mx-auto max-w-4xl">
                        <Reveal>
                            <div
                                className="relative overflow-hidden rounded-[2.5rem] px-10 py-16 text-center"
                                style={{ background: 'hsl(var(--foreground))' }}
                            >
                                {/* Decorative circles */}
                                <div
                                    className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-5"
                                    style={{
                                        background: 'hsl(var(--background))',
                                    }}
                                />
                                <div
                                    className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full opacity-5"
                                    style={{
                                        background: 'hsl(var(--background))',
                                    }}
                                />

                                <p
                                    className="mb-4 text-xs font-semibold tracking-widest uppercase"
                                    style={{
                                        color: 'hsl(var(--background) / .55)',
                                    }}
                                >
                                    Ready to go?
                                </p>
                                <h2
                                    className="font-display mb-5 text-4xl leading-tight font-bold sm:text-5xl"
                                    style={{ color: 'hsl(var(--background))' }}
                                >
                                    Your next adventure starts here.
                                </h2>
                                <p
                                    className="mx-auto mb-9 max-w-md text-sm leading-relaxed"
                                    style={{
                                        color: 'hsl(var(--background) / .65)',
                                    }}
                                >
                                    Join over 98,000 renters who found their
                                    perfect drive on Vheego. Sign up free — no
                                    commitments.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        href="/register"
                                        className="shine inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-semibold"
                                        style={{
                                            background:
                                                'hsl(var(--background))',
                                            color: 'hsl(var(--foreground))',
                                        }}
                                    >
                                        Create Free Account{' '}
                                        <ArrowRight size={15} />
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 rounded-full border px-8 py-3.5 text-sm font-medium transition-colors"
                                        style={{
                                            borderColor:
                                                'hsl(var(--background) / .25)',
                                            color: 'hsl(var(--background) / .75)',
                                        }}
                                    >
                                        Browse Cars
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ════════════════════════════════
                    FOOTER
                ════════════════════════════════ */}
                <footer className="border-t border-border bg-muted/20">
                    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Brand */}
                        <div className="lg:col-span-1">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                    <Car
                                        size={15}
                                        className="text-primary-foreground"
                                    />
                                </div>
                                <span className="font-display text-xl font-semibold text-foreground">
                                    Vheego
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                The smarter way to rent and list vehicles.
                                Transparent, trusted, and built for everyone.
                            </p>
                        </div>

                        {[
                            {
                                title: 'Renters',
                                links: [
                                    'Browse Vehicles',
                                    'How it Works',
                                    'Insurance',
                                    'Help Centre',
                                ],
                            },
                            {
                                title: 'Owners',
                                links: [
                                    'List Your Car',
                                    'Earnings Calculator',
                                    'Owner Dashboard',
                                    'Payouts',
                                ],
                            },
                            {
                                title: 'Company',
                                links: [
                                    'About Us',
                                    'Careers',
                                    'Press',
                                    'Privacy Policy',
                                ],
                            },
                        ].map(({ title, links }) => (
                            <div key={title}>
                                <h4 className="mb-4 text-xs font-semibold tracking-widest text-foreground uppercase">
                                    {title}
                                </h4>
                                <ul className="space-y-2.5">
                                    {links.map((l) => (
                                        <li key={l}>
                                            <a
                                                href="#"
                                                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {l}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row">
                            <span>
                                © {new Date().getFullYear()} Vheego. All rights
                                reserved.
                            </span>
                            <div className="flex gap-5">
                                <a
                                    href="#"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Terms
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="#"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
