import React, { useRef } from 'react';
import { 
  Users, 
  Calendar, 
  Plus, 
  FileSpreadsheet, 
  ChevronRight, 
  Download, 
  Upload, 
  Sparkles, 
  UserCheck,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Student, ClassEntry, ViewType } from '../../types';
import { formatDate } from '../../utils/formatters';

interface DashboardViewProps {
  students: Student[];
  classes: ClassEntry[];
  onNavigate: (view: ViewType) => void;
  onNewClass: () => void;
  onLoadDemo: () => void;
  onClearAll: () => void;
  onExportJson: () => void;
  onImportFile: (file: File) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  classes,
  onNavigate,
  onNewClass,
  onLoadDemo,
  onClearAll,
  onExportJson,
  onImportFile
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.active !== false).length;
  const totalClasses = classes.length;
  const lastClass = classes.length > 0 ? classes[0] : null;

  // Cálculo da taxa média geral de presença
  const averageAttendancePct = React.useMemo(() => {
    if (classes.length === 0 || totalStudents === 0) return 0;
    let totalPresences = 0;
    let totalPossible = 0;

    classes.forEach(c => {
      const presences = Object.values(c.attendance || {}).filter(Boolean).length;
      totalPresences += presences;
      totalPossible += totalStudents;
    });

    return totalPossible > 0 ? Math.round((totalPresences / totalPossible) * 100) : 0;
  }, [classes, totalStudents]);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner de Demonstração Comercial */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4.5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl shrink-0 shadow-inner">
            <Sparkles className="text-amber-300" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">Turma Modelo de Demonstração Pronta</h3>
            <p className="text-xs text-blue-100 mt-0.5 max-w-md leading-relaxed">
              Demonstre facilmente o sistema para clientes com alunos, aulas e frequências realistas já preenchidos.
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={onLoadDemo}
            className="bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs w-full sm:w-auto text-center cursor-pointer active:scale-95"
          >
            Recarregar Demo
          </button>
          <button
            onClick={onClearAll}
            className="bg-blue-800/80 hover:bg-blue-900 text-blue-200 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors w-full sm:w-auto text-center cursor-pointer"
            title="Limpar para iniciar cadastro real"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Card Alunos */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={18} />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">Alunos</h3>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{totalStudents}</p>
          <span className="text-xs text-gray-400 mt-1 block">
            {activeStudents} ativos
          </span>
        </div>

        {/* Card Aulas */}
        <div 
          onClick={() => onNavigate('history')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Calendar size={18} />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">Aulas</h3>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{totalClasses}</p>
          <span className="text-xs text-gray-400 mt-1 block">registradas no diário</span>
        </div>

        {/* Card Taxa Média de Frequência */}
        <div 
          onClick={() => onNavigate('report')}
          className="col-span-2 md:col-span-1 bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <TrendingUp size={18} />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">Frequência Média</h3>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-extrabold text-gray-900">{averageAttendancePct}%</p>
            <Percent size={14} className="text-indigo-500" />
          </div>
          <span className="text-xs text-gray-400 mt-1 block">
            {totalClasses > 0 ? 'Média geral da turma' : 'Aguardando aulas'}
          </span>
        </div>
      </div>

      {/* Menu de Ações Rápidas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-sm">Ações Rápidas</h2>
        </div>
        <div className="p-4 grid gap-3">
          <button 
            onClick={onNewClass}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-sm active:scale-98 cursor-pointer"
          >
            <Plus size={20} />
            <span>Nova Chamada / Registrar Aula</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onNavigate('students')}
              className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 p-3.5 rounded-xl flex flex-col items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <Users size={20} className="text-blue-600" />
              <span className="text-xs sm:text-sm">Gerenciar Alunos</span>
            </button>
            <button 
              onClick={() => onNavigate('report')}
              className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 p-3.5 rounded-xl flex flex-col items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
            >
              <FileSpreadsheet size={20} className="text-emerald-600" />
              <span className="text-xs sm:text-sm">Relatórios e Frequência</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Box de Backup */}
      <div className="bg-blue-50/80 rounded-2xl shadow-sm border border-blue-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-sm text-blue-900 flex items-center gap-1.5">
            <Download size={16} /> Backup dos Dados
          </h2>
          <span className="text-[11px] font-medium text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
            JSON Seguro
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onExportJson} 
            className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Download size={16} /> Baixar Cópia
          </button>
          <button 
            onClick={handleImportClick} 
            className="bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Upload size={16} /> Restaurar Backup
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Card da Última Aula Realizada */}
      {lastClass && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Última Aula Realizada</h3>
            <span className="text-xs text-gray-500 font-medium">{formatDate(lastClass.date)}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-2">
            <div>
              <p className="font-bold text-gray-900 text-base">{lastClass.topic}</p>
              <p className="text-xs text-gray-500 mt-0.5">Professor(a): <span className="font-medium text-gray-700">{lastClass.lecturer}</span></p>
            </div>
            {(() => {
              const presentCount = Object.values(lastClass.attendance || {}).filter(Boolean).length;
              const rate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
              return (
                <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                  <UserCheck size={15} />
                  <span>{presentCount} presentes ({rate}%)</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
