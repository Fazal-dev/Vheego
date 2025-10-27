import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { IndianRupee, MapPin } from 'lucide-react';
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
                <div className="mb-8 grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                    <div className="lg:col-span-2">
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
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, location: val }))
                        }
                        value={filters.location}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Colombo">Colombo</SelectItem>
                            <SelectItem value="Kandy">Kandy</SelectItem>
                            <SelectItem value="Kurunegala">
                                Kurunegala
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
                    {filteredVehicles.map((vehicle) => (
                        <Card
                            key={vehicle.id}
                            className="overflow-hidden transition-all hover:shadow-lg"
                        >
                            <CardHeader className="p-1">
                                <img
                                    src={vehicle.image}
                                    alt={`${vehicle.brand} ${vehicle.model}`}
                                    className="h-48 w-full object-cover"
                                />
                            </CardHeader>
                            <CardContent className="p-4">
                                <h2 className="text-lg font-semibold">
                                    {vehicle.brand} {vehicle.model}
                                </h2>
                                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />{' '}
                                    {vehicle.location}
                                </div>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-lg font-semibold text-primary">
                                        <IndianRupee className="mr-1 h-4 w-4" />{' '}
                                        {vehicle.price.toLocaleString()}
                                        <span className="ml-1 text-xs text-muted-foreground">
                                            /day
                                        </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {vehicle.type}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between gap-2 border-t p-4">
                                <Button size="sm" className="flex-1">
                                    Book Now
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1"
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
