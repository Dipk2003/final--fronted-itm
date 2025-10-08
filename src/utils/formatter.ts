// Utility functions for formatting data

/**
 * Format currency values
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'INR')
 * @param locale - The locale for formatting (default: 'en-IN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  if (value === null || value === undefined || value === '') {
    return '₹0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '₹0';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(numericValue);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    return `₹${numericValue.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

/**
 * Format numbers with commas for thousands separator
 * @param value - The numeric value to format
 * @returns Formatted number string
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0';
  }

  return numericValue.toLocaleString('en-IN');
}

/**
 * Format percentage values
 * @param value - The numeric value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @param isDecimal - Whether the input is in decimal form (0-1) or percentage form (0-100)
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | null | undefined,
  decimals: number = 1,
  isDecimal: boolean = false
): string {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0%';
  }

  const percentValue = isDecimal ? numericValue * 100 : numericValue;
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * Format date values
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-IN', options).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleDateString();
  }
}

/**
 * Format time values
 * @param date - The date to format
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | null | undefined): string {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleTimeString();
  }
}

/**
 * Format file sizes
 * @param bytes - The size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Truncate text to specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length (default: 50)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 50,
  suffix: string = '...'
): string {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Format phone numbers
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) {
    return '';
  }

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length (assuming Indian phone numbers)
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
}

export interface Formatter {
  formatCurrency: typeof formatCurrency;
  formatNumber: typeof formatNumber;
  formatPercentage: typeof formatPercentage;
  formatDate: typeof formatDate;
  formatTime: typeof formatTime;
  formatFileSize: typeof formatFileSize;
  truncateText: typeof truncateText;
  formatPhoneNumber: typeof formatPhoneNumber;
}

const formatter: Formatter = {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatTime,
  formatFileSize,
  truncateText,
formatPhoneNumber,
};

export default formatter;
