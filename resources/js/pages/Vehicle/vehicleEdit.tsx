import VehicleForm from '@/components/VehicleForm';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { BreadcrumbItem, VehicleFormProps } from '@/types';
import { Head } from '@inertiajs/react';

export default function VehicleEdit({ vehicle }: VehicleFormProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit Vehicle',
            href: index().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Edit" />
            <div className="dark:bg-dark-800 bg-whitepx-4 rounded-lg px-4 pt-0 pb-4 text-black dark:text-white">
                <VehicleForm vehicle={vehicle} />
            </div>
        </AppLayout>
    );
}
