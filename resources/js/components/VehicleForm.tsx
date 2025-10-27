import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ImageCropper } from '@/components/imageCropper';
import { Separator } from '@/components/ui/separator';
import { store, update } from '@/routes/owner/vehicles';
import { VehicleFormProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import 'react-advanced-cropper/dist/style.css';
import Swal from 'sweetalert2';
import { Label } from './ui/label';

export default function VehicleForm({ vehicle }: VehicleFormProps) {
    const isEdit = !!vehicle;

    const { data, setData, processing, errors, post, put } = useForm({
        id: vehicle?.id || 0,
        model: vehicle?.model || 'm4545',
        brand: vehicle?.brand || 'Bmw',
        transmission: vehicle?.transmission || 'Automatic',
        fuel_type: vehicle?.fuel_type || 'Petrol',
        seats: vehicle?.seats || 4,
        doors: vehicle?.doors || 4,
        color: vehicle?.color || 'Black',
        vehicle_type: vehicle?.vehicle_type || 'Car',
        year_of_manufacture:
            vehicle?.year_of_manufacture || new Date().getFullYear(),
        registration_date: vehicle?.registration_date || '2024-10-10',
        registration_expiry_date:
            vehicle?.registration_expiry_date || '2026-10-10',
        daily_rental_price: vehicle?.daily_rental_price || 0,
        weekly_rental_price: vehicle?.weekly_rental_price || 0,
        monthly_rental_price: vehicle?.monthly_rental_price || 0,
        engine_capacity: vehicle?.engine_capacity || '400cc',
        bond_amount: vehicle?.bond_amount || 1000,
        engine_number: vehicle?.engine_number || 'engnummm',
        status: vehicle?.status || 'available',
        license_plate: vehicle?.license_plate || 'ABR-69696',
        pickup_location: vehicle?.pickup_location || 'Colombo',
        image_urls: {},
        _method: 'post',
    });

    const [croppedImages, setCroppedImages] = useState<Record<string, Blob>>(
        {},
    );

    const handleCropChange = (key: string, cropped: Blob) => {
        setCroppedImages((prev) => ({ ...prev, [key]: cropped }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        Object.entries(croppedImages).forEach(([key, blob]) => {
            if (blob instanceof Blob) {
                setData(`image_urls.${key}` as any, blob);
            }
        });

        if (isEdit) {
            put(update({ vehicle: data.id }).url, { forceFormData: true });
        } else {
            const images = [
                'left_image',
                'front_image',
                'back_image',
                'right_image',
                'dashboard_image',
                'seat_image',
            ];

            for (const key of images) {
                if (
                    !(key in croppedImages) ||
                    !(croppedImages[key] instanceof Blob)
                ) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Image missing',
                        text: `Please select and crop the ${key.replace('_', ' ')} first.`,
                        confirmButtonText: 'OK',
                    });
                    return;
                }
            }

            post(store().url, { forceFormData: true });
        }
    };

    return (
        <Card className="mt-8 p-2">
            <CardContent className="p-2 sm:p-6">
                <form className="" encType="multipart/form-data">
                    {/* 1st Row Start */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                        {/* model */}
                        <div className="mb-3">
                            <Label>Model</Label>
                            <Input
                                className="mt-1"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                placeholder="Ex : M5"
                            />
                            {errors.model && (
                                <div className="text-sm text-red-500">
                                    {errors.model}
                                </div>
                            )}
                        </div>
                        {/* brand */}
                        <div className="mb-3">
                            <Label>Brand</Label>
                            <Input
                                className="mt-1"
                                value={data.brand}
                                onChange={(e) =>
                                    setData('brand', e.target.value)
                                }
                                placeholder="BMW"
                            />
                            {errors.brand && (
                                <div className="text-sm text-red-500">
                                    {errors.brand}
                                </div>
                            )}
                        </div>
                        {/* Transmisson */}
                        <div className="mb-3">
                            <Label>Transmisson</Label>

                            <Select
                                onValueChange={(value) =>
                                    setData('transmission', value)
                                }
                                value={data.transmission}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Automatic">
                                        Automatic
                                    </SelectItem>
                                    <SelectItem value="Manual">
                                        Manual
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.transmission && (
                                <div className="text-sm text-red-500">
                                    {errors.transmission}
                                </div>
                            )}
                        </div>
                        {/* Fuel Type */}
                        <div className="mb-3">
                            <Label>Fuel Type</Label>

                            <Select
                                onValueChange={(value) =>
                                    setData('fuel_type', value)
                                }
                                value={data.fuel_type}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Petrol">
                                        Petrol
                                    </SelectItem>
                                    <SelectItem value="Diesel">
                                        Diesel
                                    </SelectItem>
                                    <SelectItem value="Electric">
                                        Electric
                                    </SelectItem>
                                    <SelectItem value="Hybrid">
                                        Hybrid
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.fuel_type && (
                                <div className="text-sm text-red-500">
                                    {errors.fuel_type}
                                </div>
                            )}
                        </div>
                        {/* License plate */}
                        <div className="mb-3">
                            <Label>License Plate</Label>
                            <Input
                                value={data.license_plate}
                                className="mt-1"
                                onChange={(e) =>
                                    setData('license_plate', e.target.value)
                                }
                                placeholder="Ex : ABC-1234"
                            />
                            {errors.license_plate && (
                                <div className="text-sm text-red-500">
                                    {errors.license_plate}
                                </div>
                            )}
                        </div>
                        {/* vehicle Type */}
                        <div className="mb-3">
                            <Label className="mb-2">Vehicle Type</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('vehicle_type', value)
                                }
                                value={data.vehicle_type}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Car">Car</SelectItem>
                                    <SelectItem value="SUV">SUV</SelectItem>
                                    <SelectItem value="Van">Van</SelectItem>
                                    <SelectItem value="Bike">
                                        Motorbike
                                    </SelectItem>
                                    <SelectItem value="ThreeWheeler">
                                        Three Wheeler
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.vehicle_type && (
                                <div className="text-sm text-red-500">
                                    {errors.vehicle_type}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* 1st Row End*/}

                    {/* 2nd Row Start */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                        {/* seats and doors */}
                        <div className="mb-3 grid grid-cols-2 gap-4">
                            {/* seats */}
                            <div className="mb-3">
                                <Label>Seats</Label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={data.seats}
                                    onChange={(e) =>
                                        setData(
                                            'seats',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    placeholder="Ex : 4"
                                />
                                {errors.seats && (
                                    <div className="text-sm text-red-500">
                                        {errors.seats}
                                    </div>
                                )}
                            </div>
                            {/* doors */}
                            <div className="mb-3">
                                <Label>Doors</Label>
                                <Input
                                    type="number"
                                    className="mt-1"
                                    value={data.doors}
                                    onChange={(e) =>
                                        setData(
                                            'doors',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    placeholder="Ex : 4"
                                />
                                {errors.doors && (
                                    <div className="text-sm text-red-500">
                                        {errors.doors}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* year of manufacture */}
                        <div className="mb-3">
                            <Label>Year Of Manufacture</Label>
                            <Input
                                type="number"
                                value={data.year_of_manufacture}
                                className="mt-1"
                                onChange={(e) =>
                                    setData(
                                        'year_of_manufacture',
                                        parseInt(e.target.value),
                                    )
                                }
                                placeholder="Ex : 4"
                            />
                            {errors.year_of_manufacture && (
                                <div className="text-sm text-red-500">
                                    {errors.year_of_manufacture}
                                </div>
                            )}
                        </div>
                        {/* registration_date */}
                        <div className="mb-3">
                            <Label>Registration Date</Label>
                            <Input
                                type="date"
                                className="mt-1"
                                value={data.registration_date}
                                onChange={(e) =>
                                    setData('registration_date', e.target.value)
                                }
                                placeholder="Ex : 4"
                            />
                            {errors.registration_date && (
                                <div className="text-sm text-red-500">
                                    {errors.registration_date}
                                </div>
                            )}
                        </div>
                        {/* registration_expiry_date */}
                        <div className="mb-3">
                            <Label>Registration Expiry</Label>
                            <Input
                                type="date"
                                className="mt-1"
                                value={data.registration_expiry_date}
                                onChange={(e) =>
                                    setData(
                                        'registration_expiry_date',
                                        e.target.value,
                                    )
                                }
                            />
                            {errors.registration_expiry_date && (
                                <div className="text-sm text-red-500">
                                    {errors.registration_expiry_date}
                                </div>
                            )}
                        </div>
                        {/* engine_capacity */}
                        <div className="mb-3">
                            <Label>Engine Capacity</Label>
                            <Input
                                type="text"
                                className="mt-1"
                                value={data.engine_capacity}
                                onChange={(e) =>
                                    setData('engine_capacity', e.target.value)
                                }
                                placeholder="Ex : 400cc"
                            />
                            {errors.engine_capacity && (
                                <div className="text-sm text-red-500">
                                    {errors.engine_capacity}
                                </div>
                            )}
                        </div>
                        {/* engine_number */}
                        <div className="mb-3">
                            <Label>Engine Number</Label>
                            <Input
                                type="text"
                                className="mt-1"
                                value={data.engine_number}
                                onChange={(e) =>
                                    setData('engine_number', e.target.value)
                                }
                            />
                            {errors.engine_number && (
                                <div className="text-sm text-red-500">
                                    {errors.engine_number}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3rd Row Start */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                        {/* Color */}
                        <div className="mb-3">
                            <Label>Color</Label>
                            <Input
                                type="text"
                                className="mt-1"
                                value={data.color}
                                onChange={(e) =>
                                    setData('color', e.target.value)
                                }
                            />
                            {errors.color && (
                                <div className="text-sm text-red-500">
                                    {errors.color}
                                </div>
                            )}
                        </div>
                        {/* daily */}
                        <div className="mb-3">
                            <Label>Daily</Label>
                            <Input
                                type="number"
                                className="mt-1"
                                value={data.daily_rental_price}
                                onChange={(e) =>
                                    setData(
                                        'daily_rental_price',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.daily_rental_price && (
                                <div className="text-sm text-red-500">
                                    {errors.daily_rental_price}
                                </div>
                            )}
                        </div>
                        {/* weekly */}
                        <div className="mb-3">
                            <Label>Weekly</Label>
                            <Input
                                type="number"
                                className="mt-1"
                                value={data.weekly_rental_price}
                                onChange={(e) =>
                                    setData(
                                        'weekly_rental_price',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.weekly_rental_price && (
                                <div className="text-sm text-red-500">
                                    {errors.weekly_rental_price}
                                </div>
                            )}
                        </div>
                        {/*Monthly*/}
                        <div className="mb-3">
                            <Label>Monthly</Label>
                            <Input
                                type="number"
                                value={data.monthly_rental_price}
                                className="mt-1"
                                onChange={(e) =>
                                    setData(
                                        'monthly_rental_price',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.monthly_rental_price && (
                                <div className="text-sm text-red-500">
                                    {errors.monthly_rental_price}
                                </div>
                            )}
                        </div>
                        {/*bond_amount*/}
                        <div className="mb-3">
                            <Label>Bond amount</Label>
                            <Input
                                type="number"
                                value={data.bond_amount}
                                className="mt-1"
                                onChange={(e) =>
                                    setData(
                                        'bond_amount',
                                        parseInt(e.target.value),
                                    )
                                }
                            />
                            {errors.bond_amount && (
                                <div className="text-sm text-red-500">
                                    {errors.bond_amount}
                                </div>
                            )}
                        </div>
                        {/* Transmisson */}
                        <div className="mb-3">
                            <Label>Pick up Location</Label>

                            <Select
                                onValueChange={(value) =>
                                    setData('pickup_location', value)
                                }
                                value={data.pickup_location}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Colombo">
                                        Colombo
                                    </SelectItem>
                                    <SelectItem value="Kandy">Kandy</SelectItem>
                                    <SelectItem value="Kurunagale">
                                        Kurunagale
                                    </SelectItem>
                                    <SelectItem value="Matale">
                                        Matale
                                    </SelectItem>
                                    <SelectItem value="Gampola">
                                        Gampola
                                    </SelectItem>
                                    <SelectItem value="Nuwereliya">
                                        Nuwereliya
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.pickup_location && (
                                <div className="text-sm text-red-500">
                                    {errors.pickup_location}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* images upload quid lines */}
                    <div className="mt-4 mb-4 rounded-md bg-blue-50 p-4 text-sm text-gray-700">
                        <h4 className="mb-2 font-semibold text-blue-800">
                            📸 Vehicle Photo Guidelines
                        </h4>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>
                                Upload <strong>clear and well-lit</strong>{' '}
                                images of your vehicle.
                            </li>
                            <li>
                                Include all major angles:{' '}
                                <strong>Front, Back, Left, Right,</strong> and{' '}
                                <strong>Interior</strong>.
                            </li>
                            <li>
                                Ensure the entire vehicle is visible — avoid
                                cutting off parts.
                            </li>
                            <li>
                                Use a <strong>plain background</strong>{' '}
                                (preferably outdoors in daylight).
                            </li>
                            <li>
                                Make sure the vehicle is{' '}
                                <strong>clean and undamaged</strong> in all
                                photos.
                            </li>
                            <li>
                                Interior photo should clearly show the{' '}
                                <strong>dashboard and seats</strong>.
                            </li>
                            <li>
                                Accepted formats: <strong>JPG, PNG</strong> (max
                                5 MB per image).
                            </li>
                        </ul>
                    </div>

                    <Separator className="my-6" />

                    {/* vehicle Images upload section */}
                    <div className="gap-lg-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ImageCropper
                            label="Front Image"
                            imageKey="front_image"
                            aspectRatio={4 / 3}
                            onCropChange={handleCropChange}
                            value={vehicle?.old_images?.front_image || ''}
                        />

                        <ImageCropper
                            label="Left Image"
                            imageKey="left_image"
                            aspectRatio={16 / 9}
                            value={vehicle?.old_images?.left_image || ''}
                            onCropChange={handleCropChange}
                        />

                        <ImageCropper
                            label="Back Image"
                            imageKey="back_image"
                            aspectRatio={4 / 3}
                            onCropChange={handleCropChange}
                            value={vehicle?.old_images?.back_image || ''}
                        />

                        <ImageCropper
                            label="Right Image"
                            imageKey="right_image"
                            aspectRatio={16 / 9}
                            onCropChange={handleCropChange}
                            value={vehicle?.old_images?.right_image || ''}
                        />

                        <ImageCropper
                            label="Dashboard Image"
                            imageKey="dashboard_image"
                            aspectRatio={16 / 9}
                            onCropChange={handleCropChange}
                            value={vehicle?.old_images?.dashboard_image || ''}
                        />

                        <ImageCropper
                            label="Seat Image"
                            imageKey="seat_image"
                            aspectRatio={16 / 9}
                            onCropChange={handleCropChange}
                            value={vehicle?.old_images?.seat_image || ''}
                        />
                    </div>

                    {/* Action button */}
                    <div className="flex justify-end">
                        <Button
                            size={'sm'}
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? 'Update Vehicle' : 'New Vehicle'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
