export default function PriceCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-blue-600">{value} LKR</p>
        </div>
    );
}
