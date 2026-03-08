import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Building2,
    CheckCircle2,
    ChevronRight,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payouts',
        href: '',
    },
];
function StatCard({ icon: Icon, label, value, sub, accent }: any) {
    return (
        <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="mb-1 text-xs font-medium tracking-widest text-gray-500 uppercase">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
                </div>
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}
                >
                    <Icon size={18} className="text-white" />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ hasBankDetails, pendingBookings }: any) {
    if (pendingBookings === 0) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 size={11} /> Settled
            </span>
        );
    }
    if (!hasBankDetails) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                <AlertCircle size={11} /> No bank details
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Clock size={11} /> Pending
        </span>
    );
}

export default function PayoutsIndex({ owners, summary, flash }: any) {
    const [triggering, setTriggering] = useState(null);
    const [bulkTriggering, setBulkTriggering] = useState(false);
    const [confirmBulk, setConfirmBulk] = useState(false);

    const handleTrigger = (ownerId: any) => {
        setTriggering(ownerId);
        router.post(
            admin.payouts.trigger.url(ownerId),
            {},
            {
                onFinish: () => setTriggering(null),
            },
        );
    };

    const handleBulkTrigger = () => {
        setBulkTriggering(true);
        router.post(
            admin.payouts.bulkTrigger.url(),
            {},
            {
                onFinish: () => {
                    setBulkTriggering(false);
                    setConfirmBulk(false);
                },
            },
        );
    };

    const ownersWithPending = owners.filter((o: any) => o.pending_bookings > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Owner Payouts" />

            <div className="min-h-screen">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div>
                            {/* <h1 className="text-2xl font-bold text-gray-900">
                                Owner Payouts
                            </h1> */}
                            {/* <p className="mt-1 text-sm text-gray-500">
                                Manage and disburse earnings to vehicle owners
                            </p> */}
                        </div>
                        <div className="flex gap-3">
                            {!confirmBulk ? (
                                <button
                                    onClick={() => setConfirmBulk(true)}
                                    disabled={ownersWithPending.length === 0}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Zap size={15} />
                                    Bulk Payout All ({ownersWithPending.length})
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
                                    <span className="text-sm font-medium text-red-700">
                                        Confirm bulk payout?
                                    </span>
                                    <button
                                        onClick={handleBulkTrigger}
                                        disabled={bulkTriggering}
                                        className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700"
                                    >
                                        {bulkTriggering
                                            ? 'Processing…'
                                            : 'Yes, pay all'}
                                    </button>
                                    <button
                                        onClick={() => setConfirmBulk(false)}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                            <CheckCircle2 size={16} />
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                            <AlertCircle size={16} />
                            {flash.error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            icon={DollarSign}
                            label="Total Gross Pending"
                            value={formatCurrency(summary.total_pending)}
                            accent="bg-violet-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Total Net Pending"
                            value={formatCurrency(summary.total_net_pending)}
                            sub="After platform commission"
                            accent="bg-blue-500"
                        />
                        <StatCard
                            icon={Users}
                            label="Owners w/ Pending"
                            value={summary.owners_with_pending}
                            sub={`of ${summary.total_owners} total owners`}
                            accent="bg-orange-500"
                        />
                        <StatCard
                            icon={Building2}
                            label="Platform Revenue"
                            value={formatCurrency(
                                summary.total_pending -
                                    summary.total_net_pending,
                            )}
                            sub="From all pending payouts"
                            accent="bg-emerald-500"
                        />
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h2 className="text-sm font-semibold text-gray-700">
                                All Owners
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 text-xs tracking-wider text-gray-400 uppercase">
                                        <th className="px-6 py-3 text-left font-medium">
                                            Owner
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Commission
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Gross Pending
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Platform Fee
                                        </th>
                                        <th className="px-4 py-3 text-right font-medium">
                                            Net Payout
                                        </th>
                                        <th className="px-4 py-3 text-center font-medium">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {owners.map((owner: any) => (
                                        <tr
                                            key={owner.id}
                                            className="transition-colors hover:bg-gray-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                                                        {owner.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {owner.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {owner.email}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {
                                                                owner.vehicles_count
                                                            }{' '}
                                                            vehicle
                                                            {owner.vehicles_count !==
                                                            1
                                                                ? 's'
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                                    {owner.commission_rate}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(
                                                        owner.gross_pending,
                                                    )}
                                                </span>
                                                <p className="text-xs text-gray-400">
                                                    {owner.pending_bookings}{' '}
                                                    booking
                                                    {owner.pending_bookings !==
                                                    1
                                                        ? 's'
                                                        : ''}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 text-right text-xs font-medium text-red-500">
                                                -
                                                {formatCurrency(
                                                    owner.commission,
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-bold text-emerald-600">
                                                    {formatCurrency(
                                                        owner.net_pending,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <StatusBadge
                                                    hasBankDetails={
                                                        owner.has_bank_details
                                                    }
                                                    pendingBookings={
                                                        owner.pending_bookings
                                                    }
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={admin.payouts.show(
                                                            owner.id,
                                                        )}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
                                                    >
                                                        Details{' '}
                                                        <ChevronRight
                                                            size={12}
                                                        />
                                                    </Link>
                                                    {owner.pending_bookings >
                                                        0 && (
                                                        <button
                                                            onClick={() =>
                                                                handleTrigger(
                                                                    owner.id,
                                                                )
                                                            }
                                                            disabled={
                                                                triggering ===
                                                                owner.id
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                                                        >
                                                            {triggering ===
                                                            owner.id ? (
                                                                <span className="flex items-center gap-1">
                                                                    <svg
                                                                        className="h-3 w-3 animate-spin"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <circle
                                                                            className="opacity-25"
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="10"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                        />
                                                                        <path
                                                                            className="opacity-75"
                                                                            fill="currentColor"
                                                                            d="M4 12a8 8 0 018-8v8z"
                                                                        />
                                                                    </svg>
                                                                    Paying…
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    Pay{' '}
                                                                    <ArrowUpRight
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {owners.length === 0 && (
                                <div className="py-16 text-center text-gray-400">
                                    <Users
                                        size={32}
                                        className="mx-auto mb-3 opacity-40"
                                    />
                                    <p className="text-sm">No owners found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
