import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import owner from '@/routes/owner';
import { useForm } from '@inertiajs/react';
import { defineStepper } from '@stepperize/react';
import {
    Calendar,
    Check,
    FileText,
    ShieldCheck,
    UserCheck,
} from 'lucide-react';

// Adjusted Steps for the Owner
const OwnerStepper = defineStepper(
    { id: 'verify_renter', title: 'Renter verify', icon: UserCheck },
    { id: 'inspection', title: 'Inspection', icon: FileText },
    { id: 'release', title: 'Release', icon: ShieldCheck },
);

interface OwnerHandoverWizardProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: any;
}

export function StartTripOwnerWizard({
    open,
    onOpenChange,
    booking,
}: OwnerHandoverWizardProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {open && (
                <OwnerStepper.Scoped key={open ? 'open' : 'closed'}>
                    <HandoverContent
                        booking={booking}
                        onOpenChange={onOpenChange}
                    />
                </OwnerStepper.Scoped>
            )}
        </Dialog>
    );
}
interface StartTripOwnerForm {
    booking_id: number;
    checklist: string[];
}
function HandoverContent({
    booking,
    onOpenChange,
}: {
    booking: any;
    onOpenChange: any;
}) {
    const stepper = OwnerStepper.useStepper();
    const { data, setData, post, processing, errors, clearErrors } =
        useForm<StartTripOwnerForm>({
            booking_id: booking.id,
            checklist: [],
        });

    const handleNext = () => {
        clearErrors();

        if (stepper.state.isLast) {
            onOpenChange(false);
            return;
        }

        post(
            owner.bookings.validateStep.url({
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
        <DialogContent className="flex max-h-[95vh] w-[100vw] flex-col overflow-hidden p-0 sm:max-w-[700px]">
            <DialogHeader className="border-b bg-background p-4 pb-2">
                <DialogTitle className="mx-auto text-center text-xl font-bold">
                    {stepper.state.current.data.title}
                </DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto p-6">
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

                {/* Owner Step Content */}
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    {stepper.flow.switch({
                        verify_renter: () => (
                            <div className="flex flex-col items-start md:grid md:grid-cols-12 md:gap-8">
                                {/* TOP (Mobile) / RIGHT (Desktop): Renter Profile */}
                                <div className="mb-2 flex w-full flex-col items-center justify-center space-y-2 md:order-2 md:col-span-5 md:mb-0">
                                    <div className="relative w-full max-w-[200px] md:max-w-none">
                                        <div className="relative h-50 w-full overflow-hidden rounded-xl border-4 border-white shadow-xl">
                                            <img
                                                src={booking.renter_image}
                                                alt="Authorized Renter Profile"
                                                className="h-50 w-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-lg font-extrabold tracking-tight text-slate-900">
                                            {booking.renter_name}
                                        </p>
                                        <div className="mt-1 flex items-center justify-center gap-1.5 text-blue-600">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600"></span>
                                            <span className="text-[11px] font-black tracking-widest uppercase">
                                                Authorized Renter
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTTOM (Mobile) / LEFT (Desktop): Instructions */}
                                <div className="w-full space-y-5 md:order-1 md:col-span-7 md:border-r md:border-slate-100 md:pr-6">
                                    <div className="space-y-2">
                                        <p className="text-center text-sm leading-relaxed text-muted-foreground">
                                            Compare the digital profile photo
                                            with the physical person and their
                                            government-issued ID.
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <div className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <UserCheck className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-slate-900">
                                                    Driver's License
                                                </p>
                                                <p className="text-xs leading-normal text-muted-foreground">
                                                    Verify the name on the{' '}
                                                    <strong>
                                                        Physical License
                                                    </strong>{' '}
                                                    matches the name above
                                                    exactly.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="group flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 transition-colors">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-amber-900">
                                                    Check Expiry Date
                                                </p>
                                                <p className="text-xs leading-normal text-amber-800/80">
                                                    Check that the license is{' '}
                                                    <strong>
                                                        current and valid
                                                    </strong>
                                                    . An expired license
                                                    nullifies the insurance
                                                    policy.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile-only visual hint */}
                                    <div className="pt-2 md:hidden">
                                        <p className="text-center text-[10px] text-slate-400 italic">
                                            Scroll down to confirm and proceed
                                            to next step
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ),
                        inspection: () => {
                            const vehicleChecks = [
                                {
                                    id: 'exterior',
                                    label: 'Exterior Walkaround',
                                    sub: 'Inspect for new scratches, dents, or paint damage.',
                                },
                                {
                                    id: 'interior',
                                    label: 'Interior Condition',
                                    sub: 'Check for cleanliness, odors, and upholstery status.',
                                },
                                {
                                    id: 'emergency',
                                    label: 'Safety Equipment',
                                    sub: 'Verify spare tire, toolkit, and safety triangle are present.',
                                },
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
                                    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                                        <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                                        <p className="text-xs leading-tight font-medium">
                                            <strong>
                                                Pre-Trip Requirement:
                                            </strong>{' '}
                                            You must physically inspect these
                                            items. Ticking these boxes confirms
                                            you accept the vehicle's current
                                            condition as documented.
                                        </p>
                                    </div>

                                    <div className="grid gap-2">
                                        {vehicleChecks.map((doc) => (
                                            <button
                                                key={doc.id}
                                                type="button"
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
                                            ⚠️ {errors.checklist}
                                        </p>
                                    )}
                                </div>
                            );
                        },
                        release: () => (
                            <div className="space-y-6 py-4 text-center">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">
                                        Share Start Code
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Give this 4-digit code to{' '}
                                        <strong>{booking.renter_name}</strong>{' '}
                                        to start the trip.
                                    </p>
                                </div>
                                <div className="rounded-xl border-2 border-dashed border-primary bg-primary/10 p-8">
                                    <span className="text-6xl font-black tracking-[0.2em] text-primary">
                                        {booking.start_otp}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500">
                                    The trip status will update once the renter
                                    enters this code.
                                </div>
                            </div>
                        ),
                    })}
                </div>
            </div>

            <DialogFooter className="flex gap-2 border-t bg-slate-50 p-4">
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
                          ? 'Done'
                          : 'Continue'}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
