import { Student, ClassEntry, ReportRange } from '../types';
import { escapeHtml, formatDate, formatShortDate } from './formatters';

export const printClassEntry = (classEntry: ClassEntry, students: Student[]): void => {
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const presentCount = Object.values(classEntry.attendance || {}).filter(Boolean).length;
  const totalCount = sortedStudents.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const printContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Aula - ${escapeHtml(formatDate(classEntry.date))}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1f2937; }
          h1 { color: #1d4ed8; text-align: center; margin-bottom: 8px; font-size: 22px; }
          .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; }
          .meta p { margin: 4px 0; }
          .stats-badge { display: inline-block; background: #ecfdf5; color: #047857; font-weight: bold; padding: 4px 10px; border-radius: 6px; border: 1px solid #a7f3d0; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background-color: #f1f5f9; color: #334155; font-weight: 600; }
          .present { color: #16a34a; font-weight: bold; text-align: center; }
          .absent { color: #dc2626; font-weight: bold; text-align: center; }
          .center { text-align: center; width: 40px; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>Diário de Classe - ${escapeHtml(formatDate(classEntry.date))}</h1>
        <div class="meta">
          <p><strong>Tema da Aula:</strong> ${escapeHtml(classEntry.topic)}</p>
          <p><strong>Preletor / Professor:</strong> ${escapeHtml(classEntry.lecturer)}</p>
          ${classEntry.texts ? `<p><strong>Materiais / Referências:</strong> ${escapeHtml(classEntry.texts)}</p>` : ''}
          <div class="stats-badge">Frequência: ${presentCount} de ${totalCount} presentes (${attendanceRate}%)</div>
        </div>
        <table>
          <thead>
            <tr>
              <th class="center">#</th>
              <th>Nome do Aluno</th>
              <th class="center">Status</th>
            </tr>
          </thead>
          <tbody>
            ${sortedStudents.map((s, idx) => `
              <tr>
                <td class="center">${idx + 1}</td>
                <td>${escapeHtml(s.name)}</td>
                <td class="${classEntry.attendance[s.id] ? 'present' : 'absent'}">
                  ${classEntry.attendance[s.id] ? 'PRESENTE' : 'FALTA'}
                </td>
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

export const printAttendanceMatrix = (
  filteredClasses: ClassEntry[],
  students: Student[],
  reportRange: ReportRange
): void => {
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  const totalClassesCount = filteredClasses.length;

  const printContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Relatório Geral de Frequência</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 10px; font-size: 11px; color: #111827; }
          h1 { color: #1d4ed8; text-align: center; margin-bottom: 4px; font-size: 18px; }
          .meta { text-align: center; color: #4b5563; margin-bottom: 14px; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: center; }
          th.num-col { width: 28px; text-align: center; background-color: #f1f5f9; }
          td.num-col { text-align: center; color: #64748b; font-size: 10px; }
          th.name-col { text-align: left; min-width: 150px; }
          td.name-col { text-align: left; font-weight: 600; }
          th { background-color: #f1f5f9; font-size: 10px; color: #334155; }
          .p-mark { color: #16a34a; font-weight: bold; background-color: #f0fdf4; }
          .f-mark { color: #dc2626; opacity: 0.6; }
          .tot-col { font-weight: bold; background-color: #f8fafc; }
          .pct-col { font-weight: bold; background-color: #eff6ff; color: #1d4ed8; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
      </head>
      <body>
        <h1>Relatório Geral de Frequência</h1>
        <div class="meta">
          Período: ${reportRange.start ? escapeHtml(formatDate(reportRange.start)) : 'Início'} até ${reportRange.end ? escapeHtml(formatDate(reportRange.end)) : 'Fim'}
          • Total de Aulas: ${filteredClasses.length}
          • Total de Alunos: ${sortedStudents.length}
        </div>
        
        <table>
          <thead>
            <tr>
              <th class="num-col">#</th>
              <th class="name-col">Aluno</th>
              ${filteredClasses.map(c => `<th>${escapeHtml(formatShortDate(c.date))}</th>`).join('')}
              <th class="tot-col">Total P</th>
              <th class="pct-col">% Freq</th>
            </tr>
          </thead>
          <tbody>
            ${sortedStudents.map((student, index) => {
              let totalPresence = 0;
              const cells = filteredClasses.map(c => {
                const isPresent = Boolean(c.attendance[student.id]);
                if (isPresent) totalPresence++;
                return `<td class="${isPresent ? 'p-mark' : 'f-mark'}">${isPresent ? 'P' : 'F'}</td>`;
              }).join('');

              const pct = totalClassesCount > 0 
                ? Math.round((totalPresence / totalClassesCount) * 100) 
                : 0;

              return `<tr>
                        <td class="num-col">${index + 1}</td>
                        <td class="name-col">${escapeHtml(student.name)}</td>
                        ${cells}
                        <td class="tot-col">${totalPresence}</td>
                        <td class="pct-col">${pct}%</td>
                      </tr>`;
            }).join('')}
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

export const printStudentList = (students: Student[]): void => {
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const printContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Lista de Alunos Cadastrados</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; font-size: 13px; color: #1f2937; }
          h1 { color: #1d4ed8; text-align: center; margin-bottom: 4px; font-size: 20px; }
          .meta { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background-color: #f1f5f9; color: #334155; font-weight: 600; }
          .num-col { width: 45px; text-align: center; }
          td.num-col { text-align: center; color: #64748b; }
          tr:nth-child(even) { background-color: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>Lista de Cadastro de Alunos</h1>
        <div class="meta">Total de Alunos Cadastrados: ${sortedStudents.length}</div>
        
        <table>
          <thead>
            <tr>
              <th class="num-col">#</th>
              <th>Nome Completo</th>
              <th>Telefone / Contato</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${sortedStudents.map((student, index) => `
              <tr>
                <td class="num-col">${index + 1}</td>
                <td>${escapeHtml(student.name)}</td>
                <td>${student.phone ? escapeHtml(student.phone) : '<span style="color:#94a3b8">—</span>'}</td>
                <td>${student.active === false ? 'Inativo' : 'Ativo'}</td>
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
