import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatCard({
    title,
    value,
    icon,
    color = 'text-slate-600',
}: any) {
    return (
        <Card className="rounded-2xl border-l-4 border-l-gray-500 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {title}
                </CardTitle>
                <div className={color}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
