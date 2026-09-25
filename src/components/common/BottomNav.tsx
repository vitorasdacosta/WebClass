import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  History, 
  FileSpreadsheet 
} from 'lucide-react';
import { ViewType } from '../../types';

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onNewClass: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onNewClass }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center px-1 py-1.5 md:hidden shadow-lg z-20">
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer w-14 ${
          currentView === 'dashboard' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LayoutDashboard size={20} />
        <span className="text-[10px] mt-0.5">Início</span>
      </button>

      <button
        onClick={() => onNavigate('students')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer w-14 ${
          currentView === 'students' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <Users size={20} />
        <span className="text-[10px] mt-0.5">Alunos</span>
      </button>

      {/* Botão Central de Destaque para Nova Aula */}
      <button
        onClick={onNewClass}
        className="flex flex-col items-center justify-center -mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
        title="Registrar nova aula"
      >
        <PlusCircle size={24} />
      </button>

      <button
        onClick={() => onNavigate('history')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer w-14 ${
          currentView === 'history' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <History size={20} />
        <span className="text-[10px] mt-0.5">Histórico</span>
      </button>

      <button
        onClick={() => onNavigate('report')}
        className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer w-14 ${
          currentView === 'report' ? 'text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <FileSpreadsheet size={20} />
        <span className="text-[10px] mt-0.5">Relatórios</span>
      </button>
    </nav>
  );
};
