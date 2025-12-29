import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { MapPin } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
    return (
        <Link href={`/vehicles/${vehicle.id}`}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="p-1">
                    <img
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-48 w-full object-cover"
                    />
                </CardHeader>
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold">
                        {vehicle.model} {vehicle.year}
                    </h2>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-4 w-4" /> {vehicle.location}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-lg font-semibold text-primary">
                            {formatCurrency(vehicle.price)}
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
