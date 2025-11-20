import BackButton from '@/components/BackButton';
import { Chip } from '@/components/chip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords } from '@/lib/utils';
import { vehicleApproval } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Mail, Phone, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicle Review',
        href: vehicleApproval().url,
    },
];

export default function reviewVehicle({ vehicle, owner }) {
    const { post, processing } = useForm();

    console.log(vehicle);

    let variant: 'default' | 'success' | 'destructive' = 'default';

    const status = vehicle.status;

    if (status === 'Active') variant = 'success';
    else if (status === 'Inactive') variant = 'destructive';

    const vehicle_fields = [
        { label: 'Model', value: vehicle.model },
        { label: 'Brand', value: vehicle.brand },
        { label: 'Transmission', value: vehicle.transmission },
        { label: 'Fuel Type', value: vehicle.fuel_type },
        { label: 'Color', value: vehicle.color },
        { label: 'Vehicle Type', value: vehicle.vehicle_type },
        { label: 'Year of Manufacture', value: vehicle.year_of_manufacture },
        { label: 'Doors', value: vehicle.doors },
        { label: 'Seats', value: vehicle.seats },
        { label: 'Number Plate', value: vehicle.license_plate },
        {
            label: 'Registration Date',
            value: vehicle.registration_date,
        },
        {
            label: 'Registration Expiry',
            value: vehicle.registration_expiry_date,
        },
        {
            label: 'Engine Capacity',
            value: vehicle.engine_capacity,
        },
        {
            label: 'Engine Number',
            value: vehicle.engine_number,
        },
        {
            label: 'Status',
            value: <Chip variant={variant}>{status}</Chip>,
        },
    ];

    const handleApprove = () => {};

    const handleReject = () => {};
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Review" />
            <div className="container mx-auto space-y-6 p-4">
                {/* button section */}
                <div className="grid grid-cols-2">
                    <BackButton
                        className="w-20"
                        onClick={() => router.visit(vehicleApproval().url)}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="destructive"
                            disabled={processing}
                            size={'sm'}
                            onClick={handleReject}
                        >
                            Reject
                        </Button>

                        <Button
                            variant="default"
                            size={'sm'}
                            disabled={processing}
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    {/* Vehicle Details */}
                    <Card className="col-span-4 space-x-3 md:col-span-3">
                        <CardHeader>
                            <CardTitle>Vehicle Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 p-3 md:grid-cols-5">
                                {vehicle_fields.map((field, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="text-sm text-muted-foreground">
                                            {field.label}
                                        </p>
                                        <p className="font-semibold">
                                            {field.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Owner Details */}

                    <Card className="col-span-4 rounded-xl border bg-white shadow-sm md:col-span-1">
                        <CardHeader className="flex flex-row items-center gap-3 pb-1">
                            <Avatar className="h-10 w-10">
                                {/* If you have an owner avatar URL */}
                                <AvatarImage
                                    src={owner.avatar_url}
                                    alt={owner.name}
                                />
                                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                    {owner.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>

                            <CardTitle className="text-md font-semibold">
                                Owner Contact Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2 px-4 pt-2">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <User className="mt-1 h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Owner Name
                                        </p>
                                        <p className="font-medium">
                                            {capitalizeWords(owner.name)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Mail className="mt-1 h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email
                                        </p>
                                        <p className="font-medium">
                                            {owner.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                                    <Phone className="mt-1 h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Phone
                                        </p>
                                        <p className="font-medium">
                                            {owner.phone_no}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Vehicle Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            {vehicle.image_urls &&
                                Object.entries(vehicle.image_urls).map(
                                    ([key, url], index) => (
                                        <div
                                            key={index}
                                            className="overflow-hidden rounded-xl border p-3"
                                        >
                                            <img
                                                src={url}
                                                alt={key}
                                                className="h-48 w-full object-cover"
                                            />
                                            <p className="mt-1 text-center text-sm capitalize">
                                                {key.charAt(0).toUpperCase() +
                                                    key
                                                        .split('_')
                                                        .join(' ')
                                                        .slice(1)}
                                            </p>
                                        </div>
                                    ),
                                )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
