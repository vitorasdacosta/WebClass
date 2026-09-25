export type LivestockSpecies = 
  | 'bovine' 
  | 'ovine' 
  | 'caprine' 
  | 'equine' 
  | 'swine' 
  | 'poultry' 
  | 'other';

export type LivestockStatus = 'healthy' | 'treatment' | 'quarantine' | 'sold' | 'deceased';

export type VaccinationStatus = 'up_to_date' | 'pending' | 'overdue';

export interface LivestockAnimal {
  id: string;
  earringNumber: string; // Número do brinco / registro (ex: BOV-042)
  name?: string;
  species: LivestockSpecies;
  breed: string;
  category: string; // ex: Vaca em Lactação, Bezerro, Matriz, Reprodutor, Engorda
  gender: 'female' | 'male';
  birthDate: string;
  weight?: number; // kg
  status: LivestockStatus;
  vaccinationStatus: VaccinationStatus;
  lot: string; // Piquete / Baia / Lote
  notes?: string;
}
