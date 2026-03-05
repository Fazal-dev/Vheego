import { Check } from 'lucide-react';

export default function ProgressStepper({ stepper }: any) {
    if (!stepper || !stepper.state) return null;

    return (
        <nav aria-label="Progress" className="mb-8 w-full">
            <ol className="flex w-full items-center justify-between">
                {stepper.state.all.map((step, index) => {
                    const isCompleted = index < stepper.state.current.index;
                    const isActive = index === stepper.state.current.index;
                    const StepIcon = step.icon;

                    return (
                        <li
                            key={step.id}
                            className="relative flex flex-1 flex-col items-center"
                        >
                            {/* Connector Line */}
                            {index !== 0 && (
                                <div
                                    className={`absolute top-5 left-[-50%] h-0.5 w-full -translate-y-1/2 ${
                                        isCompleted || isActive
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                    }`}
                                />
                            )}

                            {/* Circle */}
                            <div
                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                    isActive || isCompleted
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted bg-background text-muted-foreground'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    StepIcon && <StepIcon className="h-5 w-5" />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-2 text-[10px] font-bold tracking-wide uppercase ${
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
    );
}
