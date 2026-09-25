import { Student, ClassEntry } from '../types';
import { formatDate } from './formatters';

export interface ExportData {
  students: Student[];
  classes: ClassEntry[];
  exportedAt: string;
}

export const exportToJson = (students: Student[], classes: ClassEntry[]): void => {
  const data: ExportData = {
    students,
    classes,
    exportedAt: new Date().toISOString()
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `backup-diario-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const exportMatrixToCsv = (
  students: Student[],
  classes: ClassEntry[],
  reportRange: { start: string; end: string }
): void => {
  const filteredClasses = classes
    .filter(c => (!reportRange.start || c.date >= reportRange.start) && (!reportRange.end || c.date <= reportRange.end))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Cabeçalho CSV
  const header = [
    '#',
    'Nome do Aluno',
    'Telefone',
    'Status',
    ...filteredClasses.map(c => `"${formatDate(c.date)} - ${c.topic.replace(/"/g, '""')}"`),
    'Total Presenças',
    'Total Aulas',
    '% Frequência'
  ];

  const totalClassesCount = filteredClasses.length;

  const rows = students.map((student, idx) => {
    let presenceCount = 0;
    const attendanceCols = filteredClasses.map(c => {
      const isPresent = Boolean(c.attendance[student.id]);
      if (isPresent) presenceCount++;
      return isPresent ? 'P' : 'F';
    });

    const pct = totalClassesCount > 0 
      ? Math.round((presenceCount / totalClassesCount) * 100) 
      : 0;

    return [
      idx + 1,
      `"${student.name.replace(/"/g, '""')}"`,
      `"${student.phone || ''}"`,
      student.active === false ? 'Inativo' : 'Ativo',
      ...attendanceCols,
      presenceCount,
      totalClassesCount,
      `${pct}%`
    ];
  });

  const csvContent = '\uFEFF' + [header.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-frequencia-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
