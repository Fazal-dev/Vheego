import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import trips from '@/routes/customer/trips';
import { useForm } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { defineStepper } from '@stepperize/react';
import { Check, FileText, Fingerprint, Gauge, KeyRound } from 'lucide-react';

const MyStepper = defineStepper(
    { id: 'license', title: 'License', icon: Fingerprint },
    { id: 'vehicle_docs', title: 'Docs', icon: FileText },
    { id: 'odometer', title: 'Mileage', icon: Gauge },
    { id: 'otp', title: 'Verify', icon: KeyRound },
);

interface StartTripWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: any;
}
interface StartTripForm {
    booking_id: number;
    license_number: string;
    odometer: string;
    otp: string;
    checklist: string[];
}

export function StartTripWizard({
    open,
    onOpenChange,
    booking,
}: StartTripWizardProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {open && (
                <MyStepper.Scoped key={open ? 'open' : 'closed'}>
                    <StartTripContent
                        booking={booking}
                        onOpenChange={onOpenChange}
                    />
                </MyStepper.Scoped>
            )}
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

    const { data, setData, post, processing, errors, clearErrors } =
        useForm<StartTripForm>({
            booking_id: booking.id,
            license_number: '',
            odometer: '',
            otp: '',
            checklist: [],
        });

    const handleNext = () => {
        clearErrors();

        if (stepper.state.isLast) {
            post(trips.startTrip.url(), {
                onSuccess: () => onOpenChange(false),
            });
            return;
        }

        post(trips.validateStep.url({ step: stepper.state.current.data.id }), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => stepper.navigation.next(),
        });
    };

    return (
        <DialogContent className="flex max-h-[95vh] w-[95vw] flex-col overflow-hidden p-0 transition-all duration-300 ease-in-out sm:max-w-[500px]">
            <DialogHeader className="border-b bg-background p-6 pb-2">
                <DialogTitle className="mx-auto text-xl font-bold">
                    {stepper.state.current.data.title}
                </DialogTitle>
            </DialogHeader>
            <div className="scrollbar-thin scrollbar-thumb-rounded overflow-y-auto p-6">
                <nav aria-label="Progress" className="mt-2 mb-8">
                    <ol className="flex w-full items-center justify-between">
                        {stepper.state.all.map((step, index) => {
                            const isCompleted =
                                index < stepper.state.current.index;
                            const isActive =
                                index === stepper.state.current.index;
                            const StepIcon = step.icon;

                            return (
                                <li
                                    key={step.id}
                                    className="relative flex flex-1 flex-col items-center"
                                >
                                    {/* Line Connector */}
                                    {index !== 0 && (
                                        <div
                                            className={`absolute top-4 left-[-50%] h-0.5 w-full -translate-y-1/2 transition-colors duration-300 ${
                                                isCompleted || isActive
                                                    ? 'bg-primary'
                                                    : 'bg-muted'
                                            }`}
                                        />
                                    )}

                                    {/* Step Circle */}
                                    <div
                                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                            isActive
                                                ? 'scale-110 border-primary bg-primary text-primary-foreground shadow-md'
                                                : isCompleted
                                                  ? 'border-primary bg-primary text-primary-foreground'
                                                  : 'border-muted bg-background text-muted-foreground'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <StepIcon className="h-5 w-5" />
                                        )}
                                    </div>

                                    {/* Step Title */}
                                    <span
                                        className={`mt-2 text-[10px] font-bold tracking-wider uppercase ${
                                            isActive
                                                ? 'text-primary'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {step.title}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <div className="duration-300 animate-in fade-in zoom-in-95">
                    {/* 4. Use the switch method */}
                    {stepper.flow.switch({
                        license: () => (
                            <div className="space-y-5">
                                <Label>Driver's License Number</Label>
                                <Input
                                    value={data.license_number}
                                    onChange={(e) =>
                                        setData(
                                            'license_number',
                                            e.target.value,
                                        )
                                    }
                                    type="text"
                                    name="license_number"
                                    placeholder="0xxxxxxxxx"
                                    className="mt-3 mb-1"
                                />
                                {errors.license_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.license_number}
                                    </p>
                                )}
                            </div>
                        ),
                        vehicle_docs: () => {
                            const requiredDocs = [
                                { id: 'insurance', label: 'Insurance Copy' },
                                { id: 'v_book', label: 'Vehicle Book (CR)' },
                                { id: 'v_license', label: 'Vehicle License' },
                                { id: 'v_smog', label: 'Smog Test Report' },
                            ];

                            const toggleDoc = (id: string) => {
                                const current = data.checklist;
                                const updated = current.includes(id)
                                    ? current.filter((item) => item !== id)
                                    : [...current, id];
                                setData('checklist', updated);
                            };

                            return (
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                                        <strong>Renter Note:</strong> Please
                                        physically verify the photocopies
                                        provided by the owner before ticking.
                                    </div>

                                    <div className="grid gap-2">
                                        {requiredDocs.map((doc) => (
                                            <button
                                                key={doc.id}
                                                type="button" // Prevents form submission
                                                onClick={() =>
                                                    toggleDoc(doc.id)
                                                }
                                                className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                                                    data.checklist.includes(
                                                        doc.id,
                                                    )
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-slate-200 bg-white'
                                                }`}
                                            >
                                                <span className="text-sm font-medium">
                                                    {doc.label}
                                                </span>
                                                {data.checklist.includes(
                                                    doc.id,
                                                ) ? (
                                                    <Check className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.checklist && (
                                        <p className="text-xs text-destructive">
                                            {errors.checklist}
                                        </p>
                                    )}
                                </div>
                            );
                        },
                        odometer: () => (
                            <div className="space-y-4">
                                <Label>Current Odometer Reading</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter KM"
                                    name="odometer"
                                    value={data.odometer}
                                    onChange={(e) =>
                                        setData('odometer', e.target.value)
                                    }
                                    className="mt-3 mb-1"
                                />
                                {errors.odometer && (
                                    <p className="text-xs text-destructive">
                                        {errors.odometer}
                                    </p>
                                )}
                            </div>
                        ),
                        otp: () => (
                            <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold tracking-tight">
                                        Verify Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter the 4-digit code provided by the
                                        vehicle owner.
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={4}
                                        value={data.otp}
                                        onChange={(val) => setData('otp', val)}
                                    >
                                        <InputOTPGroup className="flex gap-3">
                                            {[0, 1, 2, 3].map((index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className="h-14 w-12 rounded-md border-2 text-xl font-bold"
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>

                                {errors.otp && (
                                    <p className="text-sm font-medium text-destructive">
                                        {errors.otp}
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
                    className="flex-1 sm:flex-none"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={processing}
                    className={`flex-1 sm:flex-none ${stepper.state.isLast ? 'bg-green-600 hover:bg-green-700' : ''}`}
                >
                    {processing
                        ? 'Processing...'
                        : stepper.state.isLast
                          ? 'Start Trip'
                          : 'Continue'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
