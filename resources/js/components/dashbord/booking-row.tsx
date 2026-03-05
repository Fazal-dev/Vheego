import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

export default function BookingRow({ booking, setSelectedBooking }: any) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-white p-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                {/* 1. Use booking.image */}
                <div className="relative h-16 w-24 overflow-hidden rounded-lg border bg-slate-50">
                    <img
                        src={booking.image}
                        alt={booking.vehicle}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div>
                    {/* 2. Use booking.vehicle */}
                    <p className="text-sm font-bold text-slate-900">
                        {booking.vehicle}
                    </p>

                    <div className="mt-1 flex flex-col gap-1">
                        {/* 3. Use booking.startDate & booking.endDate */}
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {booking.startDate} to {booking.endDate}
                            </span>
                        </div>

                        {/* 4. Use booking.pickup */}
                        <div className="flex items-center gap-1 text-[11px] font-medium text-blue-600">
                            <MapPin className="h-3 w-3" />
                            <span>{booking.pickup}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedBooking(booking)}
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}
