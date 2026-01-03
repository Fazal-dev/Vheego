import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { VehicleCardProps } from '@/types';
import { Link } from '@inertiajs/react';
import { Fuel, MapPin, Settings, Users } from 'lucide-react';

export default function VehicleCard({ vehicle }: VehicleCardProps) {
    return (
        <Link href={`/vehicles/${vehicle.id}`}>
            <Card className="overflow-hidden p-1 transition-all hover:-translate-y-1 hover:shadow-lg">
                {/* Image */}
                <CardHeader className="p-0">
                    <img
                        src={vehicle.front_image_url}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="h-48 w-full rounded-xl object-cover"
                    />
                </CardHeader>

                <CardContent className="space-y-3 p-3 pt-0">
                    {/* Title */}
                    <div>
                        <h2 className="text-lg leading-tight font-semibold">
                            {vehicle.brand} {vehicle.model}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {vehicle.year} · {vehicle.type}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {vehicle.location ?? 'City center pickup'}
                    </div>

                    {/* Specs */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {vehicle.seats} seats
                        </div>

                        <div className="flex items-center gap-1">
                            <Settings className="h-4 w-4" />
                            {vehicle.transmission}
                        </div>

                        <div className="flex items-center gap-1">
                            <Fuel className="h-4 w-4" />
                            {vehicle.fuel_type}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between border-t pt-3">
                        <div className="text-lg font-semibold text-primary">
                            {formatCurrency(vehicle.daily_price)}
                            <span className="ml-1 text-xs text-muted-foreground">
                                /day
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
