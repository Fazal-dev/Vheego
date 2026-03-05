import { Chip } from '@/components/chip';
import BackButton from '@/components/custom-ui/BackButton';
import Detail from '@/components/detail-lable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import VehicleImagesSlider from '@/components/vehicle/vehicle-images-slider';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Car } from 'lucide-react';

interface VehicleShowProps {
    vehicle: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'View Vehicle Details',
        href: index().url,
    },
];

export default function VehicleShow({ vehicle }: VehicleShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle List" />
            <div className="mt-3 px-3 text-start">
                <BackButton />
            </div>
            <div className="p-4 sm:p-8">
                {/* Header Section */}
                <Card className="shadow-sm">
                    <CardContent className="p-6 pb-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {vehicle.brand} {vehicle.model}
                                    </h1>
                                    <Chip
                                        className="px-3 py-1 text-xs"
                                        variant={
                                            vehicle.status === 'Active'
                                                ? 'success'
                                                : 'destructive'
                                        }
                                    >
                                        {vehicle.status}
                                    </Chip>
                                </div>

                                <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                                    <span>
                                        {vehicle.license_plate} •{' '}
                                        {vehicle.year_of_manufacture}
                                    </span>
                                    <span className="text-gray-300">|</span>
                                    {/* Social Proof: Trip Count */}
                                    <div className="flex items-center gap-1 font-medium text-slate-700">
                                        <Car className="h-4 w-4" />
                                        {vehicle.total_trips > 0
                                            ? `${vehicle.total_trips} trips`
                                            : 'New Listing'}
                                    </div>
                                </div>
                            </div>

                            {/* Prominent Daily Price */}
                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center sm:text-right">
                                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                    Daily Rate
                                </p>
                                <div className="flex items-baseline gap-1 sm:justify-end">
                                    <span className="text-2xl font-bold text-blue-600">
                                        {vehicle.daily_rental_price}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500">
                                        LKR /day
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Vehicle Details Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            <Detail label="Brand" value={vehicle.brand} />
                            <Detail label="Model" value={vehicle.model} />
                            <Detail label="Type" value={vehicle.vehicle_type} />
                            <Detail
                                label="Transmission"
                                value={vehicle.transmission}
                            />
                            <Detail
                                label="Fuel Type"
                                value={vehicle.fuel_type}
                            />
                            <Detail label="Seats" value={vehicle.seats} />
                            <Detail label="Doors" value={vehicle.doors} />
                            <Detail label="Color" value={vehicle.color} />
                            <Detail
                                label="Engine Capacity"
                                value={vehicle.engine_capacity}
                            />
                            <Detail
                                label="Engine Number"
                                value={vehicle.engine_number}
                            />
                            <Detail
                                label="Bond Amount"
                                value={`${vehicle.bond_amount} LKR`}
                            />
                            <Detail
                                label="Registration Date"
                                value={vehicle.registration_date}
                            />
                            <Detail
                                label="Registration Expiry"
                                value={vehicle.registration_expiry_date}
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Card className="py-4">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                                    {vehicle.description}
                                </CardContent>
                            </Card>

                            <Card className="py-4">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Highlights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    {vehicle.highlights}
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
                {/* images */}
                <div className="mt-3">
                    <VehicleImagesSlider image_urls={vehicle.old_images} />
                </div>
            </div>
        </AppLayout>
    );
}
