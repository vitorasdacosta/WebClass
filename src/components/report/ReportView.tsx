import React, { useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Users, 
  Printer, 
  Download, 
  RotateCcw
} from 'lucide-react';
import { Student, ClassEntry, ReportRange } from '../../types';
import { formatShortDate } from '../../utils/formatters';

interface ReportViewProps {
  students: Student[];
  classes: ClassEntry[];
  reportRange: ReportRange;
  onChangeRange: (field: 'start' | 'end', value: string) => void;
  onResetRange: () => void;
  onPrintStudentList: () => void;
  onPrintReport: () => void;
  onExportCsv: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  students,
  classes,
  reportRange,
  onChangeRange,
  onResetRange,
  onPrintStudentList,
  onPrintReport,
  onExportCsv
}) => {
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [students]);

  const reportClasses = useMemo(() => {
    return classes
      .filter(c => (!reportRange.start || c.date >= reportRange.start) && (!reportRange.end || c.date <= reportRange.end))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [classes, reportRange]);

  const totalClassesInPeriod = reportClasses.length;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Relatório de Cadastro de Alunos */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
            <Users className="text-blue-600" /> Lista de Alunos Cadastrados
          </h2>
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
            {sortedStudents.length} alunos
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Gere uma lista limpa com nomes, telefones e status para conferência presencial ou arquivamento.
        </p>
        <button 
          onClick={onPrintStudentList} 
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-blue-200 transition-colors cursor-pointer"
        >
          <Printer size={18} /> Imprimir Lista de Alunos
        </button>
      </div>

      {/* Matriz Geral de Frequência */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
            <FileSpreadsheet className="text-emerald-600" /> Relatório Geral de Frequência
          </h2>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            {totalClassesInPeriod} {totalClassesInPeriod === 1 ? 'aula no período' : 'aulas no período'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Filtre por período para visualizar a matriz de presença, taxa percentual e exportar para planilha.
        </p>
        
        {/* Filtros de Data */}
        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data Inicial</label>
              <input 
                type="date" 
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
                value={reportRange.start} 
                onChange={e => onChangeRange('start', e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data Final</label>
              <input 
                type="date" 
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
                value={reportRange.end} 
                onChange={e => onChangeRange('end', e.target.value)} 
              />
            </div>
          </div>
          {(reportRange.start || reportRange.end) && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={onResetRange}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <RotateCcw size={12} /> Limpar filtro de datas (Ver todas as aulas)
              </button>
            </div>
          )}
        </div>

        {reportClasses.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
            Nenhuma aula registrada dentro do período selecionado.
          </div>
        ) : (
          <>
            {/* Tabela de Matriz com Rolagem Horizontal */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl mb-4">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="p-2.5 text-center border-b w-8 font-bold">#</th>
                    <th className="p-2.5 text-left sticky left-0 bg-gray-50 border-b font-bold min-w-[140px] z-5">
                      Aluno
                    </th>
                    {reportClasses.map(c => (
                      <th key={c.id} className="p-2.5 text-center border-b min-w-[55px] text-[11px] sm:text-xs font-semibold" title={`${c.topic} (${c.lecturer})`}>
                        {formatShortDate(c.date)}
                      </th>
                    ))}
                    <th className="p-2.5 text-center border-b bg-gray-100 font-bold min-w-[60px]">
                      Total P
                    </th>
                    <th className="p-2.5 text-center border-b bg-blue-50 text-blue-800 font-bold min-w-[65px]">
                      % Freq
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student, index) => {
                    let totalP = 0;
                    const attendanceCells = reportClasses.map(c => {
                      const isPresent = Boolean(c.attendance[student.id]);
                      if (isPresent) totalP++;
                      return (
                        <td 
                          key={c.id} 
                          className={`p-2 text-center font-bold text-xs ${
                            isPresent ? 'text-emerald-700 bg-emerald-50/40' : 'text-red-400 opacity-60'
                          }`}
                        >
                          {isPresent ? 'P' : 'F'}
                        </td>
                      );
                    });

                    const pct = totalClassesInPeriod > 0 
                      ? Math.round((totalP / totalClassesInPeriod) * 100) 
                      : 0;

                    const pctBadgeColor = pct >= 75 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : pct >= 50 
                      ? 'text-amber-700 bg-amber-50 border-amber-200' 
                      : 'text-red-700 bg-red-50 border-red-200';

                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                        <td className="p-2 text-center text-gray-400 text-xs">{index + 1}</td>
                        <td className="p-2 sticky left-0 bg-white font-medium text-gray-900 border-r border-gray-100 z-5">
                          {student.name}
                        </td>
                        {attendanceCells}
                        <td className="p-2 text-center font-bold text-gray-900 bg-gray-50/50">
                          {totalP}
                        </td>
                        <td className="p-2 text-center font-bold">
                          <span className={`inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full border ${pctBadgeColor}`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Ações de Impressão e Exportação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button 
                onClick={onPrintReport} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <Printer size={18} /> Imprimir Relatório (Paisagem)
              </button>

              <button 
                onClick={onExportCsv} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <Download size={18} /> Exportar Planilha (CSV)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
