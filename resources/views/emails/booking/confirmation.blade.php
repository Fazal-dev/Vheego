<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Booking Confirmed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            background-color: #f5f7fa;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 24px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            color: #1f2937;
            margin: 0;
        }

        .status {
            color: #16a34a;
            font-weight: bold;
        }

        .content p {
            margin: 12px 0;
        }

        .booking-box {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }

        .booking-box p {
            margin: 6px 0;
            font-size: 14px;
        }

        .highlight {
            font-weight: bold;
            color: #111827;
        }

        .footer {
            margin-top: 24px;
            font-size: 13px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="header">
            <h1>Booking Confirmed</h1>
        </div>

        <div class="content">
            <p>
                Hello {{ $booking->user->name ?? 'Valued Customer' }},
            </p>

            <p>
                Your booking has been <span class="status">successfully confirmed</span>.
                Below are your rental details:
            </p>

            <div class="booking-box">
                <p>
                    <span class="highlight">Booking ID:</span>
                    {{ $booking->id ?? 'N/A' }}
                </p>

                <p>
                    <span class="highlight">Vehicle:</span>
                    {{ $booking->vehicle->brand ?? '' }}
                    {{ $booking->vehicle->model ?? 'Vehicle' }}
                </p>

                <p>
                    <span class="highlight">Number Plate:</span>
                    {{ $booking->vehicle->license_plate ?? 'N/A' }}
                </p>

                <p>
                    <span class="highlight">Pickup Location:</span>
                    {{ $booking->pickup_location ?? 'As discussed' }}
                </p>

                <p>
                    <span class="highlight">Return Location:</span>
                    {{ $booking->pickup_location ?? 'Same as pickup' }}
                </p>

                <p>
                    <span class="highlight">Pickup Date:</span>
                    {{ $booking->start_date ?? '—' }}
                </p>

                <p>
                    <span class="highlight">Return Date:</span>
                    {{ $booking->end_date ?? '—' }}
                </p>

                <p>
                    <span class="highlight">Total Amount:</span>
                    {{ isset($booking->total_amount) ? number_format($booking->total_amount, 2) : '0.00' }}
                </p>

                <p>
                    <span class="highlight">Status:</span>
                    {{ ucfirst($booking->booking_status ?? 'Booked') }}
                </p>
            </div>

            <p>
                Please ensure you arrive on time for pickup and carry a valid driving license.
            </p>

            <p>
                Thank you for choosing {{ config('app.name') ?? 'our platform' }}.
                We wish you a safe and pleasant journey!
            </p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') ?? 'Company' }}. All rights reserved.
        </div>

    </div>
</body>

</html>
