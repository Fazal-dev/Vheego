import { Car, Clock, LifeBuoy, MapPin, Star, Users } from 'lucide-react';

const benefits = [
    {
        icon: <MapPin className="h-5 w-5 text-primary" />,
        text: 'Skip the rental counter',
    },
    {
        icon: <Star className="h-5 w-5 text-primary" />,
        text: 'Use the app for pickup and return instructions',
    },
    {
        icon: <Users className="h-5 w-5 text-primary" />,
        text: 'Add additional drivers for free',
    },
    {
        icon: <Clock className="h-5 w-5 text-primary" />,
        text: '30-minute return grace period',
    },
    {
        icon: <Clock className="h-5 w-5 text-primary" />,
        text: 'No need to extend your trip unless you’re running more than 30 minutes late',
    },
    {
        icon: <Car className="h-5 w-5 text-primary" />,
        text: 'No need to wash the vehicle before returning it, but keep the vehicle tidy',
    },
    {
        icon: <LifeBuoy className="h-5 w-5 text-primary" />,
        text: 'Access to basic roadside assistance',
    },
    {
        icon: <Star className="h-5 w-5 text-primary" />,
        text: '24/7 customer support',
    },
];

export default function IncludeBenifits() {
    return (
        <div className="mt-6 rounded-xl bg-muted p-5">
            <h2 className="mb-4 text-lg font-semibold">
                Included in the Price
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        {b.icon}
                        <p className="text-sm text-muted-foreground">
                            {b.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
