import { cn } from '@/lib/utils'; // utility to merge classNames
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

// 1️⃣ Define the Chip variants using cva
const chipVariants = cva(
    'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full w-fit whitespace-nowrap',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800',
                success: 'bg-green-100 text-green-800',
                destructive: 'bg-red-100 text-red-800',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

// 2️⃣ Chip component
interface ChipProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof chipVariants> {}

export const Chip: React.FC<ChipProps> = ({
    variant,
    className,
    children,
    ...props
}) => {
    return (
        <span className={cn(chipVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
};
