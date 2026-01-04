import { addOneDay, getDays, getTodayDate } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import customer from '@/routes/customer';

export default function BookingSummaryCard({ vehicle }: any) {
    const today: Date = getTodayDate();

    const [startDate, setStartDate] = useState<Date>(today);
    const [endDate, setEndDate] = useState<Date>(addOneDay(today));
    const [startTime, setStartTime] = useState('10:30:00');
    const [endTime, setEndTime] = useState('10:30:00');
    const startTimeRef = useRef<HTMLInputElement>(null);
    const endTimeRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const [pickupLocation, setPickupLocation] = useState(vehicle.location);

    const days =
        startDate && endDate
            ? getDays(startDate, endDate, startTime, endTime)
            : 0;

    const totalAmount = days * vehicle.daily_rental_price || 100;

    const handleCheckout = () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        const url = customer.checkout.url(vehicle.id) + `?days=${days}`;

        window.location.href = url;
    };

    return (
        <Card className="sticky top-24 h-fit border-1 border-green-300">
            <CardContent className="space-y-4 p-5">
                {/* Day Price */}
                <div className="text-2xl font-semibold">
                    {formatCurrency(vehicle.daily_rental_price)}
                    <span className="ml-1 text-sm text-muted-foreground">
                        / day
                    </span>
                </div>

                <Separator />

                {/* Pickup Date & Time*/}
                <div className="space-y-2">
                    <p className="text-sm font-medium"> Pickup </p>
                    <div className="flex flex-3 gap-2">
                        <div className="flex-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate
                                            ? format(startDate, 'PPP')
                                            : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            if (!date) return;

                                            setStartDate(date);
                                            document.activeElement instanceof
                                                HTMLElement &&
                                                document.activeElement.blur();

                                            startTimeRef.current?.focus();

                                            const minEndDate = addOneDay(date);
                                            if (endDate < minEndDate)
                                                setEndDate(minEndDate);
                                        }}
                                        disabled={{ before: today }}
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="">
                            <Input
                                type="time"
                                ref={startTimeRef}
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-[100px] appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Return Date & Time*/}
                <div className="space-y-2">
                    <p className="text-sm font-medium">Return </p>
                    <div className="flex flex-3 gap-2">
                        <div className="flex-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate
                                            ? format(endDate, 'PPP')
                                            : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => {
                                            if (!date) return;

                                            setEndDate(date);

                                            document.activeElement instanceof
                                                HTMLElement &&
                                                document.activeElement.blur();

                                            endTimeRef.current?.focus();
                                        }}
                                        disabled={{
                                            before: addOneDay(startDate),
                                        }}
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="">
                            <Input
                                type="time"
                                ref={endTimeRef}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-[100px] appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Pickup & Return Location
                    </p>
                    <Input
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        // disabled={!vehicle.allowCustomerChange}
                        placeholder={pickupLocation}
                    />
                </div>

                <Separator />

                {/* Calculation Summary */}
                {days > 0 && (
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>{days} day(s)</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>

                        <div className="flex justify-between text-base font-semibold">
                            <span>Total</span>
                            <span>{formatCurrency(totalAmount)}</span>
                        </div>
                    </div>
                )}

                <Button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full"
                    disabled={!startDate || !endDate || loading}
                >
                    {loading ? 'Proccessing...' : 'Continue'}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                    Free cancellation • No hidden fees
                </p>
            </CardContent>
        </Card>
    );
}
