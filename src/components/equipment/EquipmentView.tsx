import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  Edit, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X,
  SlidersHorizontal,
  ArrowRightLeft
} from 'lucide-react';
import { 
  Equipment, 
  EquipmentCategory, 
  EquipmentStatus, 
  EquipmentCondition 
} from '../../types/equipment';
import { 
  getStatusBadgeInfo, 
  getConditionBadgeInfo 
} from '../../utils/equipmentService';
import { formatDate } from '../../utils/formatters';

interface EquipmentViewProps {
  equipment: Equipment[];
  onAddEquipment: (item: Omit<Equipment, 'id'>) => void;
  onUpdateEquipment: (id: string, item: Omit<Equipment, 'id'>) => void;
  onDeleteEquipment: (id: string, name: string) => void;
  onToggleStatus: (id: string, newStatus: EquipmentStatus) => void;
  onLoadDemoEquipment: () => void;
  onPrintEquipment: () => void;
  onExportCsv: () => void;
}

const CATEGORIES: EquipmentCategory[] = [
  'Laboratório',
  'Agrícola & Campo',
  'Informática',
  'Audiovisual',
  'Oficina & Mecânica',
  'Geral'
];

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipment,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment,
  onToggleStatus,
  onLoadDemoEquipment,
  onPrintEquipment,
  onExportCsv
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Estado do Modal de Cadastro / Edição
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    code: '',
    name: '',
    category: 'Laboratório',
    status: 'available',
    condition: 'good',
    location: '',
    responsible: '',
    lastMaintenanceDate: '',
    notes: ''
  });

  // Métricas
  const totalCount = equipment.length;
  const availableCount = equipment.filter(e => e.status === 'available').length;
  const inUseCount = equipment.filter(e => e.status === 'in_use').length;
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;

  // Filtragem
  const filteredEquipment = useMemo(() => {
    return equipment.filter(item => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        item.name.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term) ||
        (item.responsible && item.responsible.toLowerCase().includes(term)) ||
        item.location.toLowerCase().includes(term);

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStat = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStat;
    });
  }, [equipment, searchTerm, selectedCategory, selectedStatus]);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      code: `EQP-${new Date().getFullYear()}-${String(equipment.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'Laboratório',
      status: 'available',
      condition: 'good',
      location: '',
      responsible: '',
      lastMaintenanceDate: '',
      notes: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingId(item.id);
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      status: item.status,
      condition: item.condition,
      location: item.location,
      responsible: item.responsible || '',
      lastMaintenanceDate: item.lastMaintenanceDate || '',
      notes: item.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    if (editingId) {
      onUpdateEquipment(editingId, formData);
    } else {
      onAddEquipment(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho do Módulo */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700">
            <Wrench size={22} />
            <h2 className="text-xl font-bold text-gray-900">Equipamentos & Patrimônio</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Controle de inventário, categorias, empréstimos para aulas e manutenções preventivas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={onLoadDemoEquipment}
            className="text-xs text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Carregar itens didáticos modelo"
          >
            <RotateCcw size={14} /> Itens Demo
          </button>
          <button
            onClick={onPrintEquipment}
            className="text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} /> Imprimir
          </button>
          <button
            onClick={onExportCsv}
            className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} /> CSV
          </button>
          <button
            onClick={handleOpenNew}
            className="text-xs text-white bg-amber-600 hover:bg-amber-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={16} /> Novo Equipamento
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 mb-1">
            <span className="text-xs font-semibold">Total Cadastrado</span>
            <Wrench size={16} className="text-gray-400" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalCount}</p>
          <span className="text-[11px] text-gray-400">itens patrimoniados</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-emerald-600 mb-1">
            <span className="text-xs font-semibold">Disponíveis</span>
            <CheckCircle2 size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{availableCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">prontos para aula</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-blue-600 mb-1">
            <span className="text-xs font-semibold">Em Uso / Emprestados</span>
            <Clock size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{inUseCount}</p>
          <span className="text-[11px] text-blue-600 font-medium">em atividades</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-amber-600 mb-1">
            <span className="text-xs font-semibold">Em Manutenção</span>
            <AlertCircle size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{maintenanceCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">aguardando reparo</span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar equipamento por nome, patrimônio, localização ou responsável..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all"
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

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold mr-1">
            <SlidersHorizontal size={14} />
            <span>Filtros:</span>
          </div>

          {/* Filtro de Categoria */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">Todas as Categorias</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Filtro de Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="available">Disponível</option>
            <option value="in_use">Em Uso</option>
            <option value="maintenance">Em Manutenção</option>
            <option value="retired">Baixado</option>
          </select>

          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-auto cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
            Nenhum equipamento encontrado com os filtros atuais.
          </div>
        ) : (
          filteredEquipment.map(item => {
            const statusInfo = getStatusBadgeInfo(item.status);
            const conditionInfo = getConditionBadgeInfo(item.condition);

            return (
              <div 
                key={item.id} 
                className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-mono text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                      {item.code}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.colorClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span>•</span>
                    <span>Condição: <strong className={conditionInfo.colorClass}>{conditionInfo.label}</strong></span>
                  </div>

                  <div className="mt-3 text-xs text-gray-600 space-y-1 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                    <p>📍 <strong>Local:</strong> {item.location}</p>
                    {item.responsible && (
                      <p>👤 <strong>Responsável:</strong> {item.responsible}</p>
                    )}
                    {item.lastMaintenanceDate && (
                      <p>🔧 <strong>Última revisão:</strong> {formatDate(item.lastMaintenanceDate)}</p>
                    )}
                    {item.notes && (
                      <p className="text-gray-500 italic mt-1 pt-1 border-t border-gray-200/60">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de Ações Rápidas */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    {item.status === 'available' && (
                      <button
                        onClick={() => onToggleStatus(item.id, 'in_use')}
                        className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Registrar empréstimo para aula"
                      >
                        <ArrowRightLeft size={13} /> Emprestar
                      </button>
                    )}
                    {item.status === 'in_use' && (
                      <button
                        onClick={() => onToggleStatus(item.id, 'available')}
                        className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Registrar devolução do equipamento"
                      >
                        <CheckCircle2 size={13} /> Devolver
                      </button>
                    )}
                    {item.status !== 'maintenance' ? (
                      <button
                        onClick={() => onToggleStatus(item.id, 'maintenance')}
                        className="text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Enviar para manutenção"
                      >
                        <Wrench size={15} />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(item.id, 'available')}
                        className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        title="Liberar da manutenção"
                      >
                        Liberar p/ Uso
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar equipamento"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteEquipment(item.id, item.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir equipamento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Cadastro / Edição */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Wrench className="text-amber-600" />
                {editingId ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Código / Patrimônio *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="Ex: EQP-2026-001"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Categoria *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as EquipmentCategory })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nome do Equipamento *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="Ex: Microscópio Binocular 1000x"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Status Operacional</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as EquipmentStatus })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="available">Disponível</option>
                    <option value="in_use">Em Uso / Emprestado</option>
                    <option value="maintenance">Em Manutenção</option>
                    <option value="retired">Baixado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Condição Física</label>
                  <select
                    value={formData.condition}
                    onChange={e => setFormData({ ...formData, condition: e.target.value as EquipmentCondition })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="excellent">Excelente</option>
                    <option value="good">Bom</option>
                    <option value="regular">Regular</option>
                    <option value="needs_repair">Necessita Reparo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Localização / Sala</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="Ex: Lab de Ciências 02"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Responsável Atual</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={e => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="Nome do professor ou técnico"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Última Revisão / Manutenção</label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={e => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Observações Didáticas ou Técnicas</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  placeholder="Instruções de uso, acessórios inclusos, etc..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {editingId ? 'Atualizar Equipamento' : 'Salvar no Inventário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
