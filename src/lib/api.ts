// API Configuration
const API_BASE = 'https://varahasdc.co.in/api';

// API Client
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Superadmin APIs
  async getSuperadminStats() {
    return this.request('/superadmin/stats');
  }

  async getSuperadminPatientReport(fromDate?: string, toDate?: string) {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    
    return this.request(`/superadmin/patient-report?${params}`);
  }

  // Admin APIs
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminHospitals() {
    return this.request('/admin/hospitals');
  }

  async getAdminDoctors() {
    return this.request('/admin/doctors');
  }

  async getAdminPatients(status?: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    return this.request(`/admin/patients?${params}`);
  }

  async getAdminDailyRevenue(date?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    return this.request(`/admin/daily-revenue?${params}`);
  }

  // Doctor APIs
  async getDoctorStats() {
    return this.request('/doctor/stats');
  }

  async getDoctorPendingPatients() {
    return this.request('/doctor/pending-patients');
  }

  async getDoctorPatient(cro: string) {
    return this.request(`/doctor/patient/${cro}`);
  }

  async addDoctorReport(cro: string, reportDetail: string, remark: string) {
    return this.request('/doctor/add-report', {
      method: 'POST',
      body: JSON.stringify({ cro, report_detail: reportDetail, remark }),
    });
  }

  async getDoctorDailyReport(date?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    return this.request(`/doctor/daily-report?${params}`);
  }

  // Console APIs
  async getConsoleStats() {
    return this.request('/console/stats');
  }

  async getConsoleQueue(status?: string) {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    return this.request(`/console/queue?${params}`);
  }

  async updateConsoleStatus(cro: string, status: number, remark: string) {
    return this.request('/console/update-status', {
      method: 'POST',
      body: JSON.stringify({ cro, status, remark }),
    });
  }

  async getConsoleDailyReport(date?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    return this.request(`/console/daily-report?${params}`);
  }

  async addToConsoleQueue(cro: string) {
    return this.request('/console/add-to-queue', {
      method: 'POST',
      body: JSON.stringify({ cro }),
    });
  }

  // Accounts APIs
  async getAccountsStats() {
    return this.request('/accounts/stats');
  }

  async getAccountsTransactions(fromDate?: string, toDate?: string, limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    return this.request(`/accounts/transactions?${params}`);
  }

  async updateAccountsPayment(cro: string, receivedAmount: number, dueAmount: number, paymentMethod: string, remark: string) {
    return this.request('/accounts/update-payment', {
      method: 'POST',
      body: JSON.stringify({
        cro,
        received_amount: receivedAmount,
        due_amount: dueAmount,
        payment_method: paymentMethod,
        remark,
      }),
    });
  }

  async getAccountsRevenueReport(fromDate?: string, toDate?: string, groupBy?: string) {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (groupBy) params.append('group_by', groupBy);
    
    return this.request(`/accounts/revenue-report?${params}`);
  }

  async getAccountsVouchers(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    return this.request(`/accounts/vouchers?${params}`);
  }

  // Reports APIs
  async getPatientReport(fromDate?: string, toDate?: string) {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    
    return this.request(`/reports/patient-report?${params}`);
  }

  async getDailyRevenue(date?: string) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    return this.request(`/reports/daily-revenue?${params}`);
  }

  async getConsoleReport(fromDate?: string, toDate?: string) {
    const params = new URLSearchParams();
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    
    return this.request(`/reports/console-report?${params}`);
  }

  // Patients APIs
  async getPatients(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    return this.request(`/patients?${params}`);
  }

  async getPatientByCro(cro: string) {
    return this.request(`/patients/cro/${cro}`);
  }

  async getDoctors() {
    return this.request('/patients/doctors');
  }

  async getHospitals() {
    return this.request('/patients/hospitals');
  }

  async getScans() {
    return this.request('/patients/scans');
  }
}

// Create API client instance
export const api = new ApiClient(API_BASE);

// Export types
export interface User {
  id: number;
  username: string;
  role: string;
  name?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  total?: number;
  error?: string;
}

export interface Patient {
  patient_id: number;
  cro: string;
  patient_name: string;
  age: number;
  gender: string;
  mobile: string;
  date: string;
  amount: number;
  doctor_name?: string;
  hospital_name?: string;
  scan_name?: string;
}

export interface DashboardStats {
  currentMonthTotal?: number;
  lastMonthTotal?: number;
  todayScans: number;
  todayReceived: number;
  todayDue: number;
  todayWithdraw: number;
  cashInHand: number;
  totalAmount?: number;
}

export default api;