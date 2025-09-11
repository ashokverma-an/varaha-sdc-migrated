import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sDate = searchParams.get('s_date');
    const format = searchParams.get('format');

    if (!sDate) {
      return NextResponse.json({ error: 'Date required' }, { status: 400 });
    }

    // Convert dd-mm-yyyy to yyyy-mm-dd for database query
    const dateParts = sDate.split('-');
    const dbDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const query = `
      SELECT p.*, d.dname as doctor_name, c.* 
      FROM patient_new p 
      JOIN doctor d ON d.d_id = p.doctor_name  
      JOIN console c ON c.c_p_cro = p.cro 
      WHERE c.added_on = ? AND c.status = 'Complete' 
      ORDER BY c.con_id ASC
    `;

    const data = await dbQuery(query, [dbDate]);

    if (format === 'excel') {
      const excelData = await generateConsoleExcelData(data, sDate);
      return new NextResponse(excelData, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="CONSOLE_REVENUE_${sDate}.xls"`
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in console report:', error);
    return NextResponse.json({ error: 'Failed to fetch console report' }, { status: 500 });
  }
}

async function generateConsoleExcelData(data: any[], sDate: string): Promise<string> {
  let excel = `<html><body><table border="1">`;
  excel += `<tr><th colspan="18">VARAHA SDC</th></tr>`;
  excel += `<tr><th colspan="18">CONSOLE REVENUE - ${sDate}</th></tr>`;
  excel += `<tr><th>S.No</th><th>CRO</th><th>NAME</th><th>DOCTOR NAME</th><th>AGE</th><th>CATEGORY</th><th>SCAN TYPE</th><th>FILMS</th><th>NUMBER OF SCAN</th><th>ISSUE CD/DVD</th><th>CONTRAST</th><th>PAID</th><th>FREE</th><th>AMOUNT</th><th>START TIME</th><th>END TIME</th><th>REMARK</th><th>STATUS</th></tr>`;

  let totalFilms = 0;
  let totalContrast = 0;
  let totalScans = 0;
  let totalAmount = 0;
  let totalPaid = 0;
  let totalFree = 0;
  let totalCd = 0;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Get scan types
    let scanTypes = '';
    let scanCount = 0;
    if (row.scan_type) {
      const scanIds = row.scan_type.split(',');
      for (const scanId of scanIds) {
        const scanQuery = `SELECT * FROM scan WHERE s_id = ?`;
        const scanData = await dbQuery(scanQuery, [scanId.trim()]);
        if (scanData.length > 0) {
          scanTypes += scanData[0].s_name + ',';
          scanCount += parseInt(scanData[0].total_scan || 0);
        }
      }
    }

    const cdIssued = row.issue_cd === 'Yes' ? 1 : 0;
    const isPaidCategory = !['BPL/POOR', 'Sn. CITIZEN', 'BHAMASHAH', 'RTA', 'JSSY', 'PRISONER'].includes(row.category);
    const paidScans = isPaidCategory ? scanCount : 0;
    const freeScans = isPaidCategory ? 0 : scanCount;

    totalFilms += parseInt(row.number_films || 0);
    totalContrast += parseInt(row.number_contrast || 0);
    totalScans += scanCount;
    totalAmount += parseFloat(row.amount || 0);
    totalPaid += paidScans;
    totalFree += freeScans;
    totalCd += cdIssued;

    excel += `<tr>`;
    excel += `<td>${i + 1}</td>`;
    excel += `<td>${row.cro || ''}</td>`;
    excel += `<td>${row.patient_name || ''}</td>`;
    excel += `<td>${row.doctor_name || ''}</td>`;
    excel += `<td>${row.age || ''}</td>`;
    excel += `<td>${row.category || ''}</td>`;
    excel += `<td>${scanTypes}</td>`;
    excel += `<td>${row.number_films || 0}</td>`;
    excel += `<td>${scanCount}</td>`;
    excel += `<td>${cdIssued}</td>`;
    excel += `<td>${row.number_contrast || 0}</td>`;
    excel += `<td>${paidScans}</td>`;
    excel += `<td>${freeScans}</td>`;
    excel += `<td>${row.amount || 0}</td>`;
    excel += `<td>${row.start_time || ''}</td>`;
    excel += `<td>${row.stop_time || ''}</td>`;
    excel += `<td>${row.remark || ''}</td>`;
    excel += `<td>${row.status || ''}</td>`;
    excel += `</tr>`;
  }

  excel += `<tr><th></th><th></th><th></th><th></th><th></th><th></th><th>TOTAL</th><th>${totalFilms}</th><th>${totalScans}</th><th>${totalCd}</th><th>${totalContrast}</th><th>${totalPaid}</th><th>${totalFree}</th><th>${totalAmount}</th><th></th><th></th><th></th><th></th></tr>`;
  excel += `</table></body></html>`;

  return excel;
}