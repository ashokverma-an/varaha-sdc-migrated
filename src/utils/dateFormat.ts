// Date formatting utilities to match PHP admin system

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}-${month}-${year}`;
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const formatAmount = (amount: number | string): string => {
  if (!amount && amount !== 0) return '₹0.00';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0.00';
  
  return `₹${num.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const getCurrentDate = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Convert any date to dd-mm-yyyy format for display
export const toDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  // Handle various input formats
  let date: Date;
  
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // Check if it's yyyy-mm-dd or dd-mm-yyyy
      if (parts[0].length === 4) {
        // yyyy-mm-dd format
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        // dd-mm-yyyy format - already correct
        return dateStr;
      }
    } else {
      date = new Date(dateStr);
    }
  } else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) return dateStr;
  
  return formatDate(date);
};

// For download filenames with current date
export const getDownloadDate = (): string => {
  return getCurrentDate().replace(/-/g, '');
};