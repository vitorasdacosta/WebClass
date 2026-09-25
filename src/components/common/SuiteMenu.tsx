import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutGrid, 
  BookOpen, 
  Wrench, 
  Car, 
  Landmark, 
  Building2, 
  ChevronDown, 
  ExternalLink 
} from 'lucide-react';

interface SuiteApp {
  id: string;
  name: string;
  badge: string;
  description: string;
  url: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

export function getSuiteAppUrl(appId: string): string {
  if (typeof window === 'undefined') return `/${appId}/`;
  const path = window.location.pathname;
  const match = path.match(/^(.*\/)(webclass|webequip|webzoo|webfrota|webpatrimonio|webimoveis)(\/|$)/i);
  if (match) {
    return `${match[1]}${appId}/`;
  }
  return `/${appId}/`;
}

export const SUITE_APPS: SuiteApp[] = [
  {
    id: 'webclass',
    name: 'WebClass',
    badge: 'Alunos',
    description: 'Diário escolar, chamadas e notas de frequência',
    url: '/webclass/',
    icon: BookOpen,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'webequip',
    name: 'WebEquip',
    badge: 'Equipamentos',
    description: 'Peças, ferramentas, acessórios e manutenção',
    url: '/webequip/',
    icon: Wrench,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'webzoo',
    name: 'WebZoo',
    badge: 'Zootecnia',
    description: 'Controle de animais de todas as matrizes',
    url: '/webzoo/',
    icon: () => <span className="text-base">🐄</span>,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'webfrota',
    name: 'WebFrota',
    badge: 'Veículos',
    description: 'Carros, tratores, caminhões, combustível e KM',
    url: '/webfrota/',
    icon: Car,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'webpatrimonio',
    name: 'WebPatrimônio',
    badge: 'Bens Móveis',
    description: 'Móveis, computadores tombados por setor/sala',
    url: '/webpatrimonio/',
    icon: Landmark,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'webimoveis',
    name: 'WebImóveis',
    badge: 'Imóveis',
    description: 'Prédios, galpões, salas, terrenos e reformas',
    url: '/webimoveis/',
    icon: Building2,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50'
  }
];

interface SuiteMenuProps {
  currentAppId: string;
}

export const SuiteMenu: React.FC<SuiteMenuProps> = ({ currentAppId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentApp = SUITE_APPS.find(a => a.id === currentAppId) || SUITE_APPS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
        title="Navegar entre as aplicações da WebSuite"
      >
        <LayoutGrid size={15} className="text-blue-400" />
        <span className="hidden sm:inline font-extrabold text-blue-100">WebSuite</span>
        <span className="text-[11px] font-normal text-slate-400">({currentApp.name})</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-scaleUp">
          <div className="px-2 py-1.5 mb-2 border-b border-slate-100 flex justify-between items-center">
            <div>
              <p className="font-extrabold text-slate-900 text-xs tracking-tight">WebSuite Ecossistema</p>
              <p className="text-[10px] text-slate-500">Selecione o sistema desejado para abrir</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              6 Sistemas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUITE_APPS.map(app => {
              const isCurrent = app.id === currentAppId;
              const Icon = app.icon;

              return (
                <a
                  key={app.id}
                  href={getSuiteAppUrl(app.id)}
                  className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group cursor-pointer ${
                    isCurrent 
                      ? 'bg-blue-50/70 border-blue-200 shadow-2xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${app.bgColor} ${app.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs truncate ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                        {app.name}
                      </span>
                      {isCurrent ? (
                        <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          Ativo
                        </span>
                      ) : (
                        <ExternalLink size={11} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {app.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
