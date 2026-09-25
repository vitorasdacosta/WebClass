import { Equipment } from '../types/equipment';

export const DEMO_EQUIPMENT: Equipment[] = [
  {
    id: 'eqp-1',
    code: 'LAB-2026-001',
    name: 'Microscópio Óptico Binocular 1000x',
    category: 'Laboratório',
    status: 'available',
    condition: 'excellent',
    location: 'Laboratório de Ciências e Biologia',
    responsible: 'Prof. André Calheiros',
    lastMaintenanceDate: '2026-08-01',
    notes: 'Lentes calibradas e limpas. Acompanha conjunto de lâminas.'
  },
  {
    id: 'eqp-2',
    code: 'AGR-2026-002',
    name: 'Trator Agrícola Utilitário 75 CV',
    category: 'Agrícola & Campo',
    status: 'in_use',
    condition: 'good',
    location: 'Galpão de Máquinas / Setor Agrícola',
    responsible: 'Instrutor Marcos Rocha',
    lastMaintenanceDate: '2026-07-15',
    notes: 'Em uso na aula prática de preparo de solo no Piquete 02.'
  },
  {
    id: 'eqp-3',
    code: 'INF-2026-003',
    name: 'Carrinho Móvel com 20 Laptops Educacionais',
    category: 'Informática',
    status: 'available',
    condition: 'good',
    location: 'Laboratório de Informática 01',
    responsible: 'Profa. Helena Vasconcelos',
    lastMaintenanceDate: '2026-08-20',
    notes: 'Baterias recarregadas e sistema Linux educacional atualizado.'
  },
  {
    id: 'eqp-4',
    code: 'MED-2026-004',
    name: 'Projetor Multimídia Laser 4000 Lumens',
    category: 'Audiovisual',
    status: 'in_use',
    condition: 'excellent',
    location: 'Auditório Principal',
    responsible: 'Prof. Dr. Ricardo Fontana',
    notes: 'Utilizado para a aula magna de encerramento.'
  },
  {
    id: 'eqp-5',
    code: 'AGR-2026-005',
    name: 'Pulverizador Costal Motorizado 20L',
    category: 'Agrícola & Campo',
    status: 'maintenance',
    condition: 'needs_repair',
    location: 'Oficina de Máquinas',
    responsible: 'Técnico Silvano Dias',
    lastMaintenanceDate: '2026-09-02',
    notes: 'Vazamento no bico de pulverização. Peça de reposição solicitada.'
  },
  {
    id: 'eqp-6',
    code: 'LAB-2026-006',
    name: 'Balança Analítica de Precisão 0.0001g',
    category: 'Laboratório',
    status: 'available',
    condition: 'excellent',
    location: 'Laboratório de Química & Solos',
    responsible: 'Profa. Dra. Camila Meirelles',
    lastMaintenanceDate: '2026-08-10',
    notes: 'Certificado de calibração válido até 2027.'
  },
  {
    id: 'eqp-7',
    code: 'OFI-2026-007',
    name: 'Motosserra a Combustão 50cc com Sabre 18"',
    category: 'Oficina & Mecânica',
    status: 'available',
    condition: 'good',
    location: 'Almoxarifado Geral',
    responsible: 'Coordenação de Campo',
    notes: 'Corrente afiada e kit de proteção EPI completo.'
  },
  {
    id: 'eqp-8',
    code: 'LAB-2026-008',
    name: 'Medidor Portátil de pH e Condutividade de Solo',
    category: 'Laboratório',
    status: 'available',
    condition: 'good',
    location: 'Armário Didático Lab 02',
    responsible: 'Prof. André Calheiros',
    notes: 'Acompanha soluções de calibração pH 4.0 e 7.0.'
  }
];
