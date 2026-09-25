import { LivestockAnimal, LivestockSpecies, LivestockStatus, VaccinationStatus } from '../types/livestock';
import { escapeHtml, formatDate } from './formatters';

export const getSpeciesLabel = (species: LivestockSpecies): { label: string; icon: string } => {
  switch (species) {
    case 'bovine':
      return { label: 'Bovino', icon: '🐄' };
    case 'ovine':
      return { label: 'Ovino', icon: '🐑' };
    case 'caprine':
      return { label: 'Caprino', icon: '🐐' };
    case 'equine':
      return { label: 'Equino', icon: '🐎' };
    case 'swine':
      return { label: 'Suíno', icon: '🐖' };
    case 'poultry':
      return { label: 'Aves', icon: '🐓' };
    default:
      return { label: 'Outro', icon: '🐾' };
  }
};

export const getAnimalStatusInfo = (status: LivestockStatus) => {
  switch (status) {
    case 'healthy':
      return { label: 'Saudável', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'treatment':
      return { label: 'Em Tratamento', colorClass: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'quarantine':
      return { label: 'Quarentena', colorClass: 'text-purple-700 bg-purple-50 border-purple-200' };
    case 'sold':
      return { label: 'Vendido', colorClass: 'text-blue-700 bg-blue-50 border-blue-200' };
    case 'deceased':
      return { label: 'Baixa / Óbito', colorClass: 'text-red-700 bg-red-50 border-red-200' };
  }
};

export const getVaccinationBadgeInfo = (vac: VaccinationStatus) => {
  switch (vac) {
    case 'up_to_date':
      return { label: 'Em Dia', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'pending':
      return { label: 'Pendente', colorClass: 'text-amber-700 bg-amber-50 border-amber-200' };
    case 'overdue':
      return { label: 'Atrasada', colorClass: 'text-red-700 bg-red-50 border-red-200' };
  }
};

export const exportLivestockCsv = (animals: LivestockAnimal[]): void => {
  const header = [
    '#',
    'Brinco/Registro',
    'Nome/Apelido',
    'Espécie',
    'Raça',
    'Categoria',
    'Sexo',
    'Nascimento',
    'Peso (kg)',
    'Status Sanitário',
    'Vacinação',
    'Lote/Piquete',
    'Observações'
  ];

  const rows = animals.map((a, idx) => [
    idx + 1,
    `"${a.earringNumber.replace(/"/g, '""')}"`,
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${getSpeciesLabel(a.species).label}"`,
    `"${a.breed.replace(/"/g, '""')}"`,
    `"${a.category.replace(/"/g, '""')}"`,
    a.gender === 'female' ? 'Fêmea' : 'Macho',
    `"${formatDate(a.birthDate)}"`,
    a.weight ? a.weight : '',
    `"${getAnimalStatusInfo(a.status).label}"`,
    `"${getVaccinationBadgeInfo(a.vaccinationStatus).label}"`,
    `"${a.lot.replace(/"/g, '""')}"`,
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [header.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `controle-rebanho-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const printLivestockBook = (animals: LivestockAnimal[]): void => {
  const printContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Livro de Registro Zootécnico do Rebanho</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 12px; font-size: 11px; color: #1e293b; }
          h1 { color: #059669; text-align: center; margin-bottom: 4px; font-size: 18px; }
          .meta { text-align: center; color: #64748b; margin-bottom: 16px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
          th { background-color: #f8fafc; font-weight: 700; color: #334155; font-size: 11px; }
          .earring { font-family: monospace; font-weight: bold; color: #047857; }
          .center { text-align: center; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
      </head>
      <body>
        <h1>Livro de Registro Zootécnico do Rebanho</h1>
        <div class="meta">Total de Animais Registrados: ${animals.length} • Emitido em: ${new Date().toLocaleDateString('pt-BR')}</div>
        
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 30px;">#</th>
              <th style="width: 90px;">Brinco</th>
              <th>Nome / Identificação</th>
              <th>Espécie / Raça</th>
              <th>Categoria</th>
              <th class="center">Sexo</th>
              <th>Nascimento</th>
              <th class="center">Peso</th>
              <th>Sanidade</th>
              <th>Lote / Piquete</th>
            </tr>
          </thead>
          <tbody>
            ${animals.map((a, idx) => `
              <tr>
                <td class="center">${idx + 1}</td>
                <td class="earring">${escapeHtml(a.earringNumber)}</td>
                <td><strong>${a.name ? escapeHtml(a.name) : '—'}</strong></td>
                <td>${getSpeciesLabel(a.species).icon} ${getSpeciesLabel(a.species).label} / ${escapeHtml(a.breed)}</td>
                <td>${escapeHtml(a.category)}</td>
                <td class="center">${a.gender === 'female' ? 'F' : 'M'}</td>
                <td>${escapeHtml(formatDate(a.birthDate))}</td>
                <td class="center">${a.weight ? a.weight + ' kg' : '—'}</td>
                <td>${getAnimalStatusInfo(a.status).label} (${getVaccinationBadgeInfo(a.vaccinationStatus).label})</td>
                <td>${escapeHtml(a.lot)}</td>
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
