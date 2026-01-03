import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import VehicleCard from '@/components/vehicle/vehicle-card';
import AppLayout from '@/layouts/app-layout';
import customer from '@/routes/customer';
import { Vehicle, VehicleSearchProps, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { CarFront, FilterX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Find Your Ride',
        href: customer.customerDashboard().url,
    },
];

export default function VehicleSearch({
    initialSearch = '',
    initialFilters = {},
    initialVehicles,
}: VehicleSearchProps) {
    const [search, setSearch] = useState(initialSearch || '');
    const [filters, setFilters] = useState(initialFilters);
    const [vehicleList, setVehicleList] = useState(initialVehicles || []);
    const shouldSearch = search.length === 0 || search.length >= 3;
    const [pagination, setPagination] = useState<any>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
                    setPagination(page.props.pagination);
                },
            },
        );
    }, [filters, search]);

    // Load more feature
    useEffect(() => {
        if (!pagination?.next_page_url || loadingMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLoadingMore(true);

                    router.get(
                        pagination.next_page_url,
                        {},
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onSuccess: (page) => {
                                setVehicleList((prev) => [
                                    ...prev,
                                    ...((page.props as any)
                                        .vehicles as Vehicle[]),
                                ]);
                                setPagination(page.props.pagination);
                                setLoadingMore(false);
                            },
                        },
                    );
                }
            },
            { rootMargin: '200px' },
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [pagination, loadingMore]);

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
                <div className="mb-8 grid grid-cols-2 gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
                    <div className="col-span-2 lg:col-span-1">
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
                            <SelectItem value=" ">Default</SelectItem>
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
                            <SelectItem value=" ">Default</SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort}
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, sort: val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by Price" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value=" ">Default</SelectItem>
                            <SelectItem value="price_asc">
                                Price: Low → High
                            </SelectItem>
                            <SelectItem value="price_desc">
                                Price: High → Low
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.seats}
                        onValueChange={(val) =>
                            setFilters((f) => ({ ...f, seats: val }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seats" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value=" ">Default</SelectItem>
                            <SelectItem value="4">4 or more</SelectItem>
                            <SelectItem value="5">5 or more</SelectItem>
                            <SelectItem value="6">6 or more</SelectItem>
                            <SelectItem value="7">7 or more</SelectItem>
                            <SelectItem value="8">8 or more</SelectItem>
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
                                    <SelectItem value=" ">Default</SelectItem>
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
                                        seats: '',
                                        sort: '',
                                    });
                                }}
                                className="h-6 w-6"
                            />
                        </div>
                    </div>
                </div>

                {/* 🚗 Vehicle Grid */}
                {vehicleList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {vehicleList.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                        <div ref={loadMoreRef} className="h-10" />
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
                                setFilters({
                                    type: '',
                                    transmission: '',
                                    fuel_type: '',
                                    seats: '',
                                    sort: '',
                                });
                            }}
                            className="mt-6 rounded-lg border bg-background px-5 py-2 text-sm font-medium transition hover:bg-muted"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {loadingMore && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Loading more vehicles...
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
