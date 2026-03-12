import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BadgePercent, Banknote, Car, TrendingUp } from 'lucide-react';
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

// ── Types ─────────────────────────────────────────────────────────────────────

interface CommissionSummary {
    total_gross: number;
    total_commission: number;
    total_net: number;
    total_booking_revenue: number;
    commission_rate: number;
}

interface MonthlyStat {
    month: string;
    gross: number;
    commission: number;
    net: number;
    bookings: number;
}

interface VehicleStat {
    id: number;
    name: string;
    vehicle_type: string;
    license_plate: string;
    status: string;
    gross_revenue: number;
    net_revenue: number;
    total_bookings: number;
    completed: number;
    daily_rate: number;
}

interface Props {
    commission_summary: CommissionSummary;
    monthly_stats: MonthlyStat[];
    vehicle_stats: VehicleStat[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-zinc-700/60 bg-zinc-900 px-4 py-3 shadow-2xl">
            <p className="mb-2 text-xs font-semibold text-zinc-300">{label}</p>
            {payload.map((p: any, i: number) => (
                <p
                    key={i}
                    className="text-xs font-bold"
                    style={{ color: p.color }}
                >
                    {p.name === 'bookings'
                        ? `${p.value} bookings`
                        : formatCurrency(p.value)}{' '}
                    <span className="font-normal text-zinc-400">
                        {p.name === 'gross'
                            ? 'gross'
                            : p.name === 'net'
                              ? 'net'
                              : p.name === 'commission'
                                ? 'commission'
                                : ''}
                    </span>
                </p>
            ))}
        </div>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/owner/dashboard' },
    { title: 'Revenue', href: '/owner/revenue' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function OwnerRevenue({
    commission_summary: cs,
    monthly_stats,
    vehicle_stats,
}: Props) {
    const maxVehicleRevenue = Math.max(
        ...vehicle_stats.map((v) => v.gross_revenue),
        1,
    );

    // Commission % actually paid vs expected
    const effectiveRate =
        cs.total_gross > 0
            ? ((cs.total_commission / cs.total_gross) * 100).toFixed(1)
            : cs.commission_rate.toFixed(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Revenue
                    </h1>
                    <p className="mt-0.5 text-xs text-zinc-400">
                        All-time earnings and commission breakdown
                    </p>
                </div>

                {/* Commission summary cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        {
                            label: 'Total Gross',
                            value: formatCurrency(cs.total_gross),
                            sub: 'from all bookings',
                            icon: TrendingUp,
                            color: 'text-sky-400',
                            bg: 'bg-sky-500/10',
                            gradient: 'from-sky-500/5',
                        },
                        {
                            label: 'Commission Paid',
                            value: formatCurrency(cs.total_commission),
                            sub: `${effectiveRate}% effective rate`,
                            icon: BadgePercent,
                            color: 'text-red-400',
                            bg: 'bg-red-500/10',
                            gradient: 'from-red-500/5',
                        },
                        {
                            label: 'Net Earned',
                            value: formatCurrency(cs.total_net),
                            sub: 'after commission',
                            icon: Banknote,
                            color: 'text-emerald-400',
                            bg: 'bg-emerald-500/10',
                            gradient: 'from-emerald-500/5',
                        },
                        {
                            label: 'Total Vehicles',
                            value: vehicle_stats.length,
                            sub: `${vehicle_stats.filter((v) => v.status === 'Active').length} active`,
                            icon: Car,
                            color: 'text-amber-400',
                            bg: 'bg-amber-500/10',
                            gradient: 'from-amber-500/5',
                        },
                    ].map(
                        ({
                            label,
                            value,
                            sub,
                            icon: Icon,
                            color,
                            bg,
                            gradient,
                        }) => (
                            <div
                                key={label}
                                className="relative overflow-hidden rounded-2xl border border-zinc-700/40 p-5"
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} to-transparent`}
                                />
                                <div
                                    className={`mb-3 inline-flex rounded-xl p-2 ${bg}`}
                                >
                                    <Icon size={16} className={color} />
                                </div>
                                <p className="text-2xl font-bold">{value}</p>
                                <p className="mt-0.5 text-xs text-zinc-400">
                                    {label}
                                </p>
                                <p className="mt-1 text-[10px] text-zinc-500">
                                    {sub}
                                </p>
                            </div>
                        ),
                    )}
                </div>

                {/* Commission rate visual */}
                <div className="rounded-2xl border border-zinc-700/40 p-5">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold">
                                Commission Breakdown
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Your rate:{' '}
                                <span className="font-semibold text-amber-400">
                                    {cs.commission_rate}%
                                </span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-400">You keep</p>
                            <p className="text-sm font-bold text-emerald-400">
                                {(100 - cs.commission_rate).toFixed(0)}%
                            </p>
                        </div>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-zinc-800">
                        {/* Net portion */}
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                            style={{ width: `${100 - cs.commission_rate}%` }}
                        />
                        {/* Commission portion */}
                        <div
                            className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all"
                            style={{ width: `${cs.commission_rate}%` }}
                        />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="flex items-center gap-1">
                            <span className="inline-block h-1.5 w-3 rounded-full bg-emerald-500" />
                            Net ({formatCurrency(cs.total_net)})
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="inline-block h-1.5 w-3 rounded-full bg-red-500" />
                            Platform ({formatCurrency(cs.total_commission)})
                        </span>
                    </div>
                </div>

                {/* Monthly charts */}
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {/* Revenue over time */}
                    <div className="rounded-2xl border border-zinc-700/40 p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">
                                    Revenue Over Time
                                </p>
                                <p className="mt-0.5 text-xs text-zinc-400">
                                    Gross vs net — last 12 months
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block h-0.5 w-3 rounded bg-sky-400" />
                                    Gross
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block h-0.5 w-3 rounded bg-emerald-400" />
                                    Net
                                </span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                                data={monthly_stats}
                                margin={{
                                    top: 4,
                                    right: 4,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="grossGrad"
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
                                    <linearGradient
                                        id="netGrad"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#34d399"
                                            stopOpacity={0.25}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#34d399"
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
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) =>
                                        `${(v / 1000).toFixed(0)}k`
                                    }
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="gross"
                                    stroke="#38bdf8"
                                    strokeWidth={2}
                                    fill="url(#grossGrad)"
                                    dot={false}
                                    activeDot={{ r: 3, fill: '#38bdf8' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="net"
                                    stroke="#34d399"
                                    strokeWidth={2}
                                    fill="url(#netGrad)"
                                    dot={false}
                                    activeDot={{ r: 3, fill: '#34d399' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Bookings vs Revenue */}
                    <div className="rounded-2xl border border-zinc-700/40 p-5">
                        <div className="mb-5">
                            <p className="text-sm font-semibold">
                                Bookings vs Revenue
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-400">
                                Volume and value — last 12 months
                            </p>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart
                                data={monthly_stats}
                                margin={{
                                    top: 4,
                                    right: 4,
                                    left: -20,
                                    bottom: 0,
                                }}
                                barGap={3}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#27272a"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    yAxisId="gross"
                                    orientation="left"
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) =>
                                        `${(v / 1000).toFixed(0)}k`
                                    }
                                    width={36}
                                />
                                <YAxis
                                    yAxisId="bookings"
                                    orientation="right"
                                    tick={{ fill: '#71717a', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={24}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    yAxisId="gross"
                                    dataKey="gross"
                                    fill="#f59e0b"
                                    radius={[3, 3, 0, 0]}
                                    maxBarSize={20}
                                />
                                <Bar
                                    yAxisId="bookings"
                                    dataKey="bookings"
                                    fill="#71717a"
                                    opacity={0.4}
                                    radius={[3, 3, 0, 0]}
                                    maxBarSize={10}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Per-vehicle breakdown */}
                <div className="rounded-2xl border border-zinc-700/40 p-5">
                    <div className="mb-4">
                        <p className="text-sm font-semibold">
                            Revenue by Vehicle
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            All-time gross, sorted by earnings
                        </p>
                    </div>

                    {vehicle_stats.length === 0 ? (
                        <p className="py-8 text-center text-xs text-zinc-500">
                            No vehicles found.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {vehicle_stats.map((v) => {
                                const pct = Math.round(
                                    (v.gross_revenue / maxVehicleRevenue) * 100,
                                );
                                const completionRate =
                                    v.total_bookings > 0
                                        ? Math.round(
                                              (v.completed / v.total_bookings) *
                                                  100,
                                          )
                                        : 0;

                                return (
                                    <div
                                        key={v.id}
                                        className="rounded-xl border border-zinc-700/30 p-4 transition hover:border-zinc-600/50"
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                                                    <Car
                                                        size={15}
                                                        className="text-zinc-400"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold">
                                                        {v.name}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-500">
                                                        {v.license_plate} ·{' '}
                                                        {v.vehicle_type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-bold text-amber-400">
                                                    {formatCurrency(
                                                        v.gross_revenue,
                                                    )}
                                                </p>
                                                <p className="text-[10px] text-zinc-500">
                                                    net{' '}
                                                    {formatCurrency(
                                                        v.net_revenue,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Revenue bar */}
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="shrink-0 text-[10px] text-zinc-500">
                                                {pct}% of top
                                            </span>
                                        </div>

                                        {/* Stats row */}
                                        <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-500">
                                            <span>
                                                {v.total_bookings} bookings
                                            </span>
                                            <span>{v.completed} completed</span>
                                            <span>
                                                {completionRate}% completion
                                            </span>
                                            <span className="ml-auto">
                                                {formatCurrency(v.daily_rate)}
                                                /day
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
