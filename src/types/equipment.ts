export type EquipmentCategory = 
  | 'Laboratório' 
  | 'Agrícola & Campo' 
  | 'Informática' 
  | 'Audiovisual' 
  | 'Oficina & Mecânica' 
  | 'Geral';

export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'retired';

export type EquipmentCondition = 'excellent' | 'good' | 'regular' | 'needs_repair';

export interface Equipment {
  id: string;
  code: string; // Código de Patrimônio / Tombo (ex: EQP-2026-001)
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  location: string;
  responsible?: string;
  lastMaintenanceDate?: string;
  notes?: string;
}
