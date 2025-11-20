import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import { reviewVehicle, vehicleApproval } from '@/routes/admin';
import { Vehicle_table, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { Chip } from '@/components/chip';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicle Approval Portal',
        href: vehicleApproval().url,
    },
];

export default function VehicleApprovalPage({
    vehicles,
}: {
    vehicles: Vehicle_table[];
}) {
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
                const id = row.original.id;
                return (
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.visit(reviewVehicle.url(id))}
                        title="Review Vehicle"
                    >
                        <Eye className="h-4 w-4 text-primary" />
                    </Button>
                );
            },
        },
    ];

    const data = vehicles;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Approval Portal" />
            <div className="dark:bg-dark-800 mt-3 rounded-lg bg-white px-4 pt-0 pb-4 text-black dark:text-white">
                <DataTable
                    filter_columns="license_plate"
                    columns={columns}
                    data={data}
                />
            </div>
        </AppLayout>
    );
}
