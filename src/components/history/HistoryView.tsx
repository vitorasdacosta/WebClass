import React, { useState, useMemo } from 'react';
import { 
  History, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Printer, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  X,
  UserCheck
} from 'lucide-react';
import { Student, ClassEntry } from '../../types';
import { formatDate } from '../../utils/formatters';

interface HistoryViewProps {
  classes: ClassEntry[];
  students: Student[];
  onNewClass: () => void;
  onEditClass: (cls: ClassEntry) => void;
  onDeleteClass: (id: string, topic: string) => void;
  onPrintClass: (cls: ClassEntry) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  classes,
  students,
  onNewClass,
  onEditClass,
  onDeleteClass,
  onPrintClass
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Ordenação cronológica decrescente das aulas
  const sortedAndFilteredClasses = useMemo(() => {
    const sorted = [...classes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sorted;
    return sorted.filter(c => 
      c.topic.toLowerCase().includes(term) || 
      c.lecturer.toLowerCase().includes(term) ||
      c.date.includes(term)
    );
  }, [classes, searchTerm]);

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [students]);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <div>
          <h2 className="font-bold text-xl flex items-center gap-2 text-gray-900">
            <History className="text-blue-600" /> Histórico de Aulas
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {classes.length} {classes.length === 1 ? 'aula registrada' : 'aulas registradas'} no diário
          </p>
        </div>
        <button 
          onClick={onNewClass} 
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
        >
          <Plus size={16} /> Nova Aula
        </button>
      </div>

      {/* Busca Rápida no Histórico */}
      {classes.length > 0 && (
        <div className="relative mb-2">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por tema da aula, professor ou data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Listagem de Aulas */}
      {classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500 text-sm">
          <History size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="font-medium text-gray-700">Nenhuma aula registrada até o momento.</p>
          <p className="text-xs text-gray-400 mt-1">Clique no botão acima para registrar a primeira aula e chamada.</p>
        </div>
      ) : sortedAndFilteredClasses.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
          Nenhuma aula encontrada para a busca "{searchTerm}".
        </div>
      ) : (
        sortedAndFilteredClasses.map(cls => {
          const presentCount = Object.values(cls.attendance || {}).filter(Boolean).length;
          const totalCount = sortedStudents.length;
          const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

          return (
            <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
              <div className="bg-gray-50/90 p-3.5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{formatDate(cls.date)}</span>
                  <span className="text-gray-500 text-xs">• Prof: <span className="font-medium text-gray-700">{cls.lecturer}</span></span>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-auto">
                  <button 
                    onClick={() => onEditClass(cls)} 
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    title="Editar aula"
                  >
                    <Edit size={17} />
                  </button>
                  <button 
                    onClick={() => onDeleteClass(cls.id, cls.topic)} 
                    className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    title="Excluir aula"
                  >
                    <Trash2 size={17} />
                  </button>
                  <button 
                    onClick={() => onPrintClass(cls)} 
                    className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    title="Imprimir diário desta aula"
                  >
                    <Printer size={17} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <h3 className="font-bold text-base text-blue-800">{cls.topic}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl shrink-0">
                    <UserCheck size={14} />
                    <span>{presentCount}/{totalCount} ({pct}%)</span>
                  </div>
                </div>

                {cls.texts && (
                  <p className="text-xs text-gray-600 mt-1.5 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {cls.texts}
                  </p>
                )}
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-600 select-none hover:text-gray-900">
                      <span className="flex items-center gap-1.5">
                        <ChevronRight className="group-open:rotate-90 transition-transform text-gray-400" size={16} /> 
                        Ver Detalhes da Presença dos Alunos
                      </span>
                      <span className="text-gray-500 text-[11px]">
                        Clique para expandir
                      </span>
                    </summary>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-100">
                      {sortedStudents.map(student => (
                        <div key={student.id} className="flex items-center gap-2 text-xs py-0.5">
                          {cls.attendance?.[student.id] ? (
                            <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                          ) : (
                            <XCircle size={14} className="text-red-400 shrink-0" />
                          )}
                          <span className={cls.attendance?.[student.id] ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                            {student.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
