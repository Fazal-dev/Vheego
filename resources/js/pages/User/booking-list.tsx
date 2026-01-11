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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { Booking, BookingListPageProps, BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

import { Car, Clock, Hash, MapPin } from 'lucide-react';
import { useState } from 'react';

const statusMap: Record<
    string,
    { label: string; color: any; progress: number }
> = {
    Pending: {
        label: 'Pending',
        color: 'secondary',
        progress: 25,
    },
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

export default function BookingListPage({
    bookings,
    currentFilter,
}: {
    bookings: BookingListPageProps;
    currentFilter: string;
}) {
    const handleTabChange = (value: string) => {
        router.get(
            customer.bookings(),
            { status: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setBooking(page.props.bookings as BookingListPageProps);
                },
                only: ['bookings', 'currentFilter'],
            },
        );
    };
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [filterbookings, setBooking] = useState<any>(bookings);
    const [cancelBooking, setCancelBooking] = useState<any>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="max-w-8xl mx-auto px-2 py-10">
                <div>
                    <h1 className="text-2xl font-semibold">My Bookings</h1>
                    <p className="text-sm text-muted-foreground">
                        Track pickup and return status of your rentals
                    </p>
                </div>

                <div className="mt-3 mb-3">
                    <Tabs
                        className="mb-3"
                        value={currentFilter}
                        onValueChange={handleTabChange}
                    >
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="Booked">Booked</TabsTrigger>
                            <TabsTrigger value="OnTrip">On Trip</TabsTrigger>
                            <TabsTrigger value="Cancelled">
                                Cancelled
                            </TabsTrigger>
                            <TabsTrigger value="Completed">
                                Completed
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Booking List */}
                <div className="mt-3 grid gap-4">
                    {filterbookings && filterbookings.length > 0 ? (
                        // 1. If we have bookings, map them
                        filterbookings.map((booking: Booking) => (
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
                                            <MapPin className="h-4 w-4" />{' '}
                                            Pickup: {booking.pickup}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            {booking.startDate} –{' '}
                                            {booking.endDate}
                                        </div>

                                        {/* Tracking Progress (Main Page) */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Status</span>
                                                <span>
                                                    {
                                                        statusMap[
                                                            booking.status
                                                        ].label
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
                                        {['Pending', 'Booked'].includes(
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
                        ))
                    ) : (
                        // 2. Fallback UI when array is empty
                        <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Car className="h-8 w-8 text-muted-foreground opacity-20" />
                            </div>
                            <h3 className="text-lg font-medium">
                                No bookings found
                            </h3>
                            <p className="mt-1 max-w-[250px] text-sm text-muted-foreground">
                                You don't have any{' '}
                                {currentFilter === 'all'
                                    ? ''
                                    : currentFilter.toLowerCase()}{' '}
                                trips at the moment.
                            </p>
                            {/* Optional: Add a button to redirect them to car listing */}
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() =>
                                    router.get(customer.findVehicle())
                                }
                            >
                                Browse Vehicles
                            </Button>
                        </Card>
                    )}
                </div>

                {/* Booking Detail Popup */}
                <Dialog
                    open={!!selectedBooking}
                    onOpenChange={() => setSelectedBooking(null)}
                >
                    {selectedBooking && (
                        <DialogContent className="max-w-lg rounded-2xl p-6">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">
                                    Booking Details
                                </DialogTitle>
                            </DialogHeader>

                            {selectedBooking && (
                                <div className="space-y-6">
                                    {/* Vehicle & Status */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={selectedBooking.image}
                                                alt={selectedBooking.vehicle}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h3 className="text-md font-medium">
                                                    {selectedBooking.vehicle}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedBooking.model ||
                                                        ''}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                statusMap[
                                                    selectedBooking.status
                                                ].color
                                            }
                                        >
                                            {
                                                statusMap[
                                                    selectedBooking.status
                                                ].label
                                            }
                                        </Badge>
                                    </div>

                                    <Separator />

                                    {/* Booking Info Grid */}
                                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Pickup Location
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {selectedBooking.pickup}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Return Location
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {selectedBooking.dropoff}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Start Date
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {selectedBooking.startDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    End Date
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {selectedBooking.endDate}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Booking ID
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {selectedBooking.id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Payment Status
                                                </p>
                                                <Badge variant={'destructive'}>
                                                    {
                                                        selectedBooking.payment_status
                                                    }
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    Total Amount
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {
                                                        selectedBooking.total_amount
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Progress */}
                                    <div>
                                        <p className="mb-1 text-sm font-medium">
                                            Booking Progress
                                        </p>
                                        <Progress
                                            value={
                                                statusMap[
                                                    selectedBooking.status
                                                ].progress
                                            }
                                        />
                                    </div>

                                    {/* Actions */}
                                    {['Pending', 'Booked'].includes(
                                        selectedBooking.status,
                                    ) && (
                                        <div className="mt-4 flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setSelectedBooking(null)
                                                }
                                            >
                                                Close
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    setCancelBooking(
                                                        selectedBooking,
                                                    )
                                                }
                                            >
                                                Cancel Booking
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
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
