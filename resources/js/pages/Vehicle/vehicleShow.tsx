import BackButton from '@/components/BackButton';
import { Chip } from '@/components/chip';
import Detail from '@/components/detail-lable';
import PriceCard from '@/components/price-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import VehicleImagesSlider from '@/components/vehicleImagesSlider';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, DollarSign } from 'lucide-react';

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
                    <CardContent className="p-6">
                        <div className="flex-lg-col flex items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    {vehicle.brand} {vehicle.model}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {vehicle.license_plate} •{' '}
                                    {vehicle.year_of_manufacture}
                                </p>
                            </div>
                            <div className="">
                                <Chip
                                    className="px-4 py-2"
                                    variant={
                                        vehicle.status === 'Active'
                                            ? 'success'
                                            : 'destructive'
                                    }
                                >
                                    {vehicle.status}
                                </Chip>
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
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                                    {vehicle.description}
                                </CardContent>
                            </Card>

                            <Card>
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

                        <Separator className="my-6" />

                        {/* Rental Info */}
                        <h2 className="mb-3 text-lg font-semibold text-gray-800">
                            Rental Rates
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <PriceCard
                                title="Daily Rate"
                                value={vehicle.daily_rental_price}
                                icon={<Calendar />}
                                iconBg="bg-green-100"
                                iconColor="text-green-600"
                            />
                            <PriceCard
                                title="Weekly Rate"
                                value={vehicle.weekly_rental_price}
                                icon={<Clock />}
                                iconBg="bg-yellow-100"
                                iconColor="text-yellow-600"
                            />
                            <PriceCard
                                title="Monthly Rate"
                                value={vehicle.monthly_rental_price}
                                icon={<DollarSign />}
                                iconBg="bg-purple-100"
                                iconColor="text-purple-600"
                            />
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
