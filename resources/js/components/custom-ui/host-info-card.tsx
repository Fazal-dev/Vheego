import { ShieldCheck, Star } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface HostInfoProps {
    hostName: string;
    joinDate: string; // ISO date string
    trips: number;
    avatarUrl?: string;
}

export function HostInfoCard({
    hostName,
    joinDate,
    trips,
    avatarUrl,
}: HostInfoProps) {
    const formattedJoinDate = new Date(joinDate).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="mt-6 rounded-xl bg-muted p-4">
            {/* Section Label */}
            <p className="mb-2 text-sm font-medium text-muted-foreground">
                Hosted by
            </p>

            <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="h-16 w-16">
                    <AvatarImage
                        src={
                            avatarUrl ??
                            `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
                                hostName,
                            )}`
                        }
                        alt={hostName}
                    />
                </Avatar>

                {/* Host info */}
                <div className="flex flex-col">
                    <p className="text-base font-semibold">{hostName}</p>
                    <p className="text-sm text-muted-foreground">
                        Member since {formattedJoinDate}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{trips} trips</span>
                        <Badge
                            variant="secondary"
                            className="border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-50"
                        >
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Top Rated Host
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
