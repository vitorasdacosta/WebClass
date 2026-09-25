export interface Student {
  id: string;
  name: string;
  phone: string;
  active?: boolean;
}

export type AttendanceMap = Record<string, boolean>;

export interface ClassEntry {
  id: string;
  date: string;
  topic: string;
  lecturer: string;
  texts: string;
  attendance: AttendanceMap;
  day: number;
  month: number;
  year: number;
}

export interface ReportRange {
  start: string;
  end: string;
}

export interface DateInfo {
  day: number;
  month: number;
  year: number;
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export interface ToastConfig {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export type ViewType = 'dashboard' | 'students' | 'report' | 'register' | 'history';
