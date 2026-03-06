import AppLayout from '@/layouts/app-layout';
import { ownerDashboard } from '@/routes/owner';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    Calendar,
    Car,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    Star,
    TrendingUp,
    Wallet,
    Zap,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Owner Dashboard',
        href: ownerDashboard().url,
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: any = {
    rented: {
        label: 'Rented',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
    },
    available: {
        label: 'Available',
        bg: 'bg-sky-500/15',
        text: 'text-sky-400',
        dot: 'bg-sky-400',
    },
    maintenance: {
        label: 'Maintenance',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
    },
};

const bookingStatusConfig: any = {
    confirmed: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
    pending: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
};

export default function OwnerDashboard() {
    const totalEarnings = 3750;
    const prevEarnings = 3100;
    const earningsDelta: any = (
        ((totalEarnings - prevEarnings) / prevEarnings) *
        100
    ).toFixed(1);
    const pendingPayout = 1240;
    const activeBookings = 2;
    const occupancyRate = 71;
    // ─── Mock Data (replace with Laravel API calls) ─────────────────────────────

    const earningsData = [
        { month: 'Aug', earnings: 1840, bookings: 12 },
        { month: 'Sep', earnings: 2200, bookings: 15 },
        { month: 'Oct', earnings: 1950, bookings: 13 },
        { month: 'Nov', earnings: 2800, bookings: 18 },
        { month: 'Dec', earnings: 3400, bookings: 22 },
        { month: 'Jan', earnings: 2600, bookings: 17 },
        { month: 'Feb', earnings: 3100, bookings: 20 },
        { month: 'Mar', earnings: 3750, bookings: 24 },
    ];

    const vehicles = [
        {
            id: 1,
            name: 'Toyota Camry 2022',
            plate: 'ABC-1234',
            status: 'rented',
            occupancy: 82,
            earned: 1420,
            rating: 4.8,
            reviews: 34,
            image: '🚗',
            renter: 'John M.',
            returnDate: 'Mar 8',
        },
        {
            id: 2,
            name: 'Honda CR-V 2021',
            plate: 'XYZ-5678',
            status: 'available',
            occupancy: 65,
            earned: 980,
            rating: 4.6,
            reviews: 21,
            image: '🚙',
            renter: null,
            returnDate: null,
        },
        {
            id: 3,
            name: 'BMW 3 Series 2023',
            plate: 'LMN-9012',
            status: 'maintenance',
            occupancy: 45,
            earned: 640,
            rating: 4.9,
            reviews: 12,
            image: '🏎️',
            renter: null,
            returnDate: null,
        },
        {
            id: 4,
            name: 'Ford Ranger 2022',
            plate: 'PQR-3456',
            status: 'rented',
            occupancy: 71,
            earned: 1150,
            rating: 4.5,
            reviews: 18,
            image: '🛻',
            renter: 'Sarah K.',
            returnDate: 'Mar 9',
        },
    ];

    const upcomingBookings = [
        {
            id: 1,
            vehicle: 'Toyota Camry 2022',
            renter: 'Ahmed Al-Farsi',
            avatar: 'A',
            start: 'Mar 10',
            end: 'Mar 14',
            amount: 320,
            status: 'confirmed',
        },
        {
            id: 2,
            vehicle: 'Honda CR-V 2021',
            renter: 'Priya Nair',
            avatar: 'P',
            start: 'Mar 11',
            end: 'Mar 13',
            amount: 180,
            status: 'confirmed',
        },
        {
            id: 3,
            vehicle: 'Ford Ranger 2022',
            renter: 'Marcus Wu',
            avatar: 'M',
            start: 'Mar 12',
            end: 'Mar 15',
            amount: 270,
            status: 'pending',
        },
        {
            id: 4,
            vehicle: 'BMW 3 Series 2023',
            renter: 'Layla Hassan',
            avatar: 'L',
            start: 'Mar 16',
            end: 'Mar 19',
            amount: 480,
            status: 'confirmed',
        },
    ];

    const recentReviews = [
        {
            id: 1,
            vehicle: 'Toyota Camry 2022',
            renter: 'James T.',
            rating: 5,
            comment:
                'Immaculate car, smooth handover. Will definitely book again!',
            date: '2 days ago',
        },
        {
            id: 2,
            vehicle: 'Honda CR-V 2021',
            renter: 'Fatima O.',
            rating: 4,
            comment:
                'Great vehicle, very clean. Pick-up location was a little tricky.',
            date: '5 days ago',
        },
        {
            id: 3,
            vehicle: 'Ford Ranger 2022',
            renter: 'David K.',
            rating: 5,
            comment: 'Perfect for the trip. Owner was very responsive.',
            date: '1 week ago',
        },
    ];

    const payoutHistory = [
        {
            id: 1,
            date: 'Mar 1, 2026',
            amount: 3200,
            status: 'paid',
            ref: 'PAY-20260301',
        },
        {
            id: 2,
            date: 'Feb 1, 2026',
            amount: 2850,
            status: 'paid',
            ref: 'PAY-20260201',
        },
        {
            id: 3,
            date: 'Jan 1, 2026',
            amount: 2100,
            status: 'paid',
            ref: 'PAY-20260101',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Dashboard" />
            {/* ── Main Content ────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Scrollable Body */}
                <main className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                    {/* ── KPI Cards ───────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {/* Total Earnings */}
                        <div className="relative overflow-hidden rounded-2xl border p-5">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-xl bg-amber-500/15 p-2">
                                    <DollarSign
                                        size={18}
                                        className="text-amber-400"
                                    />
                                </div>
                                <span
                                    className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${earningsDelta > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}
                                >
                                    {earningsDelta > 0 ? (
                                        <ArrowUpRight size={12} />
                                    ) : (
                                        <ArrowDownRight size={12} />
                                    )}
                                    {earningsDelta}%
                                </span>
                            </div>
                            <p className="text-2xl font-bold">
                                ${totalEarnings.toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs">
                                Total earnings this month
                            </p>
                        </div>

                        {/* Pending Payout */}
                        <div className="relative overflow-hidden rounded-2xl border p-5">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-xl bg-violet-500/15 p-2">
                                    <Wallet
                                        size={18}
                                        className="text-violet-400"
                                    />
                                </div>
                                <span className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold">
                                    <Clock size={10} />
                                    Processing
                                </span>
                            </div>
                            <p className="text-2xl font-bold">
                                ${pendingPayout.toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs">Pending payout</p>
                        </div>

                        {/* Active Bookings */}
                        <div className="relative overflow-hidden rounded-2xl border p-5">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-xl bg-emerald-500/15 p-2">
                                    <Calendar
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                </div>
                                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-400">
                                    <Zap size={10} />
                                    Live
                                </span>
                            </div>
                            <p className="text-2xl font-bold">
                                {activeBookings}
                            </p>
                            <p className="mt-1 text-xs">
                                Active booking right now
                            </p>
                        </div>

                        {/* Occupancy Rate */}
                        <div className="relative overflow-hidden rounded-2xl border p-5">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent" />
                            <div className="mb-4 flex items-start justify-between">
                                <div className="rounded-xl bg-sky-500/15 p-2">
                                    <TrendingUp
                                        size={18}
                                        className="text-sky-400"
                                    />
                                </div>
                                <span className="text-xs">Fleet avg</span>
                            </div>
                            <p className="text-2xl font-bold">
                                {occupancyRate}%
                            </p>
                            <div className="mt-2">
                                <div className="h-1.5 overflow-hidden rounded-full">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all"
                                        style={{
                                            width: `${occupancyRate}%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="mt-1.5 text-xs">Occupancy rate</p>
                        </div>
                    </div>

                    {/* ── Charts Row ──────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                        {/* Earnings Chart */}
                        <div className="rounded-2xl border p-5 xl:col-span-2">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">
                                        Revenue Overview
                                    </h2>
                                    <p className="mt-0.5 text-xs">
                                        Last 8 months
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block h-0.5 w-3 rounded bg-amber-400" />
                                        Earnings
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block h-0.5 w-3 rounded bg-sky-400" />
                                        Bookings
                                    </span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart
                                    data={earningsData}
                                    margin={{
                                        top: 5,
                                        right: 5,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorEarnings"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#f59e0b"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#f59e0b"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorBookings"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#38bdf8"
                                                stopOpacity={0.2}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#38bdf8"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#27272a"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{
                                            fill: '#71717a',
                                            fontSize: 11,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: '#71717a',
                                            fontSize: 11,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        fill="url(#colorEarnings)"
                                        dot={false}
                                        activeDot={{
                                            r: 4,
                                            fill: '#f59e0b',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bookings"
                                        stroke="#38bdf8"
                                        strokeWidth={2}
                                        fill="url(#colorBookings)"
                                        dot={false}
                                        activeDot={{
                                            r: 4,
                                            fill: '#38bdf8',
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Per-Vehicle Earnings */}
                        <div className="rounded-2xl border p-5">
                            <div className="mb-6">
                                <h2 className="text-sm font-bold">
                                    Earnings by Vehicle
                                </h2>
                                <p className="mt-0.5 text-xs">This month</p>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={vehicles.map((v) => ({
                                        name: v.name.split(' ')[0],
                                        earned: v.earned,
                                    }))}
                                    margin={{
                                        top: 0,
                                        right: 0,
                                        left: -25,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#27272a"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        tick={{
                                            fill: '#71717a',
                                            fontSize: 10,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: '#71717a',
                                            fontSize: 10,
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="earned"
                                        fill="#f59e0b"
                                        radius={[4, 4, 0, 0]}
                                        label={false}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ── Vehicles + Bookings Row ─────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                        {/* Vehicle Cards */}
                        <div className="rounded-2xl border p-5 xl:col-span-3">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">
                                        Vehicle Performance
                                    </h2>
                                    <p className="mt-0.5 text-xs">
                                        {vehicles.length} vehicles in fleet
                                    </p>
                                </div>
                                <button className="flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300">
                                    Manage <ChevronRight size={12} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {vehicles.map((v) => (
                                    <div
                                        key={v.id}
                                        className="group /40 flex items-center gap-4 rounded-xl border border-zinc-700/30 p-3.5 transition-colors hover:border-zinc-600/50"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-2xl">
                                            {v.image}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-sm font-semibold">
                                                    {v.name}
                                                </p>
                                                <StatusBadge
                                                    status={v.status}
                                                />
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-4">
                                                <span className="text-xs">
                                                    {v.plate}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Star
                                                        size={10}
                                                        className="fill-amber-400 text-amber-400"
                                                    />
                                                    {v.rating} ({v.reviews})
                                                </span>
                                                <span className="text-xs font-semibold">
                                                    ${v.earned.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-700">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                                                        style={{
                                                            width: `${v.occupancy}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="shrink-0 text-xs">
                                                    {v.occupancy}% occ.
                                                </span>
                                            </div>
                                        </div>
                                        {v.status === 'rented' && (
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs">
                                                    Returns
                                                </p>
                                                <p className="text-xs font-semibold text-emerald-400">
                                                    {v.returnDate}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Bookings */}
                        <div className="rounded-2xl border p-5 xl:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">
                                        Upcoming Bookings
                                    </h2>
                                    <p className="mt-0.5 text-xs">
                                        Next 14 days
                                    </p>
                                </div>
                                <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-400">
                                    {upcomingBookings.length}
                                </span>
                            </div>
                            <div className="space-y-2.5">
                                {upcomingBookings.map((b) => (
                                    <div
                                        key={b.id}
                                        className="/40 flex items-start gap-3 rounded-xl border border-zinc-700/30 p-3"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold">
                                            {b.avatar}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="truncate text-xs font-semibold">
                                                    {b.renter}
                                                </p>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${bookingStatusConfig[b.status].bg} ${bookingStatusConfig[b.status].text}`}
                                                >
                                                    {b.status}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs">
                                                {b.vehicle}
                                            </p>
                                            <div className="mt-1.5 flex items-center justify-between">
                                                <span className="flex items-center gap-1 text-xs">
                                                    <Calendar size={10} />
                                                    {b.start} – {b.end}
                                                </span>
                                                <span className="text-xs font-bold text-amber-400">
                                                    ${b.amount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Reviews + Payout Row ────────────────────────────────── */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        {/* Recent Reviews */}
                        <div className="rounded-2xl border p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">
                                        Recent Reviews
                                    </h2>
                                    <p className="mt-0.5 text-xs">
                                        From your renters
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5">
                                    <Star
                                        size={12}
                                        className="fill-amber-400 text-amber-400"
                                    />
                                    <span className="text-xs font-bold text-amber-400">
                                        4.7 avg
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {recentReviews.map((r) => (
                                    <div
                                        key={r.id}
                                        className="/40 rounded-xl border border-zinc-700/30 p-3.5"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold">
                                                    {r.renter}
                                                </p>
                                                <Stars rating={r.rating} />
                                            </div>
                                            <span className="text-xs">
                                                {r.date}
                                            </span>
                                        </div>
                                        <p className="text-xs leading-relaxed">
                                            "{r.comment}"
                                        </p>
                                        <p className="mt-2 flex items-center gap-1 text-xs">
                                            <Car size={10} /> {r.vehicle}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payout History */}
                        <div className="rounded-2xl border p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold">
                                        Payout History
                                    </h2>
                                    <p className="mt-0.5 text-xs">
                                        Recent transfers
                                    </p>
                                </div>
                                <button className="flex items-center gap-1 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300">
                                    All payouts <ChevronRight size={12} />
                                </button>
                            </div>

                            {/* Pending Banner */}
                            <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-amber-500/20 p-2">
                                        <Clock
                                            size={14}
                                            className="text-amber-400"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold">
                                            Pending Payout
                                        </p>
                                        <p className="text-xs">
                                            Expected Apr 1, 2026
                                        </p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-amber-400">
                                    ${pendingPayout.toLocaleString()}
                                </p>
                            </div>

                            {/* History Table */}
                            <div className="space-y-2">
                                {payoutHistory.map((p) => (
                                    <div
                                        key={p.id}
                                        className="group /30 hover:/60 flex items-center justify-between rounded-xl px-3.5 py-3 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-emerald-500/15 p-1.5">
                                                <CheckCircle
                                                    size={13}
                                                    className="text-emerald-400"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold">
                                                    {p.date}
                                                </p>
                                                <p className="text-xs">
                                                    {p.ref}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">
                                                ${p.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs font-semibold text-emerald-400 capitalize">
                                                {p.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}

function StatusBadge({ status }: any) {
    const c = statusConfig[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function Stars({ rating }: any) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    size={12}
                    className={
                        i <= Math.round(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : ''
                    }
                />
            ))}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
        return (
            <div className="rounded-xl border border-zinc-700/60 bg-zinc-900 px-4 py-3 shadow-2xl">
                <p className="mb-2 text-xs font-medium">{label}</p>
                {payload.map((p: any, i: any) => (
                    <p
                        key={i}
                        className="text-sm font-bold"
                        style={{ color: p.color }}
                    >
                        {p.name === 'earnings'
                            ? `$${p.value.toLocaleString()}`
                            : `${p.value} bookings`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};
