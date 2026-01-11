import { router } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import customer from '@/routes/customer';

export default function PaymentSuccess() {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <Card className="w-full max-w-md rounded-2xl shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    {/* Icon */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-semibold">
                        Payment Successful
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm text-muted-foreground">
                        Your booking is confirmed. We’ve sent a confirmation
                        email with the rental details.
                    </p>

                    {/* Divider */}
                    <div className="my-2 h-px w-full bg-border" />

                    {/* Actions */}
                    <div className="flex-col-2 flex w-full gap-2">
                        <Button
                            variant={'outline'}
                            className="w-full flex-1"
                            onClick={() => router.visit(customer.findVehicle())}
                        >
                            Find Another Vehicle
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full flex-1"
                            onClick={() => router.visit(customer.bookings())}
                        >
                            View My Bookings
                        </Button>
                    </div>

                    {/* Footer note */}
                    <p className="mt-2 text-xs text-muted-foreground">
                        Need help? Contact support anytime.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
