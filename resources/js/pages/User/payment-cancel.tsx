import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import customer from '@/routes/customer';
import { CanclePaymentProps } from '@/types';
import { router } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

export default function PaymentCancel({
    vehicle,
    message,
}: CanclePaymentProps) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                    <XCircle className="h-14 w-14 text-red-500" />
                    <h1 className="text-xl font-semibold">
                        Payment Not Completed
                    </h1>
                    <p className="text-center text-sm text-muted-foreground">
                        {message}
                    </p>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Vehicle</span>
                        <span className="font-medium">
                            {vehicle.brand} {vehicle.model}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium text-red-500">
                            Cancelled
                        </span>
                    </div>
                </CardContent>

                <CardFooter className="flex-col-2 flex gap-3">
                    <Button
                        variant="outline"
                        className="w-full flex-1"
                        onClick={() =>
                            router.visit(customer.vehicleDetails(vehicle.id))
                        }
                    >
                        Back to Vehicle Details
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full flex-1"
                        onClick={() => router.visit(customer.findVehicle())}
                    >
                        Go to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
