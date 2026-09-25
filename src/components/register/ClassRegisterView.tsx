import React, { useState } from 'react';
import { 
  FileText, 
  UserCheck, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Save, 
  CheckSquare, 
  Square
} from 'lucide-react';
import { Student, ClassEntry, AttendanceMap } from '../../types';

interface ClassRegisterViewProps {
  students: Student[];
  editingClass: ClassEntry | null;
  form: {
    date: string;
    topic: string;
    lecturer: string;
    texts: string;
    attendance: AttendanceMap;
  };
  onChangeForm: (field: string, value: string | AttendanceMap) => void;
  onToggleAttendance: (studentId: string) => void;
  onSaveClass: () => void;
  onCancelEdit: () => void;
}

export const ClassRegisterView: React.FC<ClassRegisterViewProps> = ({
  students,
  editingClass,
  form,
  onChangeForm,
  onToggleAttendance,
  onSaveClass,
  onCancelEdit
}) => {
  const [showInactive, setShowInactive] = useState(false);

  // Alunos ordenados alfabeticamente
  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  
  const displayedStudents = showInactive 
    ? sortedStudents 
    : sortedStudents.filter(s => s.active !== false || form.attendance[s.id]);

  const presentCount = Object.values(form.attendance).filter(Boolean).length;
  const totalConsidered = displayedStudents.length;
  const attendanceRate = totalConsidered > 0 ? Math.round((presentCount / totalConsidered) * 100) : 0;

  // Marcar todos como presentes
  const markAllPresent = () => {
    const updated: AttendanceMap = { ...form.attendance };
    displayedStudents.forEach(s => {
      updated[s.id] = true;
    });
    onChangeForm('attendance', updated);
  };

  // Marcar todos como ausentes
  const markAllAbsent = () => {
    const updated: AttendanceMap = { ...form.attendance };
    displayedStudents.forEach(s => {
      updated[s.id] = false;
    });
    onChangeForm('attendance', updated);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Informações da Aula */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
            <FileText className="text-blue-600" /> 
            {editingClass ? 'Editar Registro de Aula' : 'Nova Chamada / Diário de Aula'}
          </h2>
          {editingClass && (
            <button 
              onClick={onCancelEdit} 
              className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Voltar ao Histórico
            </button>
          )}
        </div>

        <div className="grid gap-3.5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data da Aula</label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
              value={form.date} 
              onChange={e => onChangeForm('date', e.target.value)} 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tema da Aula</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
              value={form.topic} 
              onChange={e => onChangeForm('topic', e.target.value)} 
              placeholder="Ex: Introdução à Matemática Financeira" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Preletor / Professor(a)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
              value={form.lecturer} 
              onChange={e => onChangeForm('lecturer', e.target.value)} 
              placeholder="Nome do professor ou palestrante" 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Materiais / Referências</label>
            <textarea 
              rows={2} 
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden" 
              value={form.texts} 
              onChange={e => onChangeForm('texts', e.target.value)} 
              placeholder="Livros, páginas, links ou notas de apoio..." 
            />
          </div>
        </div>
      </div>

      {/* Grade de Chamada Interativa */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <UserCheck className="text-blue-600" /> Lista de Chamada
            </h2>
            <p className="text-xs text-gray-500">Clique no aluno para alternar entre presença e falta.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {presentCount} de {totalConsidered} presentes ({attendanceRate}%)
            </div>
          </div>
        </div>

        {/* Ações Rápidas da Chamada */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 mb-3 border-y border-gray-100 text-xs">
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              title="Marcar todos como presentes"
            >
              <CheckSquare size={14} /> Todos Presentes
            </button>
            <button
              onClick={markAllAbsent}
              className="flex items-center gap-1 text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
              title="Marcar todos com falta"
            >
              <Square size={14} /> Zerar Chamada
            </button>
          </div>

          {students.some(s => s.active === false) && (
            <label className="flex items-center gap-1.5 text-gray-500 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showInactive} 
                onChange={e => setShowInactive(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Mostrar alunos inativos</span>
            </label>
          )}
        </div>

        {/* Alunos na Chamada */}
        <div className="space-y-2">
          {displayedStudents.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
              Nenhum aluno ativo encontrado. Cadastre alunos na aba <strong>Alunos</strong> antes de realizar a chamada.
            </div>
          ) : (
            displayedStudents.map(student => {
              const isPresent = Boolean(form.attendance[student.id]);
              const isInactive = student.active === false;

              return (
                <div 
                  key={student.id} 
                  onClick={() => onToggleAttendance(student.id)} 
                  className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer border transition-all select-none ${
                    isPresent 
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs hover:bg-emerald-50' 
                      : 'bg-red-50/50 border-red-200 opacity-70 hover:opacity-100 hover:bg-red-50/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${isPresent ? 'text-emerald-950' : 'text-red-950'}`}>
                      {student.name}
                    </span>
                    {isInactive && (
                      <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded">
                        Inativo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase ${isPresent ? 'text-emerald-700' : 'text-red-600'}`}>
                      {isPresent ? 'Presente' : 'Falta'}
                    </span>
                    {isPresent ? (
                      <CheckCircle className="text-emerald-600" size={22} />
                    ) : (
                      <XCircle className="text-red-500" size={22} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Botão de Salvar */}
      <div className="flex gap-2 mb-8">
        <button 
          onClick={onSaveClass} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all hover:shadow-lg active:scale-98 cursor-pointer"
        >
          <Save size={22} /> {editingClass ? 'Atualizar Registro da Aula' : 'Salvar Diário de Aula'}
        </button>
      </div>
    </div>
  );
};
