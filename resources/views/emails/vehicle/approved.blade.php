<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Vehicle Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eaeaea;
            border-radius: 8px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #2d3748;
        }

        .content p {
            margin: 10px 0;
        }

        .vehicle-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }

        .footer {
            margin-top: 25px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .status {
            font-weight: bold;
            color: #38a169;
            /* green */
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Vehicle Approved ✅</h1>
        </div>

        <div class="content">
            <p>Hello {{ $vehicle->owner->name ?? 'Fazal' }},</p>

            <p>We are pleased to inform you that your vehicle has been <span class="status">successfully approved</span>
                and is now ready for rental.</p>

            <div class="vehicle-details">
                <p><strong>Vehicle Number Plate:</strong> {{ $vehicle->license_plate ?? 'ABC 1233' }}</p>
                <p><strong>Vehicle Name/Model:</strong> {{ $vehicle->model ?? 'BM m3' }}</p>
            </div>

            <p>Your vehicle is now live in our system and can start generating bookings.</p>

            <p>Thank you for partnering with {{ config('app.name') }}.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>

</html>
