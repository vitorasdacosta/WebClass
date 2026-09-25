import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  RotateCcw, 
  UserCheck, 
  UserX,
  X
} from 'lucide-react';
import { Student } from '../../types';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (name: string, phone: string) => void;
  onUpdateStudent: (id: string, name: string, phone: string) => void;
  onToggleStudentActive: (id: string) => void;
  onRemoveStudent: (id: string, name: string) => void;
  onLoadDemo: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onToggleStudentActive,
  onRemoveStudent,
  onLoadDemo
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });

  // Ordenação e Filtro com useMemo
  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (!term) return sorted;
    return sorted.filter(s => 
      s.name.toLowerCase().includes(term) || 
      (s.phone && s.phone.toLowerCase().includes(term))
    );
  }, [students, searchTerm]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddStudent(newName.trim(), newPhone.trim());
    setNewName('');
    setNewPhone('');
  };

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditForm({ name: student.name, phone: student.phone || '' });
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm.name.trim()) return;
    onUpdateStudent(editingId, editForm.name.trim(), editForm.phone.trim());
    setEditingId(null);
  };

  const activeCount = students.filter(s => s.active !== false).length;

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <Users className="text-blue-600" /> Cadastro de Alunos
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {students.length} cadastrados • <span className="text-emerald-700 font-medium">{activeCount} ativos</span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onLoadDemo}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Restaurar turma de demonstração"
            >
              <RotateCcw size={12} /> Turma Demo
            </button>
          </div>
        </div>

        {/* Formulário de Inclusão de Novo Aluno */}
        <div className="grid md:grid-cols-2 gap-2 mb-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
          <input 
            type="text" 
            placeholder="Nome completo do aluno..." 
            className="bg-white border border-gray-300 rounded-lg p-2.5 text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-2">
            <input 
              type="tel" 
              placeholder="Telefone (opcional)..." 
              className="bg-white border border-gray-300 rounded-lg p-2.5 text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
              value={newPhone} 
              onChange={(e) => setNewPhone(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()} 
            />
            <button 
              onClick={handleAdd} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer active:scale-95"
              title="Adicionar aluno"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Barra de Pesquisa Rápida */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar aluno por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
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

        {/* Lista com Rolagem */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl bg-gray-50 text-sm">
              {searchTerm 
                ? `Nenhum aluno encontrado para "${searchTerm}".` 
                : 'Nenhum aluno cadastrado ainda. Use o campo acima para adicionar ou clique em Turma Demo.'}
            </div>
          ) : (
            filteredStudents.map(student => {
              const isInactive = student.active === false;

              return (
                <div 
                  key={student.id} 
                  className={`bg-white p-3.5 rounded-xl border transition-all ${
                    isInactive 
                      ? 'border-gray-200 bg-gray-50/70 opacity-75' 
                      : 'border-gray-200 shadow-2xs hover:border-blue-300'
                  } flex flex-col sm:flex-row justify-between items-center gap-3`}
                >
                  {editingId === student.id ? (
                    <div className="flex-1 w-full grid gap-2">
                      <input 
                        className="border border-blue-400 p-2 rounded-lg text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                        value={editForm.name} 
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                        placeholder="Nome..."
                        autoFocus
                      />
                      <input 
                        className="border border-gray-300 p-2 rounded-lg text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                        value={editForm.phone} 
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })} 
                        placeholder="Telefone..."
                      />
                      <div className="flex gap-2 justify-end mt-1">
                        <button 
                          onClick={handleSaveEdit} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Salvar
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <span className={`font-semibold text-sm ${isInactive ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {student.name}
                          </span>
                          {isInactive && (
                            <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                              Inativo
                            </span>
                          )}
                        </div>
                        {student.phone ? (
                          <div className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                            <Phone size={12} className="text-gray-400" /> {student.phone}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sem telefone</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Alternar Ativo/Inativo */}
                        <button
                          onClick={() => onToggleStudentActive(student.id)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isInactive 
                              ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50' 
                              : 'text-emerald-600 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={isInactive ? 'Reativar aluno' : 'Desativar aluno (mantém histórico)'}
                        >
                          {isInactive ? <UserX size={17} /> : <UserCheck size={17} />}
                        </button>

                        {/* Editar */}
                        <button 
                          onClick={() => handleStartEdit(student)} 
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Editar aluno"
                        >
                          <Edit size={17} />
                        </button>

                        {/* Excluir */}
                        <button 
                          onClick={() => onRemoveStudent(student.id, student.name)} 
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Remover aluno"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
