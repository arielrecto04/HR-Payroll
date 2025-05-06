import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Button, Alert, Card, Table } from 'react-bootstrap';
import { formatCurrency, formatDate } from '@/utils';

export default function Payslips({ payroll }) {
    return (
        <AppLayout
            title="Payroll Payslips"
            renderHeader={() => (
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Payroll Payslips
                </h2>
            )}
        >
            <Head title="Payroll Payslips" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm sm:rounded-lg">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Payslip Details</h4>
                            <div>
                                <Link href={route('payroll.show', payroll.id)}>
                                    <Button variant="outline-secondary" size="sm" className="me-2">
                                        Back to Payroll
                                    </Button>
                                </Link>
                                <Button variant="outline-primary" size="sm" onClick={() => window.print()}>
                                    Print Payslip
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4 payslip-header text-center">
                                <h3 className="mb-1">Company Name</h3>
                                <p className="mb-1">Company Address</p>
                                <h4 className="mb-3 mt-4">PAYSLIP</h4>
                                <p className="mb-1">
                                    <strong>Pay Period:</strong> {payroll.payroll_period} ({formatDate(payroll.start_date)} - {formatDate(payroll.end_date)})
                                </p>
                                <p className="mb-3">
                                    <strong>Payment Date:</strong> {formatDate(payroll.payment_date)}
                                </p>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5>Employee Information</h5>
                                    <Table className="table-sm">
                                        <tbody>
                                            <tr>
                                                <th>Employee ID:</th>
                                                <td>{payroll.employee.employee_id}</td>
                                            </tr>
                                            <tr>
                                                <th>Name:</th>
                                                <td>{payroll.employee.last_name}, {payroll.employee.first_name} {payroll.employee.middle_name}</td>
                                            </tr>
                                            <tr>
                                                <th>Position:</th>
                                                <td>{payroll.employee.position}</td>
                                            </tr>
                                            <tr>
                                                <th>Department:</th>
                                                <td>{payroll.employee.department}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-md-6">
                                    <h5>Attendance Summary</h5>
                                    <Table className="table-sm">
                                        <tbody>
                                            <tr>
                                                <th>Days Worked:</th>
                                                <td>{payroll.days_worked}</td>
                                            </tr>
                                            <tr>
                                                <th>Overtime Hours:</th>
                                                <td>{payroll.overtime_hours}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h5>Earnings</h5>
                                    <Table className="table-sm">
                                        <tbody>
                                            <tr>
                                                <th>Regular Earnings:</th>
                                                <td className="text-end">{formatCurrency(payroll.regular_earnings)}</td>
                                            </tr>
                                            <tr>
                                                <th>Overtime Pay:</th>
                                                <td className="text-end">{formatCurrency(payroll.overtime_earnings)}</td>
                                            </tr>
                                            <tr>
                                                <th>Holiday Pay:</th>
                                                <td className="text-end">{formatCurrency(payroll.holiday_pay)}</td>
                                            </tr>
                                            <tr>
                                                <th>Allowances:</th>
                                                <td className="text-end">{formatCurrency(payroll.allowances)}</td>
                                            </tr>
                                            <tr>
                                                <th>Other Earnings:</th>
                                                <td className="text-end">{formatCurrency(payroll.other_earnings)}</td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <th>Total Gross Pay:</th>
                                                <td className="text-end">{formatCurrency(payroll.gross_pay)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                                <div className="col-md-6">
                                    <h5>Deductions</h5>
                                    <Table className="table-sm">
                                        <tbody>
                                            <tr>
                                                <th>SSS Contribution:</th>
                                                <td className="text-end">{formatCurrency(payroll.sss_contribution)}</td>
                                            </tr>
                                            <tr>
                                                <th>PhilHealth Contribution:</th>
                                                <td className="text-end">{formatCurrency(payroll.philhealth_contribution)}</td>
                                            </tr>
                                            <tr>
                                                <th>Pag-IBIG Contribution:</th>
                                                <td className="text-end">{formatCurrency(payroll.pagibig_contribution)}</td>
                                            </tr>
                                            <tr>
                                                <th>Tax Withheld:</th>
                                                <td className="text-end">{formatCurrency(payroll.tax_withheld)}</td>
                                            </tr>
                                            <tr>
                                                <th>Loan Deductions:</th>
                                                <td className="text-end">{formatCurrency(payroll.loan_deductions)}</td>
                                            </tr>
                                            <tr>
                                                <th>Other Deductions:</th>
                                                <td className="text-end">{formatCurrency(payroll.other_deductions)}</td>
                                            </tr>
                                            <tr className="fw-bold">
                                                <th>Total Deductions:</th>
                                                <td className="text-end">{formatCurrency(payroll.total_deductions)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 offset-md-6">
                                    <Table className="table-sm">
                                        <tbody>
                                            <tr className="fw-bold">
                                                <th>NET PAY:</th>
                                                <td className="text-end fs-5">{formatCurrency(payroll.net_pay)}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            {payroll.remarks && (
                                <div className="mt-4">
                                    <h5>Remarks</h5>
                                    <p>{payroll.remarks}</p>
                                </div>
                            )}

                            <div className="mt-5 pt-5">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="text-center">
                                            <div className="border-top border-dark w-75 mx-auto mt-5">
                                                <p className="mb-0 mt-2">Employer's Signature</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-center">
                                            <div className="border-top border-dark w-75 mx-auto mt-5">
                                                <p className="mb-0 mt-2">Employee's Signature</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-muted text-center">
                            <small>This is an electronic payslip. No signature required.</small>
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 