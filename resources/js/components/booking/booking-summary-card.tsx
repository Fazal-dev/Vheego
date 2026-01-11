import {
    addOneDay,
    generateTimeSlots,
    getDays,
    getTodayDate,
} from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import customer from '@/routes/customer';
import { router, usePage } from '@inertiajs/react';

export default function BookingSummaryCard({ vehicle }: any) {
    const { isAvailable } = usePage<{ isAvailable?: boolean }>().props;
    const today: Date = getTodayDate();
    const [startDate, setStartDate] = useState<Date>(today);
    const [endDate, setEndDate] = useState<Date>(addOneDay(today));
    const [startTime, setStartTime] = useState('10:30:00');
    const [endTime, setEndTime] = useState('10:30:00');
    const [loading, setLoading] = useState(false);
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setendOpen] = useState(false);
    const [checking, setChecking] = useState(false);

    const [pickupLocation, setPickupLocation] = useState(vehicle.location);

    const checkAvailability = (start: Date, end: Date) => {
        setChecking(true);

        router.post(
            customer.checkAvailability(),
            {
                vehicle_id: vehicle.id,
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setChecking(false);
                },
            },
        );
    };

    const days =
        startDate && endDate
            ? getDays(startDate, endDate, startTime, endTime)
            : 0;

    const canContinue = isAvailable === true && !checking && days > 0;

    const totalAmount = days > 0 ? days * vehicle.daily_rental_price : 0;

    const handleCheckout = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);

        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        const params = new URLSearchParams({
            days: String(days),
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            start_time: startTime,
            end_time: endTime,
            pickup_location: pickupLocation,
        });

        const url = customer.checkout.url(vehicle.id) + `?${params.toString()}`;

        window.location.href = url;
    };
    const timeSlots = generateTimeSlots(30);

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
                                            setStartOpen(true);

                                            const minEndDate = addOneDay(date);

                                            if (endDate < minEndDate) {
                                                setEndDate(minEndDate);
                                                checkAvailability(
                                                    date,
                                                    minEndDate,
                                                );
                                            } else {
                                                checkAvailability(
                                                    date,
                                                    endDate,
                                                );
                                            }
                                        }}
                                        disabled={{ before: today }}
                                        required
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="">
                            <Select
                                value={startTime}
                                onValueChange={setStartTime}
                                open={startOpen}
                                onOpenChange={setStartOpen}
                            >
                                <SelectTrigger
                                    className="w-[110px]"
                                    onClick={() => setStartOpen(true)}
                                >
                                    <SelectValue>
                                        {startTime
                                            ? timeSlots.find(
                                                  (t) => t.value === startTime,
                                              )?.label
                                            : 'Select time'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((t) => (
                                        <SelectItem
                                            key={t.value}
                                            value={t.value}
                                        >
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                            setendOpen(true);

                                            checkAvailability(startDate, date);
                                            document.activeElement instanceof
                                                HTMLElement &&
                                                document.activeElement.blur();
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
                            <Select
                                value={endTime}
                                onValueChange={setEndTime}
                                open={endOpen}
                                onOpenChange={setendOpen}
                            >
                                <SelectTrigger
                                    className="w-[110px]"
                                    onClick={() => setendOpen(true)}
                                >
                                    <SelectValue>
                                        {endTime
                                            ? timeSlots.find(
                                                  (t) => t.value === endTime,
                                              )?.label
                                            : 'Select time'}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((t) => (
                                        <SelectItem
                                            key={t.value}
                                            value={t.value}
                                        >
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {isAvailable === false && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-2">
                        <p className="text-center text-[13px] font-bold text-red-600">
                            Vehicle unavailable for selected dates
                        </p>
                    </div>
                )}

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

                {/* <Button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full"
                    disabled={isAvailable === false || checking || loading}
                >
                    {checking ? 'Checking...' : 'Continue'}
                </Button> */}
                {canContinue && (
                    <Button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full"
                        disabled={loading}
                    >
                        Continue
                    </Button>
                )}

                {checking && (
                    <p className="text-center text-xs text-muted-foreground">
                        Checking availability...
                    </p>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    Free cancellation • No hidden fees
                </p>
            </CardContent>
        </Card>
    );
}
