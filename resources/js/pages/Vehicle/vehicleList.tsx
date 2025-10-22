import AppLayout from '@/layouts/app-layout';
import { create, destroy, edit, index } from '@/routes/owner/vehicles';
import { Vehicle_table, type BreadcrumbItem } from '@/types';
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

import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Vehicles',
        href: index().url,
    },
];

export default function VehicleList({
    vehicles,
}: {
    vehicles: Vehicle_table[];
}) {
    const data = vehicles;

    const handleVehicleDelete = (vehicleId: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3078f0',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(destroy(vehicleId).url);
            }
        });
    };

    const columns: ColumnDef<Vehicle_table>[] = [
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
            accessorKey: 'transmission',
            header: 'Transmission',
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
                            <DropdownMenuItem>
                                <Eye /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.get(edit(vehicle.id))}
                            >
                                <Pencil /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    handleVehicleDelete(vehicle.id);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle List" />
            <div className="dark:bg-dark-800 flex items-center justify-end rounded-lg bg-white p-4">
                <Button
                    variant={'default'}
                    size={'sm'}
                    className="flex items-center space-x-0.5"
                    onClick={() => router.visit(create().url)}
                >
                    <Plus className="h-3 w-2" />
                    New Vehicle
                </Button>
            </div>

            <div className="dark:bg-dark-800 bg-whitepx-4 rounded-lg px-4 pt-0 pb-4 text-black dark:text-white">
                <DataTable
                    filter_columns="license_plate"
                    columns={columns}
                    data={data}
                />
            </div>
        </AppLayout>
    );
}
