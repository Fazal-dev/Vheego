import VehicleForm from '@/components/VehicleForm';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/owner/vehicles';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function VehicleCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: '',
            href: index().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Create" />
            <div className="dark:bg-dark-800 bg-whitepx-4 rounded-lg px-4 pt-0 pb-4 text-black dark:text-white">
                <VehicleForm />
            </div>
        </AppLayout>
    );
}
