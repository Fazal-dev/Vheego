import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency, isUp, pct } from '@/lib/utils';
import admin from '@/routes/admin';
import { AdminDashbordProps, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    BookOpen,
    Car,
    Clock,
    DollarSign,
    TrendingDown,
    TrendingUp,
    Users,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function Delta({ current, previous }: { current: number; previous: number }) {
    const up = isUp(current, previous);
    return (
        <span
            className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}
        >
            {up ? (
                <TrendingUp className="h-3 w-3" />
            ) : (
                <TrendingDown className="h-3 w-3" />
            )}
            {pct(current, previous)} vs last month
        </span>
    );
}

// Booking status badge
const bookingStatusConfig: Record<
    string,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
    }
> = {
    Pending: { label: 'Pending', variant: 'outline' },
    Booked: { label: 'Booked', variant: 'secondary' },
    OnTrip: { label: 'On Trip', variant: 'default' },
    Cancelled: { label: 'Cancelled', variant: 'destructive' },
    Completed: { label: 'Completed', variant: 'secondary' },
};

const paymentStatusConfig: Record<
    string,
    { label: string; className: string }
> = {
    paid: {
        label: 'Paid',
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    failed: {
        label: 'Failed',
        className: 'bg-red-100 text-red-700 border-red-200',
    },
    refunded: {
        label: 'Refunded',
        className: 'bg-slate-100 text-slate-600 border-slate-200',
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: admin.adminDashboard.url(),
    },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Dashboard({
    stats,
    monthly_revenue,
    booking_status_counts,
    recent_bookings,
}: AdminDashbordProps) {
    const statCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.total_revenue),
            sub: (
                <Delta
                    current={stats.revenue_this_month}
                    previous={stats.revenue_last_month}
                />
            ),
            description: `${formatCurrency(stats.revenue_this_month)} this month`,
            icon: DollarSign,
        },
        {
            title: 'Total Bookings',
            value: stats.total_bookings.toLocaleString(),
            sub: (
                <Delta
                    current={stats.bookings_this_month}
                    previous={stats.bookings_last_month}
                />
            ),
            description: `${stats.bookings_this_month} this month`,
            icon: BookOpen,
        },
        {
            title: 'Active Vehicles',
            value: stats.active_vehicles.toLocaleString(),
            sub: (
                <span className="text-xs text-muted-foreground">
                    {stats.total_owners} registered owners
                </span>
            ),
            description: `${stats.pending_approvals} pending approval`,
            icon: Car,
        },
        {
            title: 'Total Users',
            value: stats.total_users.toLocaleString(),
            sub: (
                <Delta
                    current={stats.new_users_this_month}
                    previous={stats.new_users_last_month}
                />
            ),
            description: `${stats.new_users_this_month} new this month`,
            icon: Users,
        },
    ];

    // Pending approvals banner — only show if there are any
    const hasPending = stats.pending_approvals > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Page title */}
                {/* <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Platform overview and key metrics
                    </p>
                </div> */}

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                    {statCards.map(
                        ({ title, value, sub, description, icon: Icon }) => (
                            <Card key={title} className="gap-2">
                                <CardHeader className="flex flex-row items-center justify-between pb-1">
                                    <CardDescription className="text-xs font-medium">
                                        {title}
                                    </CardDescription>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <p className="mb-1 text-2xl leading-none font-bold tracking-tight">
                                        {value}
                                    </p>
                                    {sub}
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {description}
                                    </p>
                                </CardContent>
                            </Card>
                        ),
                    )}
                </div>

                {/* Pending approvals alert */}
                {hasPending && (
                    <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                            <span className="font-semibold">
                                {stats.pending_approvals} vehicle
                                {stats.pending_approvals > 1 ? 's' : ''}
                            </span>{' '}
                            awaiting your approval.
                        </span>
                        <Link
                            href={admin.vehicleApproval.url()}
                            className="ml-auto text-xs font-medium underline underline-offset-2 hover:opacity-80"
                        >
                            Review now →
                        </Link>
                    </div>
                )}

                {/* Charts row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Monthly revenue chart — takes 2/3 */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                                Revenue & Bookings
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Last 6 months
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6">
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart
                                    data={monthly_revenue}
                                    barGap={4}
                                    margin={{
                                        left: 0,
                                        right: 16,
                                        top: 4,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        vertical={false}
                                        strokeDasharray="3 3"
                                        className="stroke-border"
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{
                                            fontSize: 11,
                                            fill: 'var(--muted-foreground)',
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="revenue"
                                        orientation="left"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fill: 'var(--muted-foreground)',
                                        }}
                                        tickFormatter={(v) =>
                                            `RM${(v / 1000).toFixed(0)}k`
                                        }
                                        width={48}
                                    />
                                    <YAxis
                                        yAxisId="bookings"
                                        orientation="right"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{
                                            fontSize: 10,
                                            fill: 'var(--muted-foreground)',
                                        }}
                                        width={28}
                                    />
                                    <Tooltip
                                        cursor={{
                                            fill: 'var(--muted)',
                                            opacity: 0.4,
                                        }}
                                        contentStyle={{
                                            fontSize: 12,
                                            border: '1px solid var(--border)',
                                            borderRadius: 8,
                                            background: 'var(--card)',
                                            color: 'var(--foreground)',
                                        }}
                                        formatter={(
                                            value: number | undefined,
                                            name: string | undefined,
                                        ) =>
                                            name === 'revenue'
                                                ? [
                                                      formatCurrency(value),
                                                      'Revenue',
                                                  ]
                                                : [value, 'Bookings']
                                        }
                                    />
                                    <Bar
                                        yAxisId="revenue"
                                        dataKey="revenue"
                                        fill="var(--primary)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={28}
                                    />
                                    <Bar
                                        yAxisId="bookings"
                                        dataKey="bookings"
                                        fill="var(--muted-foreground)"
                                        opacity={0.35}
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={12}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Booking status breakdown — 1/3 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">
                                Booking Status
                            </CardTitle>
                            <CardDescription className="text-xs">
                                All time breakdown
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {booking_status_counts.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    No bookings yet.
                                </p>
                            ) : (
                                booking_status_counts.map(
                                    ({ status, count }) => {
                                        const total =
                                            booking_status_counts.reduce(
                                                (s, x) => s + x.count,
                                                0,
                                            );
                                        const percentage =
                                            total > 0
                                                ? Math.round(
                                                      (count / total) * 100,
                                                  )
                                                : 0;
                                        const cfg = bookingStatusConfig[
                                            status
                                        ] ?? {
                                            label: status,
                                            variant: 'outline' as const,
                                        };
                                        return (
                                            <div
                                                key={status}
                                                className="flex items-center gap-2"
                                            >
                                                <Badge
                                                    variant={cfg.variant}
                                                    className="w-20 justify-center py-0 text-[10px]"
                                                >
                                                    {cfg.label}
                                                </Badge>
                                                <div className="h-1.5 flex-1 rounded-full bg-muted">
                                                    <div
                                                        className="h-1.5 rounded-full bg-primary transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="w-8 text-right text-xs text-muted-foreground">
                                                    {count}
                                                </span>
                                            </div>
                                        );
                                    },
                                )
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">
                            Recent Bookings
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Latest 8 transactions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6 text-xs">
                                            #
                                        </TableHead>
                                        <TableHead className="text-xs">
                                            Customer
                                        </TableHead>
                                        <TableHead className="text-xs">
                                            Vehicle
                                        </TableHead>
                                        <TableHead className="text-xs">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-xs">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-xs">
                                            Status
                                        </TableHead>
                                        <TableHead className="pr-6 text-xs">
                                            Payment
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recent_bookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-xs text-muted-foreground"
                                            >
                                                No bookings found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recent_bookings.map((b) => {
                                            const bCfg = bookingStatusConfig[
                                                b.booking_status
                                            ] ?? {
                                                label: b.booking_status,
                                                variant: 'outline' as const,
                                            };
                                            const pCfg = paymentStatusConfig[
                                                b.payment_status
                                            ] ?? {
                                                label: b.payment_status,
                                                className: '',
                                            };
                                            return (
                                                <TableRow key={b.id}>
                                                    <TableCell className="pl-6 text-xs text-muted-foreground">
                                                        #{b.id}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">
                                                        {b.customer_name}
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {b.vehicle}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">
                                                        {b.booking_date}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">
                                                        {formatCurrency(
                                                            b.total_amount,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                bCfg.variant
                                                            }
                                                            className="py-0 text-[10px]"
                                                        >
                                                            {bCfg.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="pr-6">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${pCfg.className}`}
                                                        >
                                                            {pCfg.label}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
