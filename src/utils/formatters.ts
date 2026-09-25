import { DateInfo } from '../types';

export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateString;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateString;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
};

export const getDayMonthYear = (dateString: string): DateInfo => {
  if (!dateString) return { day: 0, month: 0, year: 0 };
  const [year, month, day] = dateString.split('-').map(Number);
  return { day: day || 0, month: month || 0, year: year || 0 };
};
