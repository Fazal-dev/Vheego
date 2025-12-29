import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import VehicleCard from '@/components/VehicleCard';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Your Ride',
        href: customer.customerDashboard().url,
    },
];

const vehicles = [
    {
        id: 1,
        brand: 'BMW',
        model: 'M5',
        image: 'https://placehold.co/400x250?text=BMW+M5&font=roboto',
        type: 'Sedan',
        price: 15000,
        location: 'Colombo',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        year: 2025,
    },
    {
        id: 2,
        brand: 'Toyota',
        model: 'Fortuner',
        image: 'https://placehold.co/400x250?text=Toyota+Fortuner&font=roboto',
        type: 'SUV',
        price: 12000,
        location: 'Kandy',
        transmission: 'Manual',
        fuel_type: 'Diesel',
        year: 2025,
    },
    {
        id: 3,
        brand: 'Honda',
        model: 'Civic',
        image: 'https://placehold.co/400x250?text=Honda+Civic&font=roboto',
        type: 'Car',
        price: 9000,
        location: 'Kurunegala',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        year: 2025,
    },
    {
        id: 4,
        brand: 'Honda',
        model: 'Civic',
        image: 'https://placehold.co/400x250?text=Honda+Civic&font=roboto',
        type: 'Car',
        price: 9000,
        location: 'Kurunegala',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        year: 2025,
    },
    {
        id: 5,
        brand: 'Honda',
        model: 'Civic',
        image: 'https://placehold.co/400x250?text=Honda+Civic&font=roboto',
        type: 'Car',
        price: 9000,
        location: 'Kurunegala',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        year: 2025,
    },
    {
        id: 6,
        brand: 'Honda',
        model: 'Civic',
        image: 'https://placehold.co/400x250?text=Honda+Civic&font=roboto',
        type: 'Car',
        price: 9000,
        location: 'Kurunegala',
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        year: 2025,
    },
];

export default function vehicleSearch() {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        location: '',
        transmission: '',
        fuel_type: '',
    });

    const filteredVehicles = vehicles.filter((v) => {
        const matchesSearch =
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase());
        const matchesType = !filters.type || v.type === filters.type;
        const matchesLocation =
            !filters.location || v.location === filters.location;
        const matchesTransmission =
            !filters.transmission || v.transmission === filters.transmission;
        const matchesFuel =
            !filters.fuel_type || v.fuel_type === filters.fuel_type;
        return (
            matchesSearch &&
            matchesType &&
            matchesLocation &&
            matchesTransmission &&
            matchesFuel
        );
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Find Your Ride" />
            <div className="max-w-8xl mx-auto px-2 py-8">
                {/* Page Title */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Find Your Perfect Ride
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Search and filter vehicles available for rent near you.
                    </p>
                </div>

                {/* 🔍 Advanced Search Bar */}
                <div className="mb-8 grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Input
                            placeholder="Search by brand or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10"
                        />
                    </div>

                    <Select
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, type: val }))
                        }
                        value={filters.type}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Vehicle Type" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Motorbike">Motorbike</SelectItem>
                            <SelectItem value="ThreeWheeler">
                                Three-Wheeler
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, transmission: val }))
                        }
                        value={filters.transmission}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Transmission" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, fuel_type: val }))
                        }
                        value={filters.fuel_type}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Fuel Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Petrol">Petrol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 🚗 Vehicle Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVehicles.map((vehicle, index) => (
                        <VehicleCard key={index} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
