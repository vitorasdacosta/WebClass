import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  Calendar, 
  FileSpreadsheet
} from 'lucide-react';
import { ViewType } from '../../types';
import { SuiteMenu } from './SuiteMenu';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLoadDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onNavigate, 
  onLoadDemo 
}) => {
  return (
    <header className="bg-blue-700 text-white shadow-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center gap-3">
        
        {/* Marca WebClass */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none group" 
          onClick={() => onNavigate('dashboard')}
        >
          <div className="bg-blue-800 p-2 rounded-xl group-hover:bg-blue-900 transition-colors shadow-xs">
            <BookOpen size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">WebClass</h1>
            <p className="text-[10px] text-blue-200">Diário de Classe & Frequência</p>
          </div>
        </div>

        {/* Links rápidos para Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-blue-800/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              currentView === 'dashboard' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white hover:bg-blue-700/60'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('students')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'students' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white hover:bg-blue-700/60'
            }`}
          >
            <Users size={14} /> Alunos
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'history' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white hover:bg-blue-700/60'
            }`}
          >
            <Calendar size={14} /> Histórico
          </button>
          <button
            onClick={() => onNavigate('report')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'report' ? 'bg-white text-blue-800 shadow-xs' : 'text-blue-100 hover:text-white hover:bg-blue-700/60'
            }`}
          >
            <FileSpreadsheet size={14} /> Relatórios
          </button>
        </nav>

        {/* Ações: Modo Demonstração & Suite Menu */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="bg-blue-800 hover:bg-blue-900 text-blue-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-blue-600 transition-colors shadow-inner cursor-pointer"
            title="Carregar turma modelo de demonstração"
          >
            <Sparkles size={14} className="text-amber-300" />
            <span className="hidden sm:inline">Modo Demo</span>
          </button>

          {/* Seletor da WebSuite */}
          <SuiteMenu currentAppId="webclass" />
        </div>
      </div>
    </header>
  );
};
