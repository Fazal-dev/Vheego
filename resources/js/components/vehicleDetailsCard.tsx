import { Chip } from '@/components/chip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function VehicleDetailsCard({ vehicle }: { vehicle: any }) {
    const vehicle_fields = [
        { label: 'Model', value: vehicle.model },
        { label: 'Brand', value: vehicle.brand },
        { label: 'Transmission', value: vehicle.transmission },
        { label: 'Fuel Type', value: vehicle.fuel_type },
        { label: 'Color', value: vehicle.color },
        { label: 'Vehicle Type', value: vehicle.vehicle_type },
        { label: 'Year of Manufacture', value: vehicle.year_of_manufacture },
        { label: 'Doors', value: vehicle.doors },
        { label: 'Seats', value: vehicle.seats },
        { label: 'Number Plate', value: vehicle.license_plate },
        {
            label: 'Registration Date',
            value: vehicle.registration_date,
        },
        {
            label: 'Registration Expiry',
            value: vehicle.registration_expiry_date,
        },
        {
            label: 'Engine Capacity',
            value: vehicle.engine_capacity,
        },
        {
            label: 'Engine Number',
            value: vehicle.engine_number,
        },
        {
            label: 'Status',
            value: (
                <Chip
                    variant={
                        vehicle.status === 'Active' ? 'success' : 'destructive'
                    }
                >
                    {vehicle.status}
                </Chip>
            ),
        },
    ];
    return (
        <Card className="col-span-4 space-x-3 md:col-span-3">
            <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 p-3 md:grid-cols-5">
                    {vehicle_fields.map((field, index) => (
                        <div key={index} className="mb-3">
                            <p className="text-sm text-muted-foreground">
                                {field.label}
                            </p>
                            <p className="font-semibold">{field.value}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
