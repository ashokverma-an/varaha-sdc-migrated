import { NextRequest, NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const format = searchParams.get('format');

    const reports = await dbQuery(`
      SELECT 
        id,
        c_p_cro,
        examination_id,
        number_films,
        number_contrast,
        number_scan,
        start_time,
        stop_time,
        technician_name,
        nursing_name,
        status,
        added_on,
        remark
      FROM console
      WHERE DATE(STR_TO_DATE(added_on, '%d-%m-%Y')) = ?
      ORDER BY id DESC
    `, [date]);

    if (format === 'excel') {
      const excelData = generateConsoleExcel(reports, date);
      const filename = `CONSOLE_DAILY_REPORT-${date}.xls`;
      
      return new NextResponse(excelData, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching console report:', error);
    return NextResponse.json({ error: 'Failed to fetch console report' }, { status: 500 });
  }
}

function generateConsoleExcel(reports: any[], date: string): string {
  let html = `
    <html>
    <meta http-equiv="Content-Type" content="text/html; charset=Windows-1252">
    <body>
    <table border="1">
      <tr>
        <th colspan="11" style="background-color:#2F75B5; color:white">VARAHA SDC - CONSOLE DAILY REPORT</th>
      </tr>
      <tr>
        <th style="background-color:#FFEA00; color:black" colspan="11">CONSOLE REPORT FOR ${date}</th>
      </tr>
      <tr>
        <th style="background-color:#2F75B5; color:white">S.No</th>
        <th style="background-color:#2F75B5; color:white">CRO</th>
        <th style="background-color:#2F75B5; color:white">Exam ID</th>
        <th style="background-color:#2F75B5; color:white">Films</th>
        <th style="background-color:#2F75B5; color:white">Contrast</th>
        <th style="background-color:#2F75B5; color:white">Scans</th>
        <th style="background-color:#2F75B5; color:white">Start Time</th>
        <th style="background-color:#2F75B5; color:white">Stop Time</th>
        <th style="background-color:#2F75B5; color:white">Technician</th>
        <th style="background-color:#2F75B5; color:white">Nursing</th>
        <th style="background-color:#2F75B5; color:white">Status</th>
      </tr>
  `;

  let totalScans = 0;
  let totalFilms = 0;
  let totalContrast = 0;

  reports.forEach((report, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${report.c_p_cro}</td>
        <td>${report.examination_id || ''}</td>
        <td style="text-align:center">${report.number_films}</td>
        <td style="text-align:center">${report.number_contrast}</td>
        <td style="text-align:center">${report.number_scan}</td>
        <td>${report.start_time || ''}</td>
        <td>${report.stop_time || ''}</td>
        <td>${report.technician_name || ''}</td>
        <td>${report.nursing_name || ''}</td>
        <td>${report.status}</td>
      </tr>
    `;
    totalScans += parseInt(report.number_scan) || 0;
    totalFilms += parseInt(report.number_films) || 0;
    totalContrast += parseInt(report.number_contrast) || 0;
  });

  html += `
      <tr>
        <th style="background-color:#FFEA00; color:black" colspan="3">Total</th>
        <th style="background-color:#FFEA00; color:black; text-align:center">${totalFilms}</th>
        <th style="background-color:#FFEA00; color:black; text-align:center">${totalContrast}</th>
        <th style="background-color:#FFEA00; color:black; text-align:center">${totalScans}</th>
        <th style="background-color:#FFEA00; color:black" colspan="5"></th>
      </tr>
    </table>
    </body>
    </html>
  `;

  return html;
}