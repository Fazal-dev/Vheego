import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { BreadcrumbItem } from '@/types';

import { Car, Clock, Hash, MapPin } from 'lucide-react';
import { useState } from 'react';

const statusMap: Record<
    string,
    { label: string; color: any; progress: number }
> = {
    Booked: {
        label: 'Booked',
        color: 'secondary',
        progress: 25,
    },
    OnTrip: {
        label: 'On Trip',
        color: 'success',
        progress: 70,
    },

    Completed: {
        label: 'Completed',
        color: 'outline',
        progress: 100,
    },

    Cancelled: {
        label: 'Cancelled',
        color: 'destructive',
        progress: 0,
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Booking',
        href: customer.customerDashboard().url,
    },
];

export default function BookingListPage() {
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [cancelBooking, setCancelBooking] = useState<any>(null);

    const bookings = [
        {
            id: 'BK-2026-001',
            vehicle: 'Toyota Prius 2023',
            image: 'https://picsum.photos/300/200?random=1',
            pickup: 'Colombo',
            dropoff: 'Kandy',
            status: 'Completed',
            startDate: '2026-01-10',
            endDate: '2026-01-14',
        },
        {
            id: 'BK-2026-002',
            vehicle: 'Honda Vezel 2022',
            image: 'https://picsum.photos/300/200?random=2',
            pickup: 'Negombo',
            dropoff: 'Colombo',
            status: 'Booked',
            startDate: '2026-01-20',
            endDate: '2026-01-22',
        },
        {
            id: 'BK-2026-003',
            vehicle: 'Honda Vezel 2022',
            image: 'https://picsum.photos/300/200?random=5',
            pickup: 'Negombo',
            dropoff: 'Colombo',
            status: 'Booked',
            startDate: '2026-01-20',
            endDate: '2026-01-22',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-8xl mx-auto px-2 py-10">
                <div>
                    <h1 className="text-2xl font-semibold">My Bookings</h1>
                    <p className="text-sm text-muted-foreground">
                        Track pickup and return status of your rentals
                    </p>
                </div>

                {/* Booking List */}
                <div className="mt-3 grid gap-4">
                    {bookings.map((booking) => (
                        <Card
                            key={booking.id}
                            className="cursor-pointer rounded-2xl transition hover:shadow-md"
                            onClick={() => setSelectedBooking(booking)}
                        >
                            <CardContent className="grid gap-4 p-3 md:grid-cols-[140px_1fr_220px]">
                                {/* Vehicle Image */}
                                <img
                                    src={booking.image}
                                    alt={booking.vehicle}
                                    className="h-28 w-full rounded-xl object-cover"
                                />

                                {/* Vehicle & Location */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">
                                            {booking.vehicle}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" /> Pickup:{' '}
                                        {booking.pickup}
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        {booking.startDate} – {booking.endDate}
                                    </div>

                                    {/* Tracking Progress (Main Page) */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>Status</span>
                                            <span>
                                                {
                                                    statusMap[booking.status]
                                                        .label
                                                }
                                            </span>
                                        </div>
                                        <Progress
                                            value={
                                                statusMap[booking.status]
                                                    .progress
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end justify-between gap-3">
                                    <Badge
                                        variant={
                                            statusMap[booking.status].color
                                        }
                                    >
                                        {statusMap[booking.status].label}
                                    </Badge>
                                    {['pending', 'confirmed', 'ready'].includes(
                                        booking.status,
                                    ) && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCancelBooking(booking);
                                            }}
                                        >
                                            Cancel Booking
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Booking Detail Popup */}
                <Dialog
                    open={!!selectedBooking}
                    onOpenChange={() => setSelectedBooking(null)}
                >
                    {selectedBooking && (
                        <DialogContent className="max-w-lg rounded-2xl">
                            <DialogHeader>
                                <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        {selectedBooking.vehicle}
                                    </span>
                                    <Badge
                                        variant={
                                            statusMap[selectedBooking.status]
                                                .color
                                        }
                                    >
                                        {
                                            statusMap[selectedBooking.status]
                                                .label
                                        }
                                    </Badge>
                                </div>

                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            <strong>Pickup Location:</strong>{' '}
                                            {selectedBooking.pickup}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            <strong>Return Location:</strong>{' '}
                                            {selectedBooking.dropoff}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            <strong>Start Date:</strong>{' '}
                                            {selectedBooking.startDate}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            <strong>End Date:</strong>{' '}
                                            {selectedBooking.endDate}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            <strong>Booking ID:</strong>{' '}
                                            {selectedBooking.id}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Clock className="h-4 w-4" />
                                        Status
                                    </div>
                                    <Progress
                                        value={
                                            statusMap[selectedBooking.status]
                                                .progress
                                        }
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>

                <Dialog
                    open={!!cancelBooking}
                    onOpenChange={() => setCancelBooking(null)}
                >
                    <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Cancel Booking</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to cancel this booking ?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCancelBooking(null)}
                            >
                                No, Go Back
                            </Button>
                            <Button variant="destructive">Yes, Cancel</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
