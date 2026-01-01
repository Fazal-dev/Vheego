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
import { Head, router } from '@inertiajs/react';
import { CarFront, FilterX } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Your Ride',
        href: customer.customerDashboard().url,
    },
];

interface VehicleSearchProps {
    initialSearch?: string;
    initialFilters?: {
        type?: string;
        transmission?: string;
        fuel_type?: string;
    };
    initialVehicles: Vehicle[];
}

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    type: string;
    transmission: string;
    fuel_type: string;
    daily_price: number;
    front_image_url: string;
    year: number;
}

export default function VehicleSearch({
    initialSearch = '',
    initialFilters = {},
    initialVehicles,
}: VehicleSearchProps) {
    const [search, setSearch] = useState(initialSearch || '');
    const [filters, setFilters] = useState(initialFilters);
    const [vehicleList, setVehicleList] = useState(initialVehicles || []);
    const shouldSearch = search.length === 0 || search.length >= 3;

    useEffect(() => {
        if (!shouldSearch) return;

        router.get(
            customer.findVehicle().url,
            {
                search: search,
                ...filters,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setVehicleList(page.props.vehicles as Vehicle[]);
                },
            },
        );
    }, [filters, search]);

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
                    <div className="grid grid-cols-3">
                        <div className="col-span-2">
                            <Select
                                onValueChange={(val) =>
                                    setFilters((f) => ({
                                        ...f,
                                        fuel_type: val,
                                    }))
                                }
                                value={filters.fuel_type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Fuel Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Petrol">
                                        Petrol
                                    </SelectItem>
                                    <SelectItem value="Diesel">
                                        Diesel
                                    </SelectItem>
                                    <SelectItem value="Hybrid">
                                        Hybrid
                                    </SelectItem>
                                    <SelectItem value="Electric">
                                        Electric
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mx-3 mt-2" title="Clear all filters">
                            <FilterX
                                onClick={() => {
                                    setSearch('');
                                    setFilters({
                                        type: '',
                                        transmission: '',
                                        fuel_type: '',
                                    });
                                }}
                                className="h-6 w-6"
                            />
                        </div>
                    </div>
                </div>

                {/* 🚗 Vehicle Grid */}
                {vehicleList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {vehicleList.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
                            <CarFront className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h2 className="text-lg font-semibold">
                            No vehicles found
                        </h2>

                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            We couldn’t find any rides matching your search. Try
                            adjusting filters or explore different options.
                        </p>

                        <button
                            onClick={() => {
                                setSearch('');
                                setFilters({});
                            }}
                            className="mt-6 rounded-lg border bg-background px-5 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
