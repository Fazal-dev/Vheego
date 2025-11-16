export default function VehicleImageGuide() {
    return (
        <div className="mt-4 mb-4 rounded-md bg-blue-50 p-4 text-sm text-gray-700">
            <h4 className="mb-2 font-semibold text-blue-800">
                📸 Vehicle Photo Guidelines
            </h4>
            <ul className="list-disc space-y-1 pl-5">
                <li>
                    Upload <strong>clear and well-lit</strong> images of your
                    vehicle.
                </li>
                <li>
                    Include all major angles:{' '}
                    <strong>Front, Back, Left, Right,</strong> and{' '}
                    <strong>Interior</strong>.
                </li>
                <li>
                    Ensure the entire vehicle is visible — avoid cutting off
                    parts.
                </li>
                <li>
                    Use a <strong>plain background</strong> (preferably outdoors
                    in daylight).
                </li>
                <li>
                    Make sure the vehicle is{' '}
                    <strong>clean and undamaged</strong> in all photos.
                </li>
                <li>
                    Interior photo should clearly show the{' '}
                    <strong>dashboard and seats</strong>.
                </li>
                <li>
                    Accepted formats: <strong>JPG, PNG</strong> (max 5 MB per
                    image).
                </li>
            </ul>
        </div>
    );
}
