import { BookingDetailModal } from '@/components/booking/booking-detail-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    Car,
    CreditCard,
    MapPin,
    Plus,
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

export default function customerDashboard({
    auth,
    stats,
    bookings,
    activeTrip,
}: any) {
    // const activeBooking = {
    //     vehicle: 'Toyota Prius 2022',
    //     pickupDate: '29 Feb 2026 - 3:00 PM',
    //     status: 'Ready for Pickup',
    //     image: 'https://picsum.photos/800/600?random=166',
    //     progress_percent: 94,
    // };
    const activeBooking = activeTrip;
    // const activeBooking = null;
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

                <div className="grid items-stretch gap-6 md:grid-cols-2">
                    {/* 1. Left Side: Active Booking Command Center */}
                    {activeBooking ? (
                        <Card className="flex flex-col overflow-hidden rounded-3xl border-none bg-slate-50/50 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className="gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                        </span>
                                        Live Trip
                                    </Badge>
                                    <span className="font-mono text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                                        Vehicle Number :{' '}
                                        {activeBooking.vehicle_number}
                                    </span>
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col justify-between p-6 pt-2">
                                <div className="space-y-6">
                                    {/* Vehicle Hero Info */}
                                    <div className="flex items-center gap-5">
                                        <div className="group relative">
                                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 opacity-20 blur transition group-hover:opacity-40"></div>
                                            <img
                                                src={activeBooking?.image || ''}
                                                className="relative h-24 w-32 rounded-2xl border bg-white object-cover shadow-sm"
                                                alt="Active Vehicle"
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl leading-none font-black tracking-tight text-slate-900 italic">
                                                {activeBooking.vehicle}
                                            </h2>
                                            <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                {activeBooking.pickupDate}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Visualizer */}
                                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="flex items-end justify-between">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                                    Time Remaining
                                                </p>
                                                <p className="font-mono text-xl font-bold text-slate-900">
                                                    {
                                                        activeBooking.remaining_time
                                                    }
                                                </p>
                                            </div>
                                            <div className="space-y-0.5 text-right">
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                                    Return Date
                                                </p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {activeBooking.return_date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${
                                                    activeBooking.progress_percent >
                                                    90
                                                        ? 'bg-red-500'
                                                        : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                                                }`}
                                                style={{
                                                    width: `${activeBooking.progress_percent}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* THE "NO ACTIVE TRIP" STATE */
                        <Card className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
                            <div className="relative mb-6">
                                <div className="absolute -inset-4 rounded-full bg-blue-100/50 blur-2xl"></div>
                                <div className="relative rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                                    <Car className="h-10 w-10" />
                                </div>
                            </div>

                            <div className="max-w-[280px] space-y-1">
                                <h3 className="text-xl font-bold text-slate-900">
                                    No active trips
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your current rentals will appear here. Ready
                                    to hit the road again?
                                </p>
                            </div>

                            <Button
                                className="mt-3 w-full max-w-[200px] rounded-xl shadow-md"
                                onClick={() =>
                                    router.visit(customer.findVehicle())
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" /> Book a Vehicle
                            </Button>
                        </Card>
                    )}

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
