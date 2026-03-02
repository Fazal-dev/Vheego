import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

const ratings = [
    { label: '5 star', value: 85 },
    { label: '4 star', value: 10 },
    { label: '3 star', value: 3 },
    { label: '2 star', value: 1 },
    { label: '1 star', value: 1 },
];

export function ReviewSection(data: any) {
    data = data.data;
    if (!data || data.total_count === 0) {
        return (
            <div className="p-5 text-muted-foreground italic">
                No reviews yet for this vehicle.
            </div>
        );
    }
    return (
        <div className="mt-12 space-y-8 p-5">
            <h2 className="text-2xl font-bold">Reviews</h2>

            <div className="grid grid-cols-1 items-center gap-8 border-b pb-8 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-6xl font-black text-slate-900">
                        {data.average_rating}
                    </span>
                    <div className="my-2 flex">
                        {/* Render stars based on average */}
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-5 w-5 ${i < Math.floor(data.average_rating) ? 'fill-yellow-500 text-yellow-500' : 'text-slate-300'}`}
                            />
                        ))}
                    </div>
                    <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                        {data.total_count} Ratings
                    </p>
                </div>

                <div className="space-y-2">
                    {/* Render dynamic distribution from PHP */}
                    {Object.entries(data.distribution)
                        .reverse()
                        .map(([label, stats]: [string, any]) => (
                            <div
                                key={label}
                                className="flex items-center gap-4"
                            >
                                <span className="w-12 text-sm font-medium whitespace-nowrap">
                                    {label}
                                </span>
                                <Progress
                                    value={stats.percentage}
                                    className="h-2 bg-slate-100"
                                />
                                <span className="w-8 text-sm text-muted-foreground">
                                    {stats.percentage}%
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            <div className="space-y-8">
                {data.list.map((review: any) => (
                    <div
                        key={review.id}
                        className="border-b pb-8 last:border-0"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={review.user_avatar} />
                                    <AvatarFallback>
                                        {review.user_name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {review.user_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {review.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? 'fill-slate-900 text-slate-900' : 'text-slate-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
