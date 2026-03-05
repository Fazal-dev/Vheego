import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import owner from '@/routes/owner';
import { useForm, usePage } from '@inertiajs/react';
import { defineStepper } from '@stepperize/react';
import { Gauge, KeyRound, ShieldCheck } from 'lucide-react';
import ProgressStepper from '../custom-ui/stepper-nav';
import { Checkbox } from '../ui/checkbox';

const OwnerEndStepper = defineStepper(
    { id: 'inspection', title: 'Inspection', icon: ShieldCheck },
    { id: 'mileage', title: 'Final KM', icon: Gauge },
    { id: 'handshake', title: 'Close Trip', icon: KeyRound },
);

interface EndTripWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setIsEndTrip: (isEndTrip: boolean) => void;
    booking: any;
}

interface OwnerEndTripForm {
    booking_id: number;
    odometer: string;
    rating: number;
    comment: string;
    otp: string;
}

export function OwnerEndTripWizard({
    open,
    onOpenChange,
    setIsEndTrip,
    booking,
}: EndTripWizardProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {open && (
                <OwnerEndStepper.Scoped key="end-trip">
                    <OwnerEndTripContent
                        booking={booking}
                        onOpenChange={onOpenChange}
                        setIsEndTrip={setIsEndTrip}
                    />
                </OwnerEndStepper.Scoped>
            )}
        </Dialog>
    );
}

function OwnerEndTripContent({
    booking,
    onOpenChange,
    setIsEndTrip,
}: {
    booking: any;
    onOpenChange: any;
    setIsEndTrip: any;
}) {
    const stepper = OwnerEndStepper.useStepper();

    const { otp } = usePage<{ otp?: number }>().props;

    const { data, setData, post, processing, errors } = useForm({
        booking_id: booking.id,
        damage_checked: false,
        end_odometer: booking.start_odometer || '',
        end_otp: '',
    });

    const handleNext = () => {
        if (stepper.state.isLast) {
            onOpenChange(false);
            setIsEndTrip(true);
            return;
        }
        // Validate step and generate the Return OTP at the last step
        post(
            owner.bookings.endTripValidateStep.url({
                step: stepper.state.current.data.id,
            }),
            {
                preserveState: true,
                onSuccess: (page: any) => {
                    stepper.navigation.next();
                },
            },
        );
    };

    return (
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle className="text-center">
                    {stepper.state.current.data.title}
                </DialogTitle>
            </DialogHeader>

            <ProgressStepper stepper={stepper} />

            <div className="flex min-h-[200px] flex-col justify-center py-6">
                {stepper.flow.switch({
                    inspection: () => (
                        <div className="space-y-4">
                            <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
                                <p className="text-sm font-medium text-orange-800">
                                    Walk around the vehicle and check for:
                                </p>
                                <ul className="mt-2 ml-5 list-disc space-y-1 text-xs text-orange-700">
                                    <li>New dents or scratches</li>
                                    <li>Interior cleanliness & smells</li>
                                    <li>Fuel level matches agreement</li>
                                </ul>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="damage"
                                    checked={data.damage_checked}
                                    onCheckedChange={(val) =>
                                        setData('damage_checked', !!val)
                                    }
                                />
                                <Label
                                    htmlFor="damage"
                                    className="cursor-pointer text-sm"
                                >
                                    I have inspected the vehicle condition
                                </Label>

                                {errors.damage_checked && (
                                    <p className="mt-3 text-xs text-destructive">
                                        {errors.damage_checked}
                                    </p>
                                )}
                            </div>
                        </div>
                    ),
                    mileage: () => (
                        <div className="space-y-4">
                            <Label>Current Odometer Reading (KM)</Label>
                            <Input
                                type="number"
                                value={data.end_odometer}
                                onChange={(e) =>
                                    setData('end_odometer', e.target.value)
                                }
                                placeholder="Enter final reading"
                            />
                            <p className="text-[11px] text-muted-foreground">
                                Starting KM was:{' '}
                                <strong>{booking.start_odometer} KM</strong>
                            </p>
                            {errors.end_odometer && (
                                <p className="text-xs text-red-500">
                                    {errors.end_odometer}
                                </p>
                            )}
                        </div>
                    ),
                    handshake: () => (
                        <div className="space-y-4 text-center">
                            <p className="text-sm text-muted-foreground">
                                Provide this code to the renter to complete the
                                return:
                            </p>
                            <div className="rounded-lg border-2 border-dashed border-green-200 bg-slate-50 py-6 font-mono text-6xl font-bold tracking-[0.2em] text-green-600">
                                {otp || '----'}
                            </div>
                            <p className="text-[10px] tracking-widest text-slate-400 uppercase">
                                Single Use Code
                            </p>
                        </div>
                    ),
                })}
            </div>

            <DialogFooter className="-m-6 mt-4 flex justify-between rounded-b-lg bg-slate-50 p-4">
                <Button
                    variant="ghost"
                    onClick={() => stepper.navigation.prev()}
                    disabled={stepper.state.isFirst || processing}
                >
                    Back
                </Button>
                <Button onClick={() => handleNext()} disabled={processing}>
                    {processing
                        ? 'processing...'
                        : stepper.state.isLast
                          ? 'Done'
                          : 'Next Step'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
