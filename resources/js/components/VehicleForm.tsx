import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ImageCropper } from '@/components/imageCropper';
import { store, update } from '@/routes/owner/vehicles';
import { VehicleFormProps } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import 'react-advanced-cropper/dist/style.css';
import { Label } from './ui/label';
import VehicleImageGuide from './VehicleImageGuide';

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
        front_image: null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            post(update({ vehicle: data.id }).url, { forceFormData: true });
        } else {
            post(store().url, { forceFormData: true });
        }
    };

    return (
        <form className="" encType="multipart/form-data">
            {/* Vehicle Info start */}
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>Vehicle Info</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-6">
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
                </CardContent>
            </Card>
            {/* Vehicle Info end */}

            {/* image guide */}
            <VehicleImageGuide />

            {/* vehicle image upload section start */}
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Images</CardTitle>
                </CardHeader>
                <CardContent className="p-1 sm:p-6">
                    {/* vehicle Images upload section */}
                    <div className="gap-lg-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <ImageCropper
                            label="Front Image"
                            name="front_image"
                            value={vehicle?.old_images?.front_image || ''}
                            setData={setData}
                            aspectRatio={1}
                            error={errors.front_image ? errors.front_image : ''}
                        />
                    </div>
                </CardContent>
            </Card>
            {/* vehicle image upload section end  */}

            {/* Action button */}
            <div className="my-5 flex justify-end">
                <Button
                    size={'sm'}
                    type="button"
                    onClick={handleSubmit}
                    disabled={processing}
                >
                    {processing && (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    )}
                    {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
            </div>
        </form>
    );
}
