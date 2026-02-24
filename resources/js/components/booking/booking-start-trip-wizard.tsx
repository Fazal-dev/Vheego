import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { defineStepper } from '@stepperize/react';
import { useState } from 'react';

const MyStepper = defineStepper(
    { id: 'license', title: "Driver's License" },
    { id: 'vehicle_docs', title: 'Vehicle Docs Check' },
    { id: 'odometer', title: 'Mileage & Book' },
    { id: 'otp', title: 'Owner Verification' },
);

interface StartTripWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: any;
}
export function StartTripWizard({
    open,
    onOpenChange,
    booking,
}: StartTripWizardProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <MyStepper.Scoped>
                <StartTripContent
                    booking={booking}
                    onOpenChange={onOpenChange}
                />
            </MyStepper.Scoped>
        </Dialog>
    );
}

function StartTripContent({
    booking,
    onOpenChange,
}: {
    booking: any;
    onOpenChange: any;
}) {
    const stepper = MyStepper.useStepper();
    const [otp, setOtp] = useState('');

    if (!stepper.state.current) {
        return <DialogContent>Loading...</DialogContent>;
    }
    return (
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                    {stepper.state.current.data.title}
                </DialogTitle>
            </DialogHeader>
            <div className="min-h-[250px] py-4">
                {/* 4. Use the switch method */}
                {stepper.flow.switch({
                    license: () => (
                        <div className="space-y-4">
                            <Label>Upload Driver's License</Label>
                            {/* License UI */}
                        </div>
                    ),
                    vehicle_docs: () => (
                        <div className="space-y-3">
                            <Label>Checklist</Label>
                        </div>
                    ),
                    odometer: () => (
                        <div className="space-y-4">
                            <Label>Current Odometer</Label>
                            <Input type="number" placeholder="Enter KM" />
                        </div>
                    ),
                    otp: () => (
                        <div className="py-4 text-center">
                            <InputOTP
                                maxLength={4}
                                value={otp}
                                onChange={setOtp}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    ),
                })}
            </div>

            <DialogFooter className="flex flex-row justify-between border-t pt-4">
                <Button
                    variant="ghost"
                    onClick={() => stepper.navigation.prev()}
                    disabled={stepper.state.isFirst}
                >
                    Back
                </Button>
                <Button
                    onClick={() =>
                        stepper.state.isLast
                            ? console.log('Final Submit')
                            : stepper.navigation.next()
                    }
                    className={
                        stepper.state.isLast
                            ? 'bg-green-600 hover:bg-green-700'
                            : ''
                    }
                >
                    {stepper.state.isLast ? 'Start Trip' : 'Continue'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
