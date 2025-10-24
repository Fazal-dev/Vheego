export default function Detail({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-800">{value || '-'}</p>
        </div>
    );
}
