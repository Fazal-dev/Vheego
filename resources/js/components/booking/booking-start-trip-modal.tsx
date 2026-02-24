import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StartTripModalProps } from '@/types';
import { useState } from 'react';

export function StartTripModal({
    booking,
    open,
    onOpenChange,
}: StartTripModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [confirmed, setConfirmed] = useState(false);
    const [odometer, setOdometer] = useState('');

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleFinalSubmit = async () => {
        setLoading(true);
        // Use Inertia to post to Laravel
        // router.post(`/bookings/${booking.id}/start`, { odometer });
        setLoading(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Start Trip: {booking.vehicle}</DialogTitle>
                    <div className="text-xs text-muted-foreground">
                        Step {step} of 2
                    </div>
                </DialogHeader>

                <div className="py-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium">
                                Verify the following:
                            </p>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="keys"
                                    onCheckedChange={() =>
                                        setConfirmed(!confirmed)
                                    }
                                />
                                <Label htmlFor="keys">
                                    I have received the keys
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 pl-6 text-sm text-muted-foreground">
                                <p>
                                    Ensure the vehicle matches the photos
                                    provided by the owner.
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label htmlFor="odometer">
                                Current Odometer Reading
                            </Label>
                            <Input
                                id="odometer"
                                placeholder="Enter current mileage"
                                value={odometer}
                                onChange={(e) => setOdometer(e.target.value)}
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Tip: Taking a photo of the dashboard is
                                recommended for your records.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-row justify-between sm:justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>
                            Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 2 ? (
                        <Button onClick={handleNext} disabled={!confirmed}>
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinalSubmit}
                            disabled={!odometer || loading}
                        >
                            {loading ? 'Starting...' : 'Confirm & Start Trip'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
