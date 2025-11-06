import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';

import { MapPin } from 'lucide-react';
import 'react-advanced-cropper/dist/style.css';

export default function VehicleCard({ vehicle }) {
    return (
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
                        {'LKR '}
                        {vehicle.price.toLocaleString()}
                        <span className="ml-1 text-xs text-muted-foreground">
                            /day
                        </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {vehicle.type}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t p-4">
                <Button size="sm" className="flex-1">
                    Book Now
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}
