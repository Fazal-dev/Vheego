import BackButton from '@/components/BackButton';
import OwnerDetails from '@/components/ownerDetails';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import VehicleDetailsCard from '@/components/vehicleDetailsCard';
import VehicleImagesSlider from '@/components/vehicleImagesSlider';
import AppLayout from '@/layouts/app-layout';
import { vehicleApproval } from '@/routes/admin';
import { type BreadcrumbItem } from '@/types/index';
import { Head, router, useForm } from '@inertiajs/react';

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
    const { post, processing } = useForm();

    const handleApprove = () => {};

    const handleReject = () => {};
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
                        <Button
                            variant="destructive"
                            disabled={processing}
                            size={'sm'}
                            onClick={handleReject}
                        >
                            Reject
                        </Button>

                        <Button
                            variant="default"
                            size={'sm'}
                            disabled={processing}
                            onClick={handleApprove}
                        >
                            Approve
                        </Button>
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
