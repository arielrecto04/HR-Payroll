<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Payslip</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .payslip-title {
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th,
        td {
            padding: 5px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            font-weight: bold;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
        }

        .amount {
            text-align: right;
        }

        .totals {
            font-weight: bold;
        }

        .net-pay {
            font-size: 14px;
            font-weight: bold;
        }

        .signature-section {
            margin-top: 50px;
        }

        .signature-line {
            margin-top: 40px;
            border-top: 1px solid #000;
            width: 200px;
            display: inline-block;
            text-align: center;
            margin-right: 30px;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 10px;
            color: #666;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="company-name">Company Name</div>
        <div>Company Address</div>
        <div class="payslip-title">PAYSLIP</div>
        <div>Pay Period: {{ $payroll->payroll_period }} ({{ date('M d, Y', strtotime($payroll->start_date)) }} -
            {{ date('M d, Y', strtotime($payroll->end_date)) }})</div>
        <div>Payment Date: {{ date('M d, Y', strtotime($payroll->payment_date)) }}</div>
    </div>

    <div class="section">
        <div class="section-title">Employee Information</div>
        <table>
            <tr>
                <th width="30%">Employee ID:</th>
                <td>{{ $payroll->employee->employee_id }}</td>
            </tr>
            <tr>
                <th>Name:</th>
                <td>{{ $payroll->employee->last_name }}, {{ $payroll->employee->first_name }}
                    {{ $payroll->employee->middle_name }}</td>
            </tr>
            <tr>
                <th>Position:</th>
                <td>{{ $payroll->employee->position }}</td>
            </tr>
            <tr>
                <th>Department:</th>
                <td>{{ $payroll->employee->department }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Attendance Summary</div>
        <table>
            <tr>
                <th width="30%">Days Worked:</th>
                <td>{{ $payroll->days_worked }}</td>
            </tr>
            <tr>
                <th>Overtime Hours:</th>
                <td>{{ $payroll->overtime_hours }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Earnings</div>
        <table>
            <tr>
                <th width="60%">Regular Earnings:</th>
                <td class="amount">₱{{ number_format($payroll->regular_earnings, 2) }}</td>
            </tr>
            <tr>
                <th>Overtime Pay:</th>
                <td class="amount">₱{{ number_format($payroll->overtime_earnings, 2) }}</td>
            </tr>
            <tr>
                <th>Holiday Pay:</th>
                <td class="amount">₱{{ number_format($payroll->holiday_pay, 2) }}</td>
            </tr>
            <tr>
                <th>Allowances:</th>
                <td class="amount">₱{{ number_format($payroll->allowances, 2) }}</td>
            </tr>
            <tr>
                <th>Other Earnings:</th>
                <td class="amount">₱{{ number_format($payroll->other_earnings, 2) }}</td>
            </tr>
            <tr class="totals">
                <th>Total Gross Pay:</th>
                <td class="amount">₱{{ number_format($payroll->gross_pay, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Deductions</div>
        <table>
            <tr>
                <th width="60%">SSS Contribution:</th>
                <td class="amount">₱{{ number_format($payroll->sss_contribution, 2) }}</td>
            </tr>
            <tr>
                <th>PhilHealth Contribution:</th>
                <td class="amount">₱{{ number_format($payroll->philhealth_contribution, 2) }}</td>
            </tr>
            <tr>
                <th>Pag-IBIG Contribution:</th>
                <td class="amount">₱{{ number_format($payroll->pagibig_contribution, 2) }}</td>
            </tr>
            <tr>
                <th>Tax Withheld:</th>
                <td class="amount">₱{{ number_format($payroll->tax_withheld, 2) }}</td>
            </tr>
            <tr>
                <th>Loan Deductions:</th>
                <td class="amount">₱{{ number_format($payroll->loan_deductions, 2) }}</td>
            </tr>
            <tr>
                <th>Other Deductions:</th>
                <td class="amount">₱{{ number_format($payroll->other_deductions, 2) }}</td>
            </tr>
            <tr class="totals">
                <th>Total Deductions:</th>
                <td class="amount">₱{{ number_format($payroll->total_deductions, 2) }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <table>
            <tr class="net-pay">
                <th width="60%">NET PAY:</th>
                <td class="amount">₱{{ number_format($payroll->net_pay, 2) }}</td>
            </tr>
        </table>
    </div>

    @if ($payroll->remarks)
        <div class="section">
            <div class="section-title">Remarks</div>
            <p>{{ $payroll->remarks }}</p>
        </div>
    @endif

    <div class="signature-section">
        <div class="signature-line">
            <div>Employer's Signature</div>
        </div>
        <div class="signature-line">
            <div>Employee's Signature</div>
        </div>
    </div>

    <div class="footer">
        This is an electronic payslip. No signature required.
    </div>
</body>

</html>