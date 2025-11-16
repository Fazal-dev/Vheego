import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

export interface BackButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** If provided, the button will navigate to this href. Otherwise it calls history.back() */
    href?: string;
    /** Optional callback instead of default navigation */
    onNavigate?: (e?: React.MouseEvent) => void;
    /** Small text label to show next to the icon (default: "Back") */
    label?: string;
    /** Button variant from shadcn (keeps API compatible) */
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'secondary';
    /** Extra classname to merge */
    className?: string;
}

export default function BackButton({
    href,
    onNavigate,
    label = 'Back',
    variant = 'secondary',
    className = '',
    ...rest
}: BackButtonProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (rest.onClick) rest.onClick(e as any);

        if (onNavigate) {
            onNavigate(e);
            return;
        }

        // If href provided, let anchor/button behavior handle it (consumer can use <a> around)
        if (href) return;

        // default behavior: navigate back in history
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
        } else {
            // fallback: emit a popstate that apps can listen to or do nothing
            window.location.href = '/';
        }
    };

    // Render a semantic button that can be used anywhere. If you need an <a>, wrap this component or pass href and use anchor tag externally.
    return (
        <Button
            size="sm"
            variant={variant}
            onClick={handleClick}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 shadow-sm ${className}`}
            aria-label={label}
            {...rest}
        >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
}
