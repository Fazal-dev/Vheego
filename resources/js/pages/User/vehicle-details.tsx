import BookingSummaryCard from '@/components/booking-summary-card';
import { HostInfoCard } from '@/components/host-info-card';
import ImageSliderProvider from '@/components/image-slider-provider';
import IncludeBenifits from '@/components/include-benifits';
import Spec from '@/components/vehicle/spac';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { BreadcrumbItem, VehicleDetailsProp } from '@/types';
import { Separator } from '@radix-ui/react-separator';
import {
    Car,
    DoorClosed,
    Fuel,
    MapPin,
    Settings,
    Star,
    Users,
} from 'lucide-react';

import { PhotoView } from 'react-photo-view';

export default function VehicleDetails({
    vehicle,
}: {
    vehicle: VehicleDetailsProp;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: vehicle.brand + '-' + vehicle.model,
            href: customer.customerDashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* 🔝 Top Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                    {/* Image + Info */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-6">
                            {/* Left: Main Image */}
                            <div className="lg:col-span-3">
                                <img
                                    src={
                                        vehicle.images?.[0] ??
                                        '/placeholder-car.jpg'
                                    }
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="h-[350px] w-full rounded-xl object-cover"
                                />
                            </div>

                            {/* Right: Thumbnails */}
                            <div className="grid grid-cols-2 gap-2 md:col-span-3 lg:col-span-3">
                                <ImageSliderProvider>
                                    {vehicle.images &&
                                        vehicle.images
                                            .slice(1, 5)
                                            .map((img, index) => (
                                                <PhotoView
                                                    key={index}
                                                    src={img}
                                                >
                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="h-[170px] w-full cursor-pointer rounded-xl object-cover hover:opacity-90"
                                                        style={{
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </PhotoView>
                                            ))}
                                </ImageSliderProvider>
                            </div>
                        </div>

                        {/* info */}
                        <div>
                            <h1 className="text-2xl font-semibold">
                                {vehicle.brand} {vehicle.model} ({vehicle.year})
                            </h1>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {vehicle.location ?? 'Colombo'}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    4.8 ({vehicle.vehicleTrips} trips)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📋 Vehicle Details */}
                <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* Specs  */}
                        <div className="grid grid-cols-2 gap-4 p-3 sm:grid-cols-5">
                            <Spec
                                icon={<Users />}
                                label="Seats"
                                value={`${vehicle.seats}`}
                            />
                            <Spec
                                icon={<DoorClosed />}
                                label="Doors"
                                value={`${vehicle.doors}`}
                            />
                            <Spec
                                icon={<Fuel />}
                                label="Fuel"
                                value={vehicle.fuel_type}
                            />

                            <Spec icon={<Car />} label="Type" value="Car" />
                            <Spec
                                icon={<Settings />}
                                label="Transmission"
                                value={vehicle.transmission}
                            />
                        </div>
                        {/* Description */}
                        <div className="p-5">
                            <h2 className="mb-2 text-lg font-semibold">
                                Description
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {vehicle.description ??
                                    'Well-maintained vehicle, perfect for city and long trips. Clean interior, smooth drive, and excellent fuel efficiency.'}
                            </p>
                        </div>

                        <Separator
                            orientation="vertical"
                            className="my-2 border"
                        />
                        {/* Highlights */}
                        <div className="p-5">
                            <h2 className="mb-3 text-lg font-semibold">
                                Highlights
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {vehicle.highlights ??
                                    'Well-maintained vehicle, perfect for city and long trips. Clean interior, smooth drive, and excellent fuel efficiency.'}
                            </p>
                        </div>
                        {/* host section */}
                        <HostInfoCard
                            hostName={vehicle.ownerName}
                            avatarUrl={vehicle.ownerAvatar}
                            joinDate={vehicle.ownerJoinDate}
                            trips={vehicle.ownerTrips}
                        />
                        <div className=" ">
                            <IncludeBenifits />
                        </div>
                    </div>
                    {/* booking summary */}
                    <div className="lg:col-span-1">
                        <BookingSummaryCard vehicle={vehicle} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
