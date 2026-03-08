import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import owner from '@/routes/owner';
import { edit } from '@/routes/profile';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    CreditCard,
    Hash,
    Layers,
    User,
} from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];
export default function BankDetails({ bankDetails, flash }: any) {
    const { data, setData, post, processing, errors } = useForm({
        bank_name: bankDetails?.bank_name ?? '',
        account_holder_name: bankDetails?.account_holder_name ?? '',
        account_number: bankDetails?.account_number ?? '',
        routing_number: bankDetails?.routing_number ?? '',
        account_type: bankDetails?.account_type ?? 'savings',
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post(owner.bankDetails.update.url());
    };

    const isPopulated = !!bankDetails?.bank_name;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="min-h-screen">
                    <div className="mx-auto max-w-xl px-4 py-5 sm:px-6">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="mb-1 flex items-center gap-3">
                                {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                                    <Building2
                                        size={18}
                                        className="text-white"
                                    />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Bank Details
                                </h1> */}
                            </div>
                            <p className="ml-13 pl-[52px] text-sm text-gray-500">
                                Your payout will be sent to this account after
                                each trip cycle.
                            </p>
                        </div>

                        {/* Warning if not set */}
                        {!isPopulated && (
                            <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                <AlertCircle
                                    size={16}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    You haven't added bank details yet. Payouts
                                    won't be processed until this is complete.
                                </span>
                            </div>
                        )}

                        {/* Form */}
                        {/* <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"> */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Bank Name */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                    Bank Name
                                </label>
                                <div className="relative">
                                    <Building2
                                        size={15}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={data.bank_name}
                                        onChange={(e) =>
                                            setData('bank_name', e.target.value)
                                        }
                                        placeholder="e.g. Bank of Ceylon"
                                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                                    />
                                </div>
                                {errors.bank_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.bank_name}
                                    </p>
                                )}
                            </div>

                            {/* Account Holder */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                    Account Holder Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={15}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={data.account_holder_name}
                                        onChange={(e) =>
                                            setData(
                                                'account_holder_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Full name as on bank account"
                                        className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-9 text-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                                    />
                                </div>
                                {errors.account_holder_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.account_holder_name}
                                    </p>
                                )}
                            </div>

                            {/* Account Number + Routing on same row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                        Account Number
                                    </label>
                                    <div className="relative">
                                        <CreditCard
                                            size={15}
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            value={data.account_number}
                                            onChange={(e) =>
                                                setData(
                                                    'account_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0000 0000 0000"
                                            className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                                        />
                                    </div>
                                    {errors.account_number && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.account_number}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                        Sort / Routing No.
                                        <span className="ml-1 font-normal text-gray-400 normal-case">
                                            (optional)
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <Hash
                                            size={15}
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="text"
                                            value={data.routing_number}
                                            onChange={(e) =>
                                                setData(
                                                    'routing_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="00-00-00"
                                            className="w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-9 text-sm transition focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                                    Account Type
                                </label>
                                <div className="flex gap-3">
                                    {['savings', 'current', 'checking'].map(
                                        (type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'account_type',
                                                        type,
                                                    )
                                                }
                                                className={`flex-1 rounded-xl border py-2 text-sm font-medium capitalize transition-all ${
                                                    data.account_type === type
                                                        ? 'border-gray-900 bg-gray-900 text-white'
                                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ),
                                    )}
                                </div>
                                {errors.account_type && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.account_type}
                                    </p>
                                )}
                            </div>

                            {/* Security note */}
                            <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                                <Layers
                                    size={13}
                                    className="mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    Your bank details are stored securely and
                                    only used for processing payouts by the
                                    platform admin.
                                </span>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving…'
                                    : isPopulated
                                      ? 'Update '
                                      : 'Save '}
                            </Button>
                        </form>
                        {/* </div> */}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
