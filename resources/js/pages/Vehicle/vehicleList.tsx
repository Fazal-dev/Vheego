import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Chip } from '@/components/chip';
import vehicles from '@/routes/owner/vehicles';
import { Inertia } from '@inertiajs/inertia';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicles',
        href: index().url,
    },
];

const columns: ColumnDef<Vehicle>[] = [
    {
        id: 'index',
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'model',
        header: 'Model',
    },
    {
        accessorKey: 'brand',
        header: 'Brand',
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'license_plate',
        header: 'License Plate',
    },
    {
        accessorKey: 'fuel_type',
        header: 'Fuel Type',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;

            let variant: 'default' | 'success' | 'destructive' = 'default';

            if (status === 'Active') variant = 'success';
            else if (status === 'Inactive') variant = 'destructive';

            return <Chip variant={variant}>{status}</Chip>;
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const vehicle = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log(vehicle)}>
                            <Eye /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Pencil /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (
                                    confirm(
                                        'Are you sure you want to delete this vehicle?',
                                    )
                                ) {
                                    Inertia.delete(
                                        vehicles.destroy(vehicle.id).url,
                                    );
                                }
                            }}
                            className="text-red-600"
                        >
                            <Trash className="text-red-600" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
    const data = vehicles;
    const handleDelete = (vehicleId) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            Inertia.delete(vehicle.destroy(vehicleId).url); // ✅ typed URL
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle List" />
            <div className="dark:bg-dark-800 flex items-center justify-end rounded-lg bg-white p-4">
                <Button className="flex items-center space-x-1">
                    <Plus className="h-5 w-2" />
                    <span>New Vehicle</span>
                </Button>
            </div>

            <div className="dark:bg-dark-800 bg-whitepx-4 rounded-lg px-4 pt-0 pb-4 text-black dark:text-white">
                <DataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
