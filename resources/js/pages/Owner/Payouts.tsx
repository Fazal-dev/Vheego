import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingItem {
    id: number;
    vehicle: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    booking_status: string;
}

interface Payout {
    id: number;
    gross_amount: number;
    commission: number;
    net_amount: number;
    status: string;
    payment_method: string | null;
    payment_reference: string | null;
    paid_at: string | null;
    created_at: string;
    booking_count: number;
    bookings: BookingItem[];
}

interface PaginatedPayouts {
    data: Payout[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Summary {
    total_paid: number;
    total_pending: number;
    total_failed: number;
    payout_count: number;
}

interface Filters {
    status: string | null;
    date_from: string | null;
    date_to: string | null;
}

interface Props {
    summary: Summary;
    payouts: PaginatedPayouts;
    filters: Filters;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusCfg: Record<
    string,
    { label: string; bg: string; text: string; dot: string }
> = {
    paid: {
        label: 'Paid',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
    },
    pending: {
        label: 'Pending',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
    },
    processing: {
        label: 'Processing',
        bg: 'bg-sky-500/15',
        text: 'text-sky-400',
        dot: 'bg-sky-400',
    },
    failed: {
        label: 'Failed',
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        dot: 'bg-red-400',
    },
};

const bookingStatusCfg: Record<string, string> = {
    Completed: 'text-emerald-400',
    Booked: 'text-sky-400',
    OnTrip: 'text-amber-400',
    Pending: '',
    Cancelled: 'text-red-400',
};

function StatusPill({ status }: { status: string }) {
    const c = statusCfg[status] ?? {
        label: status,
        bg: 'bg-zinc-500/15',
        text: '',
        dot: 'bg-zinc-400',
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

// CSV export — client side from current page data
function exportCSV(payouts: Payout[]) {
    const rows = [
        [
            'Payout ID',
            'Date',
            'Gross (LKR)',
            'Commission (LKR)',
            'Net (LKR)',
            'Status',
            'Method',
            'Reference',
            'Bookings',
        ],
        ...payouts.map((p) => [
            p.id,
            p.paid_at ?? p.created_at,
            p.gross_amount.toFixed(2),
            p.commission.toFixed(2),
            p.net_amount.toFixed(2),
            p.status,
            p.payment_method ?? '',
            p.payment_reference ?? '',
            p.booking_count,
        ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payouts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/owner/dashboard' },
    { title: 'Payouts', href: '/owner/payouts' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function OwnerPayouts({ summary, payouts, filters }: Props) {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());
    const [localFilters, setLocalFilters] = useState({
        status: filters.status ?? 'pending',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const toggle = (id: number) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const applyFilters = useCallback(() => {
        router.get(
            '/owner/payouts',
            {
                status: localFilters.status || undefined,
                date_from: localFilters.date_from || undefined,
                date_to: localFilters.date_to || undefined,
            },
            { preserveScroll: true },
        );
    }, [localFilters]);

    const clearFilters = () => {
        setLocalFilters({ status: '', date_from: '', date_to: '' });
        router.get('/owner/payouts', {}, { preserveScroll: true });
    };

    const isFiltered = !!(
        filters.status ||
        filters.date_from ||
        filters.date_to
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payouts" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">
                            Payouts
                        </h1>
                        <p className="mt-0.5 text-xs">
                            {summary.payout_count} total payouts
                        </p>
                    </div>
                    <Button
                        onClick={() => exportCSV(payouts.data)}
                        className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-zinc-600 hover:text-white"
                    >
                        <Download size={13} />
                        Export CSV
                    </Button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                        {
                            label: 'Total Paid',
                            value: formatCurrency(summary.total_paid),
                            icon: CheckCircle2,
                            color: 'text-emerald-400',
                            bg: 'bg-emerald-500/10',
                        },
                        {
                            label: 'Pending',
                            value: formatCurrency(summary.total_pending),
                            icon: Clock,
                            color: 'text-amber-400',
                            bg: 'bg-amber-500/10',
                        },
                        {
                            label: 'Failed',
                            value: formatCurrency(summary.total_failed),
                            icon: XCircle,
                            color: 'text-red-400',
                            bg: 'bg-red-500/10',
                        },
                        {
                            label: 'Total Payouts',
                            value: summary.payout_count,
                            icon: Wallet,
                            color: 'text-violet-400',
                            bg: 'bg-violet-500/10',
                        },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div
                            key={label}
                            className="relative overflow-hidden rounded-2xl border border-zinc-700/40 p-4"
                        >
                            <div
                                className={`mb-3 inline-flex rounded-xl p-2 ${bg}`}
                            >
                                <Icon size={16} className={color} />
                            </div>
                            <p className="text-xl font-bold">{value}</p>
                            <p className="mt-0.5 text-xs">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-zinc-700/40 p-4">
                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs">Status</label>
                        <Select
                            onValueChange={(val) =>
                                setLocalFilters((f: any) => ({
                                    ...f,
                                    status: val,
                                }))
                            }
                            value={localFilters.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value=" ">All statuses</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date from */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs">From</label>
                        <div className="relative">
                            <Calendar
                                size={12}
                                className="absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <Input
                                type="date"
                                value={localFilters.date_from}
                                onChange={(e) =>
                                    setLocalFilters((f) => ({
                                        ...f,
                                        date_from: e.target.value,
                                    }))
                                }
                                className="rounded-xl border py-2 pr-3 pl-8 text-xs focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Date to */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs">To</label>
                        <div className="relative">
                            <Calendar
                                size={12}
                                className="absolute top-1/2 left-3 -translate-y-1/2"
                            />
                            <Input
                                type="date"
                                value={localFilters.date_to}
                                onChange={(e) =>
                                    setLocalFilters((f) => ({
                                        ...f,
                                        date_to: e.target.value,
                                    }))
                                }
                                className="rounded-xl border py-2 pr-3 pl-8 text-xs focus:ring-1 focus:ring-amber-500/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={applyFilters}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-amber-400"
                    >
                        Apply
                    </Button>

                    {isFiltered && (
                        <Button
                            onClick={clearFilters}
                            className="rounded-xl bg-red-200 text-xs font-semibold text-black transition hover:bg-red-100"
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {/* Payouts list */}
                <div className="overflow-hidden rounded-2xl border border-zinc-700/40">
                    {/* Table header */}
                    <div className="grid grid-cols-12 border-b border-zinc-700/40 px-5 py-3 text-xs">
                        <span className="col-span-1">#</span>
                        <span className="col-span-2">Date</span>
                        <span className="col-span-2 text-right">Gross</span>
                        <span className="col-span-2 text-right">
                            Commission
                        </span>
                        <span className="col-span-2 text-right">Net</span>
                        <span className="col-span-2 text-center">Status</span>
                        <span className="col-span-1 text-center">Details</span>
                    </div>

                    {payouts.data.length === 0 ? (
                        <div className="py-16 text-center text-xs">
                            No payouts found for the selected filters.
                        </div>
                    ) : (
                        payouts.data.map((payout) => {
                            const isOpen = expanded.has(payout.id);
                            return (
                                <div
                                    key={payout.id}
                                    className="border-b border-zinc-700/30 last:border-0"
                                >
                                    {/* Payout row */}
                                    <div className="grid grid-cols-12 items-center px-5 py-4 transition">
                                        <span className="col-span-1 text-xs">
                                            #{payout.id}
                                        </span>
                                        <div className="col-span-2">
                                            <p className="text-xs font-medium">
                                                {payout.paid_at ??
                                                    payout.created_at}
                                            </p>
                                            {payout.payment_method && (
                                                <p className="mt-0.5 text-[10px] capitalize">
                                                    {payout.payment_method.replace(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <span className="col-span-2 text-right text-xs">
                                            {formatCurrency(
                                                payout.gross_amount,
                                            )}
                                        </span>
                                        <span className="col-span-2 text-right text-xs text-red-400">
                                            −{formatCurrency(payout.commission)}
                                        </span>
                                        <span className="col-span-2 text-right text-xs font-bold text-emerald-400">
                                            {formatCurrency(payout.net_amount)}
                                        </span>
                                        <div className="col-span-2 flex justify-center">
                                            <StatusPill
                                                status={payout.status}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() =>
                                                    toggle(payout.id)
                                                }
                                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px]"
                                            >
                                                {payout.booking_count}b
                                                {isOpen ? (
                                                    <ChevronDown size={11} />
                                                ) : (
                                                    <ChevronRight size={11} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded bookings */}
                                    {isOpen && (
                                        <div className="border-t border-zinc-700/30 px-5 py-3">
                                            {payout.payment_reference && (
                                                <p className="mb-3 text-[10px]">
                                                    Ref:{' '}
                                                    <span className="font-mono">
                                                        {
                                                            payout.payment_reference
                                                        }
                                                    </span>
                                                </p>
                                            )}

                                            {payout.bookings.length === 0 ? (
                                                <p className="text-xs">
                                                    Booking details not
                                                    available.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-12 text-[10px]">
                                                        <span className="col-span-1">
                                                            ID
                                                        </span>
                                                        <span className="col-span-4">
                                                            Vehicle
                                                        </span>
                                                        <span className="col-span-4">
                                                            Period
                                                        </span>
                                                        <span className="col-span-2 text-right">
                                                            Amount
                                                        </span>
                                                        <span className="col-span-1 text-right">
                                                            Status
                                                        </span>
                                                    </div>
                                                    {payout.bookings.map(
                                                        (b) => (
                                                            <div
                                                                key={b.id}
                                                                className="grid grid-cols-12 items-center rounded-xl border border-zinc-700/30 px-3 py-2.5"
                                                            >
                                                                <span className="col-span-1 text-[10px]">
                                                                    #{b.id}
                                                                </span>
                                                                <span className="col-span-4 text-xs font-medium">
                                                                    {b.vehicle}
                                                                </span>
                                                                <span className="col-span-4 text-[10px]">
                                                                    {
                                                                        b.start_date
                                                                    }{' '}
                                                                    →{' '}
                                                                    {b.end_date}
                                                                </span>
                                                                <span className="col-span-2 text-right text-xs font-semibold">
                                                                    {formatCurrency(
                                                                        b.total_amount,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`col-span-1 text-right text-[10px] font-medium ${bookingStatusCfg[b.booking_status] ?? ''}`}
                                                                >
                                                                    {
                                                                        b.booking_status
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {payouts.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {payouts.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() =>
                                    link.url &&
                                    router.get(
                                        link.url,
                                        {},
                                        { preserveScroll: true },
                                    )
                                }
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-xs transition ${
                                    link.active
                                        ? 'bg-amber-500 font-semibold text-black'
                                        : link.url
                                          ? 'hover:bg-zinc-800 hover:text-white'
                                          : 'cursor-not-allowed text-zinc-600'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
