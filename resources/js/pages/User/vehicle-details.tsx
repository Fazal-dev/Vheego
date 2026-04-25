import BookingSummaryCard from '@/components/booking/booking-summary-card';
import { HostInfoCard } from '@/components/custom-ui/host-info-card';
import ImageSliderProvider from '@/components/custom-ui/image-slider-provider';
import IncludeBenifits from '@/components/include-benifits';
import { ReviewSection } from '@/components/vehicle/vehicle-review-section';
import Spec from '@/components/vehicle/vehicle-spac';
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
import { Map, MapMarker, MarkerContent, MapControls, MarkerTooltip } from '@/components/ui/map';
import { Card } from '@/components/ui/card';

export default function VehicleDetails({
    vehicle,
    reviews_data,
}: {
    vehicle: VehicleDetailsProp;
    reviews_data: any;
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
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {vehicle.brand} {vehicle.model}{' '}
                                <span className="font-normal text-slate-500">
                                    ({vehicle.year})
                                </span>
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {vehicle.location ?? 'Colombo'}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    4.8
                                    <span className="text-sm text-slate-500">
                                        (48 reviews)
                                    </span>
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="flex items-center gap-1">
                                    <Car className="h-4 w-4 text-slate-600" />
                                    {vehicle.vehicleTrips}{' '}
                                    {vehicle.vehicleTrips == 1
                                        ? 'trip'
                                        : 'trips'}
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
                            <Separator className="my-8" />
                            
                            {/* 📍 Map Section */}
                            <div className="mb-10 space-y-4">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Pickup Location
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Exact location will be provided after booking. This map shows the general area for pickup.
                                </p>
                                <Card className="h-[400px] w-full overflow-hidden rounded-xl border-none shadow-lg">
                                    <Map 
                                        center={[vehicle.longitude ?? 79.8612, vehicle.latitude ?? 6.9271]} 
                                        zoom={13}
                                        className="h-full w-full"
                                    >
                                        <MapControls />
                                        {vehicle.latitude && vehicle.longitude && (
                                            <MapMarker longitude={vehicle.longitude} latitude={vehicle.latitude}>
                                                <MarkerContent>
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-4 ring-white transition-transform hover:scale-110">
                                                        <Car className="h-5 w-5" />
                                                    </div>
                                                </MarkerContent>
                                                <MarkerTooltip>Vehicle Location</MarkerTooltip>
                                            </MapMarker>
                                        )}
                                    </Map>
                                </Card>
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span>{vehicle.location || 'Colombo, Sri Lanka'}</span>
                                </div>
                            </div>

                            <Separator className="my-8" />
                            <ReviewSection data={reviews_data} />
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
