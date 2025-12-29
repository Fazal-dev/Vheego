import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalizeWords(text: string = "") {
    if (!text) return "";
    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

type CurrencyInput = number | string | null | undefined;

export function formatCurrency(
    amount: CurrencyInput,
    locale: string = 'en-LK',
    currency: string = 'LKR'
): string {
    if (amount === null || amount === undefined || amount === '') {
        return '—';
    }

    let numericAmount: number;

    if (typeof amount === 'string') {
        numericAmount = Number(amount.replace(/,/g, ''));
    } else {
        numericAmount = amount;
    }

    if (Number.isNaN(numericAmount)) {
        return '—';
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(numericAmount);
}

