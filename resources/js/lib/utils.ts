import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

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

export function  addOneDay (date: Date)  {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        return d;
};

export function  getDays (startDate:Date,endDate:Date,startTime:string,endTime:string)  {
       
        return Math.max(
                  1,
                  Math.ceil(
                      (new Date(
                          `${format(endDate, 'yyyy-MM-dd')}T${endTime}`,
                      ).getTime() -
                          new Date(
                              `${format(startDate, 'yyyy-MM-dd')}T${startTime}`,
                          ).getTime()) /
                          (1000 * 60 * 60 * 24),
                  ),
              )
};

export function getTodayDate() { 
     const today:Date = new Date();
    today.setHours(0, 0, 0, 0);
    
    return today;
}

 export function generateTimeSlots(interval = 30) {
        const slots = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += interval) {
                const hour12 = h % 12 || 12;
                const ampm = h < 12 ? 'AM' : 'PM';
                const label = `${hour12}:${m
                    .toString()
                    .padStart(2, '0')} ${ampm}`;
              
                const value = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:00`;
                slots.push({ label, value });
            }
        }
        return slots;
    }


