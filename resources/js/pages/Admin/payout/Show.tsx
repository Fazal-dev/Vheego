import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import admin from '@/routes/admin';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Calendar,
    Car,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    Edit2,
    Percent,
    Receipt,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const statusStyles: any = {
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons: any = {
    paid: CheckCircle2,
    pending: Clock,
    processing: Clock,
    failed: AlertCircle,
};

function StatusBadge({ status }: any) {
    const Icon = statusIcons[status] ?? Clock;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status] ?? statusStyles.pending}`}
        >
            <Icon size={11} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function CommissionEditor({ owner }: any) {
    const [editing, setEditing] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        commission_rate: owner.commission_rate,
    });

    const save = () => {
        patch(admin.payouts.updateCommission.url(owner.id), {
            onSuccess: () => setEditing(false),
        });
    };

    return (
        <div className="flex items-center gap-2">
            {editing ? (
                <>
                    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            value={data.commission_rate}
                            onChange={(e) =>
                                setData('commission_rate', e.target.value)
                            }
                            className="w-20 px-2 py-1.5 text-sm outline-none"
                        />
                        <span className="border-l border-gray-300 bg-gray-50 px-2 text-sm text-gray-400">
                            %
                        </span>
                        {errors.commission_rate && (
                            <p className="text-xs text-red-500">
                                {errors.commission_rate}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={save}
                        disabled={processing}
                        className="rounded-lg bg-emerald-500 p-1.5 text-white hover:bg-emerald-600"
                    >
                        <Check size={13} />
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className="rounded-lg bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200"
                    >
                        <X size={13} />
                    </button>
                </>
            ) : (
                <>
                    <span className="text-sm font-semibold text-gray-900">
                        {owner.commission_rate}%
                    </span>
                    <button
                        onClick={() => setEditing(true)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <Edit2 size={13} />
                    </button>
                </>
            )}
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'payout Details',
        href: '',
    },
];

export default function PayoutsShow({
    owner,
    pendingBookings,
    summary,
    payoutHistory,
}: any) {
    const [triggering, setTriggering] = useState(false);
    const [confirm, setConfirm] = useState(false);

    const handleTrigger = () => {
        setTriggering(true);
        router.post(
            admin.payouts.trigger.url(owner.id),
            {},
            {
                onFinish: () => {
                    setTriggering(false);
                    setConfirm(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payout — ${owner.name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-2 lg:px-1">
                    {/* Back + Header */}
                    <div className="mb-8">
                        <Link
                            href={admin.payouts.index()}
                            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
                        >
                            <ArrowLeft size={15} /> Back to Payouts
                        </Link>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 text-xl font-bold text-white">
                                    {owner.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {owner.name}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {owner.email} · {owner.vehicles_count}{' '}
                                        vehicle
                                        {owner.vehicles_count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {!confirm ? (
                                    <button
                                        onClick={() => setConfirm(true)}
                                        disabled={summary.count === 0}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Zap size={15} />
                                        Trigger Payout
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2">
                                        <span className="text-sm font-medium text-red-700">
                                            Pay {formatCurrency(summary.net)}{' '}
                                            now?
                                        </span>
                                        <button
                                            onClick={handleTrigger}
                                            disabled={triggering}
                                            className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700"
                                        >
                                            {triggering
                                                ? 'Processing…'
                                                : 'Confirm'}
                                        </button>
                                        <button
                                            onClick={() => setConfirm(false)}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Owner Info Card */}
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Percent size={15} /> Owner Settings
                            </h2>
                            <div>
                                <p className="mb-1 text-xs text-gray-400">
                                    Commission Rate
                                </p>
                                <CommissionEditor owner={owner} />
                                <p className="mt-1 text-xs text-gray-400">
                                    Platform keeps this % of each booking
                                </p>
                            </div>
                        </div>

                        {/* Bank Details Card */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Building2 size={15} /> Bank Details
                            </h2>
                            {owner.bank_details ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Bank
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {owner.bank_details.bank_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Holder
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {
                                                owner.bank_details
                                                    .account_holder_name
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Account
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            ****
                                            {owner.bank_details.account_number.slice(
                                                -4,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Type
                                        </span>
                                        <span className="font-medium text-gray-900 capitalize">
                                            {owner.bank_details.account_type}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-600">
                                    <AlertCircle size={14} />
                                    Owner hasn't added bank details yet.
                                </div>
                            )}
                        </div>

                        {/* Payout Summary */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <DollarSign size={15} /> Pending Summary
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Gross Amount
                                    </span>
                                    <span className="font-medium">
                                        {formatCurrency(summary.gross)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Platform Fee ({owner.commission_rate}%)
                                    </span>
                                    <span className="font-medium text-red-500">
                                        -{formatCurrency(summary.commission)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-100 pt-3">
                                    <span className="font-semibold text-gray-900">
                                        Net Payout
                                    </span>
                                    <span className="text-lg font-bold text-emerald-600">
                                        {formatCurrency(summary.net)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {summary.count} booking
                                    {summary.count !== 1 ? 's' : ''} included
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Bookings */}
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                            <Car size={16} className="text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-700">
                                Pending Bookings
                            </h2>
                            <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                                {summary.count} booking
                                {summary.count !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {pendingBookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-50 text-xs tracking-wider text-gray-400 uppercase">
                                            <th className="px-6 py-3 text-left font-medium">
                                                #
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Vehicle
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Period
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Days
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Gross
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Fee
                                            </th>
                                            <th className="px-6 py-3 text-right font-medium">
                                                Net
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {pendingBookings.map((b: any) => (
                                            <tr
                                                key={b.id}
                                                className="hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-3 font-mono text-xs text-gray-400">
                                                    #{b.id}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-gray-800">
                                                    {b.vehicle}
                                                </td>
                                                <td className="px-4 py-3 text-center text-xs text-gray-500">
                                                    {b.start_date} →{' '}
                                                    {b.end_date}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-600">
                                                    {b.days}d
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                    {formatCurrency(b.gross)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs text-red-400">
                                                    -
                                                    {formatCurrency(
                                                        b.commission,
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold text-emerald-600">
                                                    {formatCurrency(b.net)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <CheckCircle2
                                    size={28}
                                    className="mx-auto mb-2 text-emerald-400"
                                />
                                <p className="text-sm">
                                    All bookings have been paid out.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payout History */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
                            <Receipt size={16} className="text-gray-500" />
                            <h2 className="text-sm font-semibold text-gray-700">
                                Payout History
                            </h2>
                        </div>

                        {payoutHistory.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-50 text-xs tracking-wider text-gray-400 uppercase">
                                            <th className="px-6 py-3 text-left font-medium">
                                                Reference
                                            </th>
                                            <th className="px-4 py-3 text-left font-medium">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Gross
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Fee
                                            </th>
                                            <th className="px-4 py-3 text-right font-medium">
                                                Net
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Bookings
                                            </th>
                                            <th className="px-6 py-3 text-center font-medium">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {payoutHistory.map((p: any) => (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50/50"
                                            >
                                                <td className="px-6 py-3 font-mono text-xs text-gray-500">
                                                    {p.reference}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-600">
                                                    {p.paid_at ?? p.date}
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-700">
                                                    {formatCurrency(p.gross)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs text-red-400">
                                                    -
                                                    {formatCurrency(
                                                        p.commission,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                                                    {formatCurrency(p.net)}
                                                </td>
                                                <td className="px-4 py-3 text-center text-gray-500">
                                                    {p.bookings_count}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <StatusBadge
                                                        status={p.status}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-400">
                                <Calendar
                                    size={28}
                                    className="mx-auto mb-2 opacity-40"
                                />
                                <p className="text-sm">
                                    No payout history yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
