import { Equipment } from '../types/equipment';
import { escapeHtml, formatDate } from './formatters';

export const getStatusBadgeInfo = (status: Equipment['status']) => {
  switch (status) {
    case 'available':
      return { label: 'Disponível', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'in_use':
      return { label: 'Em Uso / Emprestado', colorClass: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'maintenance':
      return { label: 'Em Manutenção', colorClass: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'retired':
      return { label: 'Baixado', colorClass: 'text-gray-600 bg-gray-100 border-gray-300' };
  }
};

export const getConditionBadgeInfo = (condition: Equipment['condition']) => {
  switch (condition) {
    case 'excellent':
      return { label: 'Excelente', colorClass: 'text-emerald-600' };
    case 'good':
      return { label: 'Bom', colorClass: 'text-blue-600' };
    case 'regular':
      return { label: 'Regular', colorClass: 'text-amber-600' };
    case 'needs_repair':
      return { label: 'Necessita Reparo', colorClass: 'text-red-600' };
  }
};

export const exportEquipmentCsv = (items: Equipment[]): void => {
  const header = [
    '#',
    'Patrimônio',
    'Nome do Equipamento',
    'Categoria',
    'Status',
    'Condição',
    'Localização',
    'Responsável',
    'Última Manutenção',
    'Observações'
  ];

  const rows = items.map((item, idx) => [
    idx + 1,
    `"${item.code.replace(/"/g, '""')}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.category.replace(/"/g, '""')}"`,
    `"${getStatusBadgeInfo(item.status).label}"`,
    `"${getConditionBadgeInfo(item.condition).label}"`,
    `"${item.location.replace(/"/g, '""')}"`,
    `"${(item.responsible || '').replace(/"/g, '""')}"`,
    `"${item.lastMaintenanceDate ? formatDate(item.lastMaintenanceDate) : ''}"`,
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [header.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventario-equipamentos-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const printEquipmentList = (items: Equipment[]): void => {
  const printContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Inventário de Equipamentos e Patrimônio</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 12px; font-size: 11px; color: #1e293b; }
          h1 { color: #d97706; text-align: center; margin-bottom: 4px; font-size: 18px; }
          .meta { text-align: center; color: #64748b; margin-bottom: 16px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background-color: #f8fafc; font-weight: 700; color: #334155; font-size: 11px; }
          .code { font-family: monospace; font-weight: bold; color: #0f172a; }
          .center { text-align: center; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
      </head>
      <body>
        <h1>Inventário de Equipamentos & Patrimônio</h1>
        <div class="meta">Total de Itens Cadastrados: ${items.length} • Emitido em: ${new Date().toLocaleDateString('pt-BR')}</div>
        
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 30px;">#</th>
              <th style="width: 110px;">Patrimônio</th>
              <th>Equipamento</th>
              <th>Categoria</th>
              <th>Status</th>
              <th>Condição</th>
              <th>Localização</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => `
              <tr>
                <td class="center">${idx + 1}</td>
                <td class="code">${escapeHtml(item.code)}</td>
                <td><strong>${escapeHtml(item.name)}</strong></td>
                <td>${escapeHtml(item.category)}</td>
                <td>${getStatusBadgeInfo(item.status).label}</td>
                <td>${getConditionBadgeInfo(item.condition).label}</td>
                <td>${escapeHtml(item.location)}</td>
                <td>${item.responsible ? escapeHtml(item.responsible) : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <script>window.onload = function() { window.print(); }</script>
      </body>
    </html>
  `;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(printContent);
    win.document.close();
  }
};
