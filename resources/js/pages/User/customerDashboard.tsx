import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    Car,
    Clock,
    CreditCard,
    History,
    MapPin,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: customer.customerDashboard.url(),
    },
];

export default function customerDashboard({
    auth,
    stats,
    activeTrip,
    bookings,
}: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
                <Head title="Renter Dashboard" />
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {auth.user.name} 👋
                    </h1>
                    <p className="font-medium text-muted-foreground">
                        Manage your active rentals and track your security
                        bonds.
                    </p>
                </div>

                {/* 1. Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Active Trips"
                        value={stats.active_count}
                        icon={<Activity className="h-4 w-4" />}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Total Spending"
                        value={`Rs. ${stats.total_spending}`}
                        icon={<CreditCard className="h-4 w-4" />}
                        color="text-orange-600"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completed_count}
                        icon={<History className="h-4 w-4" />}
                    />
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* 2. Left Column: Active Trip & History */}
                    <div className="space-y-8">
                        {/* Active Trip Spotlight */}
                        {activeTrip ? (
                            <Card className="overflow-hidden border-2 border-primary/20 shadow-sm">
                                <div className="flex items-center justify-between border-b bg-primary/5 px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                                        </span>
                                        <span className="text-sm font-bold tracking-wider text-blue-700 uppercase">
                                            On Road Now
                                        </span>
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground">
                                        REF: {activeTrip.booking_no}
                                    </span>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-6 md:flex-row">
                                        <img
                                            src={activeTrip.vehicle_image}
                                            className="h-32 w-full rounded-xl border object-cover md:w-48"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {activeTrip.vehicle_brand}{' '}
                                                    {activeTrip.vehicle_model}
                                                </h3>
                                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />{' '}
                                                    Handover:{' '}
                                                    {activeTrip.pickup_location}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span>Time Remaining</span>
                                                    <span className="text-blue-600">
                                                        {activeTrip.hours_left}h
                                                        left
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        activeTrip.progress_percent
                                                    }
                                                    className="h-2 bg-slate-100"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Contact Host
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Return Instructions
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed bg-slate-50 p-10 text-center">
                                <Car className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                                <h3 className="font-semibold text-slate-600">
                                    No active trips
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Ready for your next adventure?
                                </p>
                                <Button variant="outline">
                                    Browse Vehicles
                                </Button>
                            </Card>
                        )}

                        {/* Booking History Tabs */}
                        <Tabs defaultValue="upcoming" className="w-full">
                            <TabsList className="mb-4 grid w-full grid-cols-2">
                                <TabsTrigger value="upcoming">
                                    Upcoming
                                </TabsTrigger>
                                <TabsTrigger value="history">
                                    History
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="upcoming" className="space-y-4">
                                {bookings.upcoming.map((b: any) => (
                                    <BookingRow key={b.id} booking={b} />
                                ))}
                            </TabsContent>
                            <TabsContent value="history" className="space-y-4">
                                {bookings.history.map((b: any) => (
                                    <BookingRow key={b.id} booking={b} />
                                ))}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Sub-components for cleaner code
function StatCard({ title, value, icon, color = 'text-slate-600' }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

function BookingRow({ booking }: any) {
    return (
        <div className="flex items-center justify-between rounded-xl border bg-white p-4 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-4">
                <div className="rounded-lg bg-slate-100 p-2">
                    <Car className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                    <p className="text-sm font-bold">{booking.vehicle_name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />{' '}
                            {booking.date_range}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {booking.status}
                        </span>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm">
                Details
            </Button>
        </div>
    );
}
