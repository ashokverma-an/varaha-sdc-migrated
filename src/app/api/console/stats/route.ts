import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'varaosrc_prc',
  password: 'PRC!@#456&*(',
  database: 'varaosrc_hospital_management',
  port: 3306,
  connectTimeout: 30000
};

export async function GET(request: NextRequest) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Calcutta' });

    const [todayPatients] = await connection.execute(`
      SELECT COUNT(*) as count FROM console WHERE added_on = ?
    `, [today]);

    const [completedToday] = await connection.execute(`
      SELECT COUNT(*) as count FROM console WHERE added_on = ? AND status = 'Complete'
    `, [today]);

    const [pendingQueue] = await connection.execute(`
      SELECT COUNT(*) as count FROM lab_banch 
      WHERE c_status = 1 AND added >= UNIX_TIMESTAMP('2023-05-01 00:00:00')
    `);

    const [totalProcessed] = await connection.execute(`
      SELECT COUNT(*) as count FROM console
    `);

    return NextResponse.json({
      todayPatients: (todayPatients as any)[0].count,
      completedToday: (completedToday as any)[0].count,
      pendingQueue: (pendingQueue as any)[0].count,
      totalProcessed: (totalProcessed as any)[0].count
    });

  } catch (error: any) {
    console.error('Console stats error:', error);
    return NextResponse.json({
      error: 'Failed to fetch console stats',
      details: error.message,
      stack: error.stack,
      query: Object.fromEntries(new URL(request.url).searchParams),
      dbConfig: {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port
      },
      sqlError: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}