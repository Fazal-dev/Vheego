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
import { Textarea } from '@/components/ui/textarea'; // Added for review
import customer from '@/routes/customer';
import { useForm } from '@inertiajs/react';
import { defineStepper } from '@stepperize/react';
import { Gauge, KeyRound, Star } from 'lucide-react';
import ProgressStepper from '../custom-ui/stepper-nav';

const EndStepper = defineStepper(
    { id: 'odometer', title: 'Mileage', icon: Gauge },
    { id: 'review', title: 'Rating', icon: Star },
    { id: 'otp', title: 'Verify', icon: KeyRound },
);

interface EndTripWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setIsEndTrip: (isEndTrip: boolean) => void;
    booking: any;
}

interface EndTripForm {
    booking_id: number;
    odometer: string;
    rating: number;
    comment: string;
    otp: string;
}

export function EndTripWizard({
    open,
    onOpenChange,
    setIsEndTrip,
    booking,
}: EndTripWizardProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {open && (
                <EndStepper.Scoped key="end-trip">
                    <EndTripContent
                        booking={booking}
                        onOpenChange={onOpenChange}
                        setIsEndTrip={setIsEndTrip}
                    />
                </EndStepper.Scoped>
            )}
        </Dialog>
    );
}

function EndTripContent({
    booking,
    onOpenChange,
    setIsEndTrip,
}: {
    booking: any;
    onOpenChange: any;
    setIsEndTrip: any;
}) {
    const stepper = EndStepper.useStepper();

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<EndTripForm>({
            booking_id: booking.id,
            odometer: '',
            rating: 0,
            comment: '',
            otp: '',
        });

    const handleNext = () => {
        clearErrors();

        if (stepper.state.isLast) {
            post(customer.trips.endTrip.url(), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    setIsEndTrip(true);
                },
                onError: (errors) => {},
            });
            return;
        }

        post(
            customer.trips.endTripValidateStep.url({
                step: stepper.state.current.data.id,
            }),
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => stepper.navigation.next(),
            },
        );
    };

    return (
        <DialogContent className="flex max-h-[95vh] w-[95vw] flex-col overflow-hidden p-0 sm:max-w-[500px]">
            <DialogHeader className="border-b bg-background p-6 pb-2">
                <DialogTitle className="mx-auto text-xl font-bold">
                    {stepper.state.current.data.title}
                </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto p-6">
                <ProgressStepper stepper={stepper} />

                {/* Step Content Switcher */}
                <div className="duration-300 animate-in fade-in">
                    {stepper.flow.switch({
                        odometer: () => (
                            <div className="space-y-4">
                                <Label className="">
                                    Ending Odometer Reading
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Enter final KM"
                                    value={data.odometer}
                                    onChange={(e) =>
                                        setData('odometer', e.target.value)
                                    }
                                />
                                {errors.odometer && (
                                    <p className="text-xs text-destructive">
                                        {errors.odometer}
                                    </p>
                                )}
                            </div>
                        ),
                        review: () => (
                            <div className="space-y-6 text-center">
                                <Label className="text-lg">
                                    Rate your experience
                                </Label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setData('rating', star)
                                            }
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-10 w-10 ${data.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    placeholder="Any feedback for the owner? (Optional)"
                                    value={data.comment}
                                    onChange={(e) =>
                                        setData('comment', e.target.value)
                                    }
                                />
                                {errors.rating && (
                                    <p className="text-xs text-destructive">
                                        {errors.rating}
                                    </p>
                                )}
                                {errors.comment && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>
                        ),
                        otp: () => (
                            <div className="flex flex-col items-center justify-center space-y-6 py-4 text-center">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        Verify Handshake
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter the 4-digit code provided by the
                                        owner to confirm vehicle handover.
                                    </p>
                                </div>
                                <InputOTP
                                    maxLength={4}
                                    value={data.otp}
                                    onChange={(val) => setData('otp', val)}
                                >
                                    <InputOTPGroup className="flex gap-3">
                                        {[0, 1, 2, 3].map((i) => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className="h-14 w-12 rounded-md border-2 text-xl font-bold"
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                {errors.otp && (
                                    <p className="text-sm font-medium text-destructive">
                                        {errors.otp}
                                    </p>
                                )}

                                {errors.odometer && (
                                    <p className="mt-3 text-xs text-destructive">
                                        {errors.odometer}
                                    </p>
                                )}
                            </div>
                        ),
                    })}
                </div>
            </div>

            <DialogFooter className="flex flex-row justify-between gap-2 border-t bg-slate-50 p-4">
                <Button
                    variant="ghost"
                    onClick={() => stepper.navigation.prev()}
                    disabled={stepper.state.isFirst || processing}
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={
                        processing ||
                        (stepper.state.current.data.id === 'review' &&
                            data.rating === 0)
                    }
                    className={
                        stepper.state.isLast
                            ? 'bg-green-600 hover:bg-green-700'
                            : ''
                    }
                >
                    {processing
                        ? 'Saving...'
                        : stepper.state.isLast
                          ? 'Finish Trip'
                          : 'Next Step'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
