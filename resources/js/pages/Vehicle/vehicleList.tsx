import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { Vehicle, type BreadcrumbItem } from '@/types';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicles',
        href: index().url,
    },
];

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
    const data = vehicles;
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                            <DropdownMenuItem
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Eye /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Pencil /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    router.delete(
                                        vehicles.destroy(vehicle.id).url,
                                    );
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
                <Button className="flex items-center space-x-1">
                    <Plus className="h-5 w-2" />
                    <span>New Vehicle</span>
                </Button>
            </div>

            <div className="dark:bg-dark-800 bg-whitepx-4 rounded-lg px-4 pt-0 pb-4 text-black dark:text-white">
                <DataTable columns={columns} data={data} />
            </div>
            {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogTitle>
                            {' '}
                            <h3>Vehicle Details</h3>
                        </DialogTitle>
                        <DialogDescription>
                            <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                                <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                                    <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                                        <h1 className="mb-1 font-medium">
                                            Let's get started
                                        </h1>
                                        <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                            Laravel has an incredibly rich
                                            ecosystem.
                                            <br />
                                            We suggest starting with the
                                            following.
                                        </p>
                                        <ul className="mb-4 flex flex-col lg:mb-6">
                                            <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                                <span className="relative bg-white py-1 dark:bg-[#161615]">
                                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                                    </span>
                                                </span>
                                                <span>
                                                    Read the
                                                    <a
                                                        href="https://laravel.com/docs"
                                                        target="_blank"
                                                        className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                                    >
                                                        <span>
                                                            Documentation
                                                        </span>
                                                        <svg
                                                            width={10}
                                                            height={11}
                                                            viewBox="0 0 10 11"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-2.5 w-2.5"
                                                        >
                                                            <path
                                                                d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                                stroke="currentColor"
                                                                strokeLinecap="square"
                                                            />
                                                        </svg>
                                                    </a>
                                                </span>
                                            </li>
                                            <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                                <span className="relative bg-white py-1 dark:bg-[#161615]">
                                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                                    </span>
                                                </span>
                                                <span>
                                                    Watch video tutorials at
                                                    <a
                                                        href="https://laracasts.com"
                                                        target="_blank"
                                                        className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                                    >
                                                        <span>Laracasts</span>
                                                        <svg
                                                            width={10}
                                                            height={11}
                                                            viewBox="0 0 10 11"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-2.5 w-2.5"
                                                        >
                                                            <path
                                                                d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                                stroke="currentColor"
                                                                strokeLinecap="square"
                                                            />
                                                        </svg>
                                                    </a>
                                                </span>
                                            </li>
                                        </ul>
                                        <ul className="flex gap-3 text-sm leading-normal">
                                            <li>
                                                <a
                                                    href="https://cloud.laravel.com"
                                                    target="_blank"
                                                    className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                                >
                                                    Deploy now
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </main>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
