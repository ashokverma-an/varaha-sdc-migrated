import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from_date') || new Date().toISOString().split('T')[0];
    const toDate = searchParams.get('to_date') || new Date().toISOString().split('T')[0];
    const format = searchParams.get('format');

    const query = `
      SELECT 
        p.patient_id as id,
        p.date,
        h.hospital_name,
        p.doctor_name,
        p.patient_name,
        p.amount,
        c.category_name as category,
        COALESCE(p.payment_mode, 'Cash') as payment_mode
      FROM patients p
      LEFT JOIN hospitals h ON p.hospital_id = h.hospital_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE DATE(p.date) BETWEEN ? AND ?
      ORDER BY p.date DESC
    `;

    const revenueData = await dbQuery(query, [fromDate, toDate]);

    if (format === 'excel') {
      const excelData = generateRevenueExcel(revenueData, fromDate, toDate);
      return new NextResponse(excelData, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="REVENUE_REPORT_${fromDate}_to_${toDate}.xls"`
        }
      });
    }

    return NextResponse.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}

function generateRevenueExcel(revenueData: any[], fromDate: string, toDate: string): string {
  let excel = `<html><body><table border="1">`;
  excel += `<tr><th colspan="8">VARAHA SDC - REVENUE REPORT (${fromDate} to ${toDate})</th></tr>`;
  excel += `<tr><th>S.No</th><th>Date</th><th>Hospital</th><th>Doctor</th><th>Patient</th><th>Amount</th><th>Category</th><th>Payment Mode</th></tr>`;

  let totalAmount = 0;
  revenueData.forEach((revenue, index) => {
    totalAmount += parseFloat(revenue.amount || 0);
    excel += `<tr>`;
    excel += `<td>${index + 1}</td>`;
    const date = new Date(revenue.date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
    excel += `<td>${formattedDate}</td>`;
    excel += `<td>${revenue.hospital_name || 'N/A'}</td>`;
    excel += `<td>${revenue.doctor_name || 'N/A'}</td>`;
    excel += `<td>${revenue.patient_name || 'N/A'}</td>`;
    excel += `<td>${revenue.amount || 0}</td>`;
    excel += `<td>${revenue.category || 'N/A'}</td>`;
    excel += `<td>${revenue.payment_mode || 'Cash'}</td>`;
    excel += `</tr>`;
  });

  excel += `<tr><th colspan="5">TOTAL</th><th>${totalAmount}</th><th></th><th></th></tr>`;
  excel += `</table></body></html>`;

  return excel;
}