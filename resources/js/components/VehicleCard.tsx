import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface VehicleCardProps {
    vehicle: {
        id: number;
        brand: string;
        model: string;
        year: number;
        daily_price: number;
        type: string;
        front_image_url: string;
    };
}
export default function VehicleCard({ vehicle }: VehicleCardProps) {
    return (
        <Link href={`/vehicles/${vehicle.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="p-1">
                    <img
                        src={vehicle.front_image_url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-48 w-full object-cover"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold">
                        {vehicle.model} {vehicle.year}
                    </h2>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-lg font-semibold text-primary">
                            {formatCurrency(vehicle.daily_price)}
                            <span className="ml-1 text-xs text-muted-foreground">
                                /day
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {vehicle.type}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
