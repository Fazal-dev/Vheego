import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useOwnerNotifications() {
    const { auth } = usePage().props as any;
    const ownerId = auth?.user?.id;

    useEffect(() => {
        if (!ownerId) return;

        const channel = window.Echo.private(`owner.${ownerId}`);

        channel.listen('NewBookingReceived', (e: any) => {
            toast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                        } flex w-80 items-start gap-3 rounded-2xl border p-4 shadow-2xl`}
                    >
                        {/* Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-xl">
                            🚗
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">
                                New Booking!
                            </p>
                            <p className="mt-0.5 truncate text-xs">
                                <span className="font-medium">
                                    {e.customer}
                                </span>{' '}
                                booked your{' '}
                                <span className="font-medium text-amber-400">
                                    {e.vehicle}
                                </span>
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-zinc-500">
                                    {e.start_date} → {e.end_date}
                                </span>
                                <span className="text-sm font-bold text-emerald-400">
                                    LKR{' '}
                                    {Number(e.total_amount).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="shrink-0 text-zinc-600 transition hover:text-zinc-300"
                        >
                            ✕
                        </button>
                    </div>
                ),
                { duration: 8000 },
            );
        });
        return () => {
            window.Echo.leave(`owner.${ownerId}`);
        };
    }, [ownerId]);
}
