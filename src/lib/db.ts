import mysql from 'mysql2/promise';
import { csvService } from './csvService';

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'varaosrc_hospital_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool: mysql.Pool;
let isDbAvailable = false;

export const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
};

export const testConnection = async () => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Database connected successfully');
    isDbAvailable = true;
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('📄 Falling back to CSV data source');
    isDbAvailable = false;
    return false;
  }
};

export const isDbConnected = () => isDbAvailable;

// Database operations with CSV fallback
export const dbQuery = async (query: string, params: any[] = []): Promise<any> => {
  if (isDbAvailable) {
    try {
      const connection = await getConnection();
      const [rows] = await connection.execute(query, params);
      return rows;
    } catch (error) {
      console.error('MySQL query failed, switching to CSV:', error);
      isDbAvailable = false;
    }
  }
  
  // CSV fallback logic based on query type
  if (query.toLowerCase().includes('patient_new')) {
    return await csvService.getPatients();
  } else if (query.toLowerCase().includes('doctor')) {
    return await csvService.getDoctors();
  } else if (query.toLowerCase().includes('hospital')) {
    return await csvService.getHospitals();
  } else if (query.toLowerCase().includes('con')) {
    return await csvService.getScans();
  } else if (query.toLowerCase().includes('admin')) {
    return await csvService.getAdmins();
  }
  
  return [];
};