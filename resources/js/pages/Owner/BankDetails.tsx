import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Building2, CreditCard, User, Hash, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BankDetails({ bankDetails, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        bank_name:            bankDetails?.bank_name ?? '',
        account_holder_name:  bankDetails?.account_holder_name ?? '',
        account_number:       bankDetails?.account_number ?? '',
        routing_number:       bankDetails?.routing_number ?? '',
        account_type:         bankDetails?.account_type ?? 'savings',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('owner.bank-details.update'));
    };

    const isPopulated = !!bankDetails?.bank_name;

    return (
        <>
            <Head title="Bank Details" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                                <Building2 size={18} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">Bank Details</h1>
                        </div>
                        <p className="text-sm text-gray-500 ml-13 pl-[52px]">
                            Your payout will be sent to this account after each trip cycle.
                        </p>
                    </div>

                    {/* Flash */}
                    {flash?.success && (
                        <div className="mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-xl">
                            <CheckCircle2 size={16} /> {flash.success}
                        </div>
                    )}

                    {/* Warning if not set */}
                    {!isPopulated && (
                        <div className="mb-6 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-xl">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <span>You haven't added bank details yet. Payouts won't be processed until this is complete.</span>
                        </div>
                    )}

                    {/* Form */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Bank Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Bank Name
                                </label>
                                <div className="relative">
                                    <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.bank_name}
                                        onChange={e => setData('bank_name', e.target.value)}
                                        placeholder="e.g. Bank of Ceylon"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                                    />
                                </div>
                                {errors.bank_name && <p className="text-xs text-red-500 mt-1">{errors.bank_name}</p>}
                            </div>

                            {/* Account Holder */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Account Holder Name
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.account_holder_name}
                                        onChange={e => setData('account_holder_name', e.target.value)}
                                        placeholder="Full name as on bank account"
                                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                                    />
                                </div>
                                {errors.account_holder_name && <p className="text-xs text-red-500 mt-1">{errors.account_holder_name}</p>}
                            </div>

                            {/* Account Number + Routing on same row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        Account Number
                                    </label>
                                    <div className="relative">
                                        <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.account_number}
                                            onChange={e => setData('account_number', e.target.value)}
                                            placeholder="0000 0000 0000"
                                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                                        />
                                    </div>
                                    {errors.account_number && <p className="text-xs text-red-500 mt-1">{errors.account_number}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        Sort / Routing No.
                                        <span className="text-gray-400 font-normal ml-1 normal-case">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={data.routing_number}
                                            onChange={e => setData('routing_number', e.target.value)}
                                            placeholder="00-00-00"
                                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Account Type
                                </label>
                                <div className="flex gap-3">
                                    {['savings', 'current', 'checking'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setData('account_type', type)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all capitalize ${
                                                data.account_type === type
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                {errors.account_type && <p className="text-xs text-red-500 mt-1">{errors.account_type}</p>}
                            </div>

                            {/* Security note */}
                            <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500">
                                <Layers size={13} className="mt-0.5 flex-shrink-0" />
                                <span>Your bank details are stored securely and only used for processing payouts by the platform admin.</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gray-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Saving…' : isPopulated ? 'Update Bank Details' : 'Save Bank Details'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
