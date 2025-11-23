import BackButton from '@/components/BackButton';
import OwnerDetails from '@/components/ownerDetails';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import VehicleDetailsCard from '@/components/vehicleDetailsCard';
import VehicleImagesSlider from '@/components/vehicleImagesSlider';
import AppLayout from '@/layouts/app-layout';
import { vehicleApproval, vehicleApprovals } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types/index';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicle Review',
        href: vehicleApproval().url,
    },
];

export default function reviewVehicle({
    vehicle,
    owner,
}: {
    vehicle: any;
    owner: any;
}) {
    const { post, processing, transform } = useForm({
        approval_status: '',
    });
    const [loadingButton, setLoadingButton] = useState<
        'approve' | 'reject' | null
    >(null);

    const handleAction = (status: 'Approved' | 'Rejected') => {
        setLoadingButton(status === 'Approved' ? 'approve' : 'reject');
        transform((data) => ({
            ...data,
            approval_status: status,
        }));
        post(vehicleApprovals({ vehicle: vehicle.id }).url, {
            onFinish: () => setLoadingButton(null), // reset after request finishes
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicle Review" />
            <div className="container mx-auto space-y-6 p-4">
                {/* button section */}
                <div className="grid grid-cols-2">
                    <BackButton
                        className="w-20"
                        onClick={() => router.visit(vehicleApproval().url)}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <form className="flex gap-3">
                            <Button
                                variant="destructive"
                                disabled={processing}
                                size={'sm'}
                                onClick={() => handleAction('Rejected')}
                            >
                                {loadingButton === 'reject' && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Reject
                            </Button>

                            <Button
                                variant="default"
                                size={'sm'}
                                disabled={processing}
                                onClick={() => handleAction('Approved')}
                            >
                                {loadingButton === 'approve' && (
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Approve
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <VehicleDetailsCard vehicle={vehicle} />
                    {/* Owner Details */}
                    <OwnerDetails owner={owner} />
                </div>

                <Separator />
                {/* image priview  */}
                <VehicleImagesSlider image_urls={vehicle.image_urls} />
            </div>
        </AppLayout>
    );
}
