import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, Hash, MapPin } from 'lucide-react';

// Use the Booking interface you defined earlier
interface Booking {
    id: number;
    vehicle: string;
    model?: string;
    image: string;
    status: string;
    pickup: string;
    dropoff: string;
    startDate: string;
    endDate: string;
    payment_status: string;
    total_amount: string | number;
}

interface BookingDetailModalProps {
    selectedBooking: Booking | null;
    onClose: () => void;
    isNoCancle: boolean;
    onCancel: (booking: Booking) => void;
    statusMap: Record<string, { label: string; color: any; progress: number }>;
}

export function BookingDetailModal({
    selectedBooking,
    onClose,
    onCancel,
    statusMap,
    isNoCancle,
}: BookingDetailModalProps) {
    if (!selectedBooking) return null;

    return (
        <Dialog open={!!selectedBooking} onOpenChange={onClose}>
            <DialogContent className="max-w-lg rounded-2xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Booking Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Vehicle & Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={selectedBooking.image}
                                alt={selectedBooking.vehicle}
                                className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div>
                                <h3 className="text-md font-medium">
                                    {selectedBooking.vehicle}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedBooking.model || ''}
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant={statusMap[selectedBooking.status].color}
                        >
                            {statusMap[selectedBooking.status].label}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Booking Info Grid */}
                    <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                        <InfoItem
                            icon={MapPin}
                            label="Pickup Location"
                            value={selectedBooking.pickup}
                        />
                        <InfoItem
                            icon={MapPin}
                            label="Return Location"
                            value={selectedBooking.dropoff}
                        />
                        <InfoItem
                            icon={Clock}
                            label="Start Date"
                            value={selectedBooking.startDate}
                        />
                        <InfoItem
                            icon={Clock}
                            label="End Date"
                            value={selectedBooking.endDate}
                        />
                        <InfoItem
                            icon={Hash}
                            label="Booking ID"
                            value={selectedBooking.id}
                        />

                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Payment Status</p>
                                <Badge
                                    variant={
                                        selectedBooking.payment_status ===
                                        'Paid'
                                            ? 'default'
                                            : 'destructive'
                                    }
                                >
                                    {selectedBooking.payment_status}
                                </Badge>
                            </div>
                        </div>

                        <InfoItem
                            icon={Hash}
                            label="Total Amount"
                            value={selectedBooking.total_amount}
                        />
                    </div>

                    <Separator />

                    {/* Progress */}
                    <div>
                        <p className="mb-1 text-sm font-medium">
                            Booking Progress
                        </p>
                        <Progress
                            value={statusMap[selectedBooking.status].progress}
                        />
                    </div>

                    {/* Actions */}
                    {['Pending', 'Booked'].includes(selectedBooking.status) && (
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            {!isNoCancle && (
                                <Button
                                    variant="destructive"
                                    onClick={() => onCancel(selectedBooking)}
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Small helper component to keep the grid clean
function InfoItem({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-muted-foreground">{value}</p>
            </div>
        </div>
    );
}
