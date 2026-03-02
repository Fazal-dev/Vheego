import { BookingDetailModal } from '@/components/booking/booking-detail-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CalendarDays,
    Car,
    Clock,
    CreditCard,
    MapPin,
    Star,
} from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: customer.customerDashboard.url(),
    },
];

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

export default function customerDashboard({ auth, stats, bookings }: any) {
    const activeBooking = {
        vehicle: 'Toyota Prius 2022',
        pickupDate: '28 Feb 2026 - 3:00 PM',
        status: 'Ready for Pickup',
        image: 'https://picsum.photos/800/600?random=166',
    };
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [cancelBooking, setCancelBooking] = useState<any>(null);

    const local_stats = [
        {
            title: 'Active Booking',
            value: stats?.active_count,
            icon: Car,
        },
        {
            title: 'Upcoming Trips',
            value: bookings?.upcoming.length,
            icon: CalendarDays,
        },
        {
            title: 'Total Trips',
            value: stats?.completed_count,
            icon: Star,
        },
        {
            title: 'Total Spent',
            value: `LKR ${stats.total_spending}`,
            icon: CreditCard,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Renter Dashboard" />
            <div className="space-y-8 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {auth.user.name}
                    </h1>
                    <p className="font-medium text-muted-foreground">
                        Manage your active rentals and track your spending.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {local_stats.map((item, index) => (
                        <StatCard
                            key={index}
                            title={item.title}
                            value={item.value}
                            icon={
                                <item.icon className="text-muted-foreground" />
                            }
                            color="text-blue-600"
                        />
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    {/* Active Booking Section */}
                    <Card className="rounded-2xl shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" /> Current Booking
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center gap-4">
                                <img
                                    src={activeBooking.image}
                                    alt="vehicle"
                                    className="h-20 w-20 rounded-xl object-cover"
                                />
                                <div>
                                    <h3 className="font-medium">
                                        {activeBooking.vehicle}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pickup: {activeBooking.pickupDate}
                                    </p>
                                    <Badge className="mt-2" variant="secondary">
                                        {activeBooking.status}
                                    </Badge>
                                </div>
                            </div>
                            <Button className="rounded-xl">
                                View Details{' '}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Booking History Tabs */}
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="mb-4 grid w-full grid-cols-2">
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming" className="space-y-4">
                            {bookings.upcoming.map((b: any) => (
                                <BookingRow
                                    setSelectedBooking={setSelectedBooking}
                                    key={b.id}
                                    booking={b}
                                />
                            ))}
                        </TabsContent>
                        <TabsContent value="history" className="space-y-4">
                            {bookings.history.map((b: any) => (
                                <BookingRow
                                    setSelectedBooking={setSelectedBooking}
                                    key={b.id}
                                    booking={b}
                                />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Booking Detail Popup */}
                <BookingDetailModal
                    selectedBooking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onCancel={(booking) => setCancelBooking(booking)}
                    statusMap={statusMap}
                    isNoCancle={true}
                />
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, color = 'text-slate-600' }: any) {
    return (
        <Card className="rounded-2xl border-l-4 border-l-gray-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {title}
                </CardTitle>
                <div className={color}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function BookingRow({ booking, setSelectedBooking }: any) {
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
