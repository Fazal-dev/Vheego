import { BookingDetailModal } from '@/components/booking/booking-detail-modal';
import { EndTripWizard } from '@/components/booking/booking-end-trip-renter-wizard';
import { StartTripWizard } from '@/components/booking/booking-start-trip-wizard';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { Booking, BookingListPageProps, BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

import { Car, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [bookingToStart, setBookingToStart] = useState<any>(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [isEndTripWizardOpen, setIsEndTripWizardOpen] = useState(false);
    const [isEndTrip, setIsEndTrip] = useState(false);

    useEffect(() => {
        if (isEndTrip == true) {
            handleTabChange('Completed');
        }
    }, [isEndTrip]);

    const handleOpenWizard = (booking: any) => {
        setBookingToStart(booking);
        setIsWizardOpen(true);
    };

    const handleEntTripOpenWizard = (booking: any) => {
        setBookingToStart(booking);
        setIsEndTripWizardOpen(true);
    };

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
                        {/* Scrollable wrapper so tabs don't overflow on mobile */}
                        <div className="w-full overflow-x-auto pb-1">
                            <TabsList className="w-max md:grid md:w-full md:grid-cols-5">
                                <TabsTrigger value="all" className="min-w-[64px]">All</TabsTrigger>
                                <TabsTrigger value="Booked" className="min-w-[76px]">Booked</TabsTrigger>
                                <TabsTrigger value="OnTrip" className="min-w-[76px]">On Trip</TabsTrigger>
                                <TabsTrigger value="Cancelled" className="min-w-[88px]">Cancelled</TabsTrigger>
                                <TabsTrigger value="Completed" className="min-w-[92px]">Completed</TabsTrigger>
                            </TabsList>
                        </div>
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
                                <CardContent className="p-3">
                                    {/* Mobile: 2-col (image | info), Desktop: 3-col */}
                                    <div className="grid grid-cols-[100px_1fr] gap-3 md:grid-cols-[140px_2fr_220px]">
                                        {/* Vehicle Image */}
                                        <img
                                            src={booking.image}
                                            alt={booking.vehicle}
                                            className="h-24 w-full rounded-xl object-cover md:h-28"
                                        />

                                        {/* Vehicle & Location */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                <span className="font-medium leading-tight">
                                                    {booking.vehicle}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4 shrink-0" />{' '}
                                                Pickup: {booking.pickup}
                                            </div>

                                            <div className="text-xs text-muted-foreground">
                                                {booking.startDate} –{' '}
                                                {booking.endDate}
                                            </div>

                                            {/* Progress — hidden on mobile, shown on md+ inside info col */}
                                            <div className="hidden space-y-1 md:block">
                                                <div className="flex justify-between text-xs">
                                                    <span>Status</span>
                                                    <span>{statusMap[booking.status].label}</span>
                                                </div>
                                                <Progress value={statusMap[booking.status].progress} />
                                            </div>
                                        </div>

                                        {/* Actions — hidden on mobile, shown on md+ */}
                                        <div className="hidden flex-col items-end justify-between gap-3 md:flex">
                                            <Badge variant={statusMap[booking.status].color}>
                                                {statusMap[booking.status].label}
                                            </Badge>
                                            <div className="flex w-full flex-row items-center justify-end gap-2">
                                                {booking.status === 'Booked' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                        onClick={(e) => { e.stopPropagation(); handleOpenWizard(booking); }}
                                                    >
                                                        Start Trip
                                                    </Button>
                                                )}
                                                {booking.status === 'OnTrip' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                        onClick={(e) => { e.stopPropagation(); handleEntTripOpenWizard(booking); }}
                                                    >
                                                        End Trip
                                                    </Button>
                                                )}
                                                {['Pending', 'Booked'].includes(booking.status) && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) => { e.stopPropagation(); setCancelBooking(booking); }}
                                                    >
                                                        Cancel Booking
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile-only: progress + actions row below */}
                                    <div className="mt-3 md:hidden">
                                        <div className="mb-2 space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>Status</span>
                                                <span>{statusMap[booking.status].label}</span>
                                            </div>
                                            <Progress value={statusMap[booking.status].progress} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant={statusMap[booking.status].color}>
                                                {statusMap[booking.status].label}
                                            </Badge>
                                            <div className="flex gap-2">
                                                {booking.status === 'Booked' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                        onClick={(e) => { e.stopPropagation(); handleOpenWizard(booking); }}
                                                    >
                                                        Start Trip
                                                    </Button>
                                                )}
                                                {booking.status === 'OnTrip' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90"
                                                        onClick={(e) => { e.stopPropagation(); handleEntTripOpenWizard(booking); }}
                                                    >
                                                        End Trip
                                                    </Button>
                                                )}
                                                {['Pending', 'Booked'].includes(booking.status) && (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) => { e.stopPropagation(); setCancelBooking(booking); }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
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

                {/* trip start */}
                <StartTripWizard
                    open={isWizardOpen}
                    onOpenChange={setIsWizardOpen}
                    booking={bookingToStart}
                />

                {/* trip end */}
                <EndTripWizard
                    open={isEndTripWizardOpen}
                    onOpenChange={setIsEndTripWizardOpen}
                    setIsEndTrip={setIsEndTrip}
                    booking={bookingToStart}
                />

                {/* Booking Detail Popup */}
                <BookingDetailModal
                    selectedBooking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onCancel={(booking) => setCancelBooking(booking)}
                    statusMap={statusMap}
                    isNoCancle={false}
                />

                <Dialog
                    open={!!cancelBooking}
                    onOpenChange={() => setCancelBooking(null)}
                >
                    <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Cancel Booking</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to cancel this booking ?</p>
                        <p className="text-sm text-muted-foreground mt-2">
                           You will receive a 100% refund if it is more than 24 hours before your trip. You will receive a 50% refund if it is between 12 and 24 hours. No refunds if cancelled within 12 hours.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCancelBooking(null)}
                            >
                                No, Go Back
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => {
                                    if(cancelBooking) {
                                        router.post(`/customer/bookings/${cancelBooking.id}/cancel`, {}, {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                setCancelBooking(null);
                                            }
                                        });
                                    }
                                }}
                            >
                                Yes, Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
