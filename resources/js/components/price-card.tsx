import { ReactNode } from 'react';

interface PriceCardProps {
    title: string;
    value: number;
    icon?: ReactNode; // icon element to display
    iconBg?: string; // optional background color for the icon circle
    iconColor?: string; // optional icon color
}

export default function PriceCard({
    title,
    value,
    icon,
    iconBg = 'bg-blue-100',
    iconColor = 'text-blue-600',
}: PriceCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm">
            {icon && (
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
                >
                    <span className={`text-2xl ${iconColor}`}>{icon}</span>
                </div>
            )}
            <div className="flex flex-col">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-semibold text-blue-600">
                    {value} LKR
                </p>
            </div>
        </div>
    );
}
