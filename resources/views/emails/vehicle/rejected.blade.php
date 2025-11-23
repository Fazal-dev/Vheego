<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Vehicle Rejected</title>
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
            color: #e53e3e;
            /* red for rejected */
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
            color: #e53e3e;
            /* red */
        }

        .update-link {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 15px;
            background-color: #3182ce;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Vehicle Rejected ❌</h1>
        </div>

        <div class="content">
            <p>Hello {{ $vehicle->owner->name ?? '' }},</p>

            <p>We regret to inform you that your vehicle has been <span class="status">Rejected</span>
                during our review process.</p>

            <div class="vehicle-details">
                <p><strong>Vehicle Number Plate:</strong> {{ $vehicle->license_plate ?? '' }}</p>
                <p><strong>Vehicle Name/Model:</strong> {{ $vehicle->model ?? '' }}</p>
            </div>

            <p>Please review and update your vehicle details to comply with our system requirements.</p>
            <p>Thank you for your cooperation,<br>{{ config('app.name') }}</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>

</html>
