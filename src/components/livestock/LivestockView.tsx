import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Printer, 
  Download, 
  Edit, 
  Trash2, 
  RotateCcw, 
  ShieldAlert, 
  SlidersHorizontal,
  X,
  Syringe,
  Scale
} from 'lucide-react';
import { 
  LivestockAnimal, 
  LivestockSpecies, 
  LivestockStatus, 
  VaccinationStatus 
} from '../../types/livestock';
import { 
  getSpeciesLabel, 
  getAnimalStatusInfo, 
  getVaccinationBadgeInfo 
} from '../../utils/livestockService';
import { formatDate } from '../../utils/formatters';

interface LivestockViewProps {
  animals: LivestockAnimal[];
  onAddAnimal: (animal: Omit<LivestockAnimal, 'id'>) => void;
  onUpdateAnimal: (id: string, animal: Omit<LivestockAnimal, 'id'>) => void;
  onDeleteAnimal: (id: string, earring: string) => void;
  onToggleStatus: (id: string, newStatus: LivestockStatus) => void;
  onLoadDemoLivestock: () => void;
  onPrintLivestock: () => void;
  onExportCsv: () => void;
}

const SPECIES_OPTIONS: { value: LivestockSpecies; label: string; icon: string }[] = [
  { value: 'bovine', label: 'Bovino', icon: '🐄' },
  { value: 'ovine', label: 'Ovino', icon: '🐑' },
  { value: 'caprine', label: 'Caprino', icon: '🐐' },
  { value: 'equine', label: 'Equino', icon: '🐎' },
  { value: 'swine', label: 'Suíno', icon: '🐖' },
  { value: 'poultry', label: 'Aves', icon: '🐓' },
  { value: 'other', label: 'Outro', icon: '🐾' }
];

export const LivestockView: React.FC<LivestockViewProps> = ({
  animals,
  onAddAnimal,
  onUpdateAnimal,
  onDeleteAnimal,
  onToggleStatus,
  onLoadDemoLivestock,
  onPrintLivestock,
  onExportCsv
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Estado do Modal de Cadastro / Edição
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<LivestockAnimal, 'id'>>({
    earringNumber: '',
    name: '',
    species: 'bovine',
    breed: '',
    category: 'Vaca em Lactação',
    gender: 'female',
    birthDate: new Date().toISOString().split('T')[0],
    weight: 0,
    status: 'healthy',
    vaccinationStatus: 'up_to_date',
    lot: 'Piquete 01',
    notes: ''
  });

  // Métricas
  const totalCount = animals.length;
  const femaleCount = animals.filter(a => a.gender === 'female').length;
  const maleCount = animals.filter(a => a.gender === 'male').length;
  const inTreatmentCount = animals.filter(a => a.status === 'treatment' || a.status === 'quarantine').length;
  const pendingVacCount = animals.filter(a => a.vaccinationStatus === 'pending' || a.vaccinationStatus === 'overdue').length;

  // Filtragem
  const filteredAnimals = useMemo(() => {
    return animals.filter(item => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        item.earringNumber.toLowerCase().includes(term) ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        item.breed.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.lot.toLowerCase().includes(term);

      const matchesSpecies = selectedSpecies === 'all' || item.species === selectedSpecies;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [animals, searchTerm, selectedSpecies, selectedStatus]);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({
      earringNumber: `BOV-${String(animals.length + 1).padStart(3, '0')}`,
      name: '',
      species: 'bovine',
      breed: '',
      category: 'Vaca em Lactação',
      gender: 'female',
      birthDate: new Date().toISOString().split('T')[0],
      weight: 450,
      status: 'healthy',
      vaccinationStatus: 'up_to_date',
      lot: 'Piquete 01',
      notes: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (animal: LivestockAnimal) => {
    setEditingId(animal.id);
    setFormData({
      earringNumber: animal.earringNumber,
      name: animal.name || '',
      species: animal.species,
      breed: animal.breed,
      category: animal.category,
      gender: animal.gender,
      birthDate: animal.birthDate,
      weight: animal.weight || 0,
      status: animal.status,
      vaccinationStatus: animal.vaccinationStatus,
      lot: animal.lot,
      notes: animal.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.earringNumber.trim() || !formData.breed.trim()) return;

    if (editingId) {
      onUpdateAnimal(editingId, formData);
    } else {
      onAddAnimal(formData);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho do Módulo */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800">
            <span className="text-2xl">🐄</span>
            <h2 className="text-xl font-bold text-gray-900">Controle Zootécnico do Rebanho</h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Módulo agropecuário para gestão de animais, genealogia, piquetes/lotes e calendário sanitário.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={onLoadDemoLivestock}
            className="text-xs text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Carregar plantel modelo com bovinos, ovinos e equinos"
          >
            <RotateCcw size={14} /> Rebanho Demo
          </button>
          <button
            onClick={onPrintLivestock}
            className="text-xs text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} /> Imprimir Livro
          </button>
          <button
            onClick={onExportCsv}
            className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={14} /> CSV
          </button>
          <button
            onClick={handleOpenNew}
            className="text-xs text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={16} /> Cadastrar Animal
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 mb-1">
            <span className="text-xs font-semibold">Total do Rebanho</span>
            <span className="text-base">🐄</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalCount}</p>
          <span className="text-[11px] text-gray-500">{femaleCount} fêmeas • {maleCount} machos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-emerald-600 mb-1">
            <span className="text-xs font-semibold">Sanidade em Dia</span>
            <Syringe size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{totalCount - inTreatmentCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">animais saudáveis</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-amber-600 mb-1">
            <span className="text-xs font-semibold">Em Tratamento</span>
            <ShieldAlert size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{inTreatmentCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">cuidados veterinários</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="flex justify-between items-center text-red-600 mb-1">
            <span className="text-xs font-semibold">Vacinas Pendentes</span>
            <Syringe size={16} />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{pendingVacCount}</p>
          <span className="text-[11px] text-red-600 font-medium">requer atenção</span>
        </div>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número do brinco, nome, raça, categoria ou piquete..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
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

          {/* Filtro de Espécie */}
          <select
            value={selectedSpecies}
            onChange={e => setSelectedSpecies(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Todas as Espécies</option>
            {SPECIES_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
            ))}
          </select>

          {/* Filtro de Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="healthy">Saudável</option>
            <option value="treatment">Em Tratamento</option>
            <option value="quarantine">Quarentena</option>
            <option value="sold">Vendido</option>
            <option value="deceased">Baixa</option>
          </select>

          {(selectedSpecies !== 'all' || selectedStatus !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedSpecies('all');
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

      {/* Grid de Animais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredAnimals.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
            Nenhum animal encontrado com os filtros selecionados.
          </div>
        ) : (
          filteredAnimals.map(animal => {
            const speciesInfo = getSpeciesLabel(animal.species);
            const statusInfo = getAnimalStatusInfo(animal.status);
            const vacInfo = getVaccinationBadgeInfo(animal.vaccinationStatus);

            return (
              <div 
                key={animal.id} 
                className="bg-white p-4.5 rounded-2xl border border-gray-200 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {animal.earringNumber}
                      </span>
                      <span className="text-sm" title={speciesInfo.label}>
                        {speciesInfo.icon}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${vacInfo.colorClass}`}>
                        Vac: {vacInfo.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.colorClass}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug">
                    {animal.name ? animal.name : `Animal ${animal.earringNumber}`}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 flex-wrap">
                    <span className="font-semibold text-gray-700">
                      {animal.breed}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {animal.category}
                    </span>
                    <span>•</span>
                    <span>{animal.gender === 'female' ? '♀ Fêmea' : '♂ Macho'}</span>
                  </div>

                  <div className="mt-3 text-xs text-gray-600 space-y-1 bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                    <div className="flex justify-between">
                      <span>📍 <strong>Lote/Piquete:</strong> {animal.lot}</span>
                      {animal.weight && (
                        <span className="flex items-center gap-1 font-bold text-gray-700">
                          <Scale size={12} /> {animal.weight} kg
                        </span>
                      )}
                    </div>
                    <p>🎂 <strong>Nascimento:</strong> {formatDate(animal.birthDate)}</p>
                    {animal.notes && (
                      <p className="text-gray-500 italic mt-1 pt-1 border-t border-gray-200/60">
                        "{animal.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de Ações Rápidas */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    {animal.status === 'healthy' ? (
                      <button
                        onClick={() => onToggleStatus(animal.id, 'treatment')}
                        className="text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        title="Marcar início de tratamento veterinário"
                      >
                        Iniciar Tratamento
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(animal.id, 'healthy')}
                        className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                        title="Registrar alta médica / animal recuperado"
                      >
                        Alta / Saudável
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(animal)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Editar ficha do animal"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteAnimal(animal.id, animal.earringNumber)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Dar baixa / excluir animal"
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
                <span className="text-xl">🐄</span>
                {editingId ? 'Editar Ficha do Animal' : 'Cadastrar Novo Animal'}
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
                  <label className="text-xs font-bold text-gray-600 block mb-1">Brinco / Registro *</label>
                  <input
                    type="text"
                    required
                    value={formData.earringNumber}
                    onChange={e => setFormData({ ...formData, earringNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ex: BOV-015"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Nome / Apelido</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ex: Mimosa"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Espécie *</label>
                  <select
                    value={formData.species}
                    onChange={e => setFormData({ ...formData, species: e.target.value as LivestockSpecies })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    {SPECIES_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Raça *</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={e => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ex: Nelore, Girolando..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Categoria Zootécnica</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ex: Vaca em Lactação, Matriz..."
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Sexo</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as 'female' | 'male' })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="female">Fêmea</option>
                    <option value="male">Macho</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Peso Atual (kg)</label>
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ex: 520"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Status Sanitário</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as LivestockStatus })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="healthy">Saudável</option>
                    <option value="treatment">Em Tratamento</option>
                    <option value="quarantine">Quarentena</option>
                    <option value="sold">Vendido</option>
                    <option value="deceased">Baixa / Óbito</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Vacinação</label>
                  <select
                    value={formData.vaccinationStatus}
                    onChange={e => setFormData({ ...formData, vaccinationStatus: e.target.value as VaccinationStatus })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    <option value="up_to_date">Em Dia</option>
                    <option value="pending">Pendente</option>
                    <option value="overdue">Atrasada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Lote / Piquete / Baia *</label>
                <input
                  type="text"
                  required
                  value={formData.lot}
                  onChange={e => setFormData({ ...formData, lot: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="Ex: Piquete 02 - Pasto Rotacionado"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Observações Sanitárias ou Produtivas</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  placeholder="Produção leiteira, genealogia, tratamentos realizados..."
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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {editingId ? 'Atualizar Ficha' : 'Salvar no Rebanho'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
