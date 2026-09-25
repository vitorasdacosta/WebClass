import { useState, useEffect } from 'react';
import { 
  Student, 
  ClassEntry, 
  ViewType, 
  ModalConfig, 
  ToastConfig, 
  AttendanceMap, 
  ReportRange 
} from './types';
import { DEMO_STUDENTS, DEMO_CLASSES } from './data/demoData';

import { getDayMonthYear } from './utils/formatters';
import { exportMatrixToCsv } from './utils/exportImport';
import { 
  printClassEntry, 
  printAttendanceMatrix, 
  printStudentList 
} from './utils/printService';

import { Toast } from './components/common/Toast';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';

import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { ClassRegisterView } from './components/register/ClassRegisterView';
import { HistoryView } from './components/history/HistoryView';
import { ReportView } from './components/report/ReportView';

export default function App() {
  const [view, setView] = useState<ViewType>('dashboard');

  // Toasts
  const [toast, setToast] = useState<ToastConfig>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ isOpen: true, message, type });
  };

  useEffect(() => {
    if (toast.isOpen) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, isOpen: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.isOpen]);

  // Modais de Confirmação
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    onConfirm: () => {}
  });

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Carregamento de Alunos com LocalStorage
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('diary_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEMO_STUDENTS;
    } catch {
      return DEMO_STUDENTS;
    }
  });

  // Carregamento de Aulas com LocalStorage
  const [classes, setClasses] = useState<ClassEntry[]>(() => {
    try {
      const saved = localStorage.getItem('diary_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEMO_CLASSES;
    } catch {
      return DEMO_CLASSES;
    }
  });

  // Sincronização com LocalStorage
  useEffect(() => {
    localStorage.setItem('diary_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('diary_classes', JSON.stringify(classes));
  }, [classes]);

  // Alerta de fechamento acidental da aba
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Formulário de Aula
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null);
  const [classForm, setClassForm] = useState<{
    date: string;
    topic: string;
    lecturer: string;
    texts: string;
    attendance: AttendanceMap;
  }>({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    lecturer: '',
    texts: '',
    attendance: {}
  });

  // Filtro de Relatório
  const [reportRange, setReportRange] = useState<ReportRange>({ start: '', end: '' });

  // --- Handlers de Demonstração & Limpeza ---
  const handleLoadDemo = () => {
    setModalConfig({
      isOpen: true,
      title: 'Carregar Turma de Demonstração',
      message: 'Deseja carregar a turma didática modelo com 10 alunos e 5 aulas com presenças preenchidas?',
      confirmText: 'Sim, Carregar Demonstração',
      cancelText: 'Cancelar',
      type: 'warning',
      onConfirm: () => {
        setStudents(DEMO_STUDENTS);
        setClasses(DEMO_CLASSES);
        closeModal();
        showToast('Turma de demonstração carregada com sucesso!', 'success');
      }
    });
  };

  const handleClearAll = () => {
    setModalConfig({
      isOpen: true,
      title: 'Limpar Todos os Dados do Diário',
      message: 'Tem certeza que deseja apagar todos os alunos e aulas para iniciar um diário novo?',
      confirmText: 'Sim, Limpar Tudo',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => {
        setStudents([]);
        setClasses([]);
        closeModal();
        showToast('Diário de classe limpo com sucesso.', 'info');
      }
    });
  };

  // --- Handlers de Backup (JSON) ---
  const handleExportJson = () => {
    const backupData = {
      students,
      classes,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `backup-webclass-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Backup do WebClass exportado com sucesso!', 'success');
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const imported = JSON.parse(text);
        if (imported.students && Array.isArray(imported.students)) {
          setStudents(imported.students);
        }
        if (imported.classes && Array.isArray(imported.classes)) {
          setClasses(imported.classes);
        }
        showToast('Dados do diário restaurados com sucesso!', 'success');
      } catch {
        showToast('Erro ao ler arquivo de backup. Verifique se é um JSON válido.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // --- Handlers de Alunos ---
  const handleAddStudent = (name: string, phone: string) => {
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name,
      phone,
      active: true
    };
    setStudents(prev => [...prev, newStudent]);
    showToast(`Aluno "${name}" adicionado!`, 'success');
  };

  const handleUpdateStudent = (id: string, name: string, phone: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name, phone } : s));
    showToast('Cadastro de aluno atualizado!', 'success');
  };

  const handleToggleStudentActive = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const newStatus = s.active === false ? true : false;
        showToast(
          newStatus ? `Aluno "${s.name}" reativado!` : `Aluno "${s.name}" marcado como inativo.`,
          'info'
        );
        return { ...s, active: newStatus };
      }
      return s;
    }));
  };

  const handleRemoveStudent = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Remover Aluno',
      message: `Tem certeza que deseja remover "${name}"? O histórico de presenças em aulas passadas será mantido.`,
      confirmText: 'Sim, Remover',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => {
        setStudents(prev => prev.filter(s => s.id !== id));
        closeModal();
        showToast(`Aluno "${name}" removido.`, 'info');
      }
    });
  };

  // --- Handlers de Aulas ---
  const handleStartNewClass = () => {
    setEditingClass(null);
    setClassForm({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      lecturer: '',
      texts: '',
      attendance: {}
    });
    setView('register');
  };

  const handleStartEditClass = (cls: ClassEntry) => {
    setEditingClass(cls);
    setClassForm({
      date: cls.date,
      topic: cls.topic,
      lecturer: cls.lecturer,
      texts: cls.texts,
      attendance: cls.attendance || {}
    });
    setView('register');
  };

  const handleCancelEditClass = () => {
    setEditingClass(null);
    setView('history');
  };

  const handleChangeClassForm = (field: string, value: string | AttendanceMap) => {
    setClassForm(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleAttendance = (studentId: string) => {
    setClassForm(prev => ({
      ...prev,
      attendance: { ...prev.attendance, [studentId]: !prev.attendance[studentId] }
    }));
  };

  const handleSaveClass = () => {
    if (!classForm.topic.trim() || !classForm.lecturer.trim()) {
      showToast('Por favor, informe o tema e o preletor da aula.', 'error');
      return;
    }

    const dateInfo = getDayMonthYear(classForm.date);

    if (editingClass) {
      setClasses(prev => prev.map(c => 
        c.id === editingClass.id ? { ...c, ...classForm, ...dateInfo } : c
      ));
      setEditingClass(null);
      showToast('Aula atualizada com sucesso!', 'success');
    } else {
      const newEntry: ClassEntry = {
        id: `cls-${Date.now()}`,
        ...classForm,
        ...dateInfo
      };
      setClasses(prev => [newEntry, ...prev]);
      showToast('Aula registrada no diário com sucesso!', 'success');
    }

    setView('history');
  };

  const handleDeleteClass = (id: string, topic: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Excluir Registro de Aula',
      message: `Deseja realmente excluir permanentemente a aula "${topic}"?`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => {
        setClasses(prev => prev.filter(c => c.id !== id));
        closeModal();
        showToast('Aula excluída do histórico.', 'info');
      }
    });
  };

  const handlePrintClass = (cls: ClassEntry) => {
    printClassEntry(cls, students);
  };

  const handlePrintReport = () => {
    const filtered = classes
      .filter(c => (!reportRange.start || c.date >= reportRange.start) && (!reportRange.end || c.date <= reportRange.end))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filtered.length === 0) {
      showToast('Nenhuma aula encontrada no período selecionado.', 'error');
      return;
    }
    printAttendanceMatrix(filtered, students, reportRange);
  };

  const handlePrintStudentList = () => {
    printStudentList(students);
  };

  const handleExportDiaryCsv = () => {
    exportMatrixToCsv(students, classes, reportRange);
    showToast('Planilha CSV de frequência gerada!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-20 md:pb-8 relative">
      {/* Toast Notificações */}
      <Toast toast={toast} onClose={() => setToast(prev => ({ ...prev, isOpen: false }))} />

      {/* Modal de Confirmação */}
      <ConfirmationModal config={modalConfig} onClose={closeModal} />

      {/* Cabeçalho Limpo e Focado no Diário Escolar */}
      <Header 
        currentView={view} 
        onNavigate={setView} 
        onLoadDemo={handleLoadDemo} 
      />

      {/* Conteúdo Principal do WebClass */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {view === 'dashboard' && (
          <DashboardView
            students={students}
            classes={classes}
            onNavigate={setView}
            onNewClass={handleStartNewClass}
            onLoadDemo={handleLoadDemo}
            onClearAll={handleClearAll}
            onExportJson={handleExportJson}
            onImportFile={handleImportFile}
          />
        )}

        {view === 'students' && (
          <StudentsView
            students={students}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onToggleStudentActive={handleToggleStudentActive}
            onRemoveStudent={handleRemoveStudent}
            onLoadDemo={handleLoadDemo}
          />
        )}

        {view === 'register' && (
          <ClassRegisterView
            students={students}
            editingClass={editingClass}
            form={classForm}
            onChangeForm={handleChangeClassForm}
            onToggleAttendance={handleToggleAttendance}
            onSaveClass={handleSaveClass}
            onCancelEdit={handleCancelEditClass}
          />
        )}

        {view === 'history' && (
          <HistoryView
            classes={classes}
            students={students}
            onNewClass={handleStartNewClass}
            onEditClass={handleStartEditClass}
            onDeleteClass={handleDeleteClass}
            onPrintClass={handlePrintClass}
          />
        )}

        {view === 'report' && (
          <ReportView
            students={students}
            classes={classes}
            reportRange={reportRange}
            onChangeRange={(field, val) => setReportRange(prev => ({ ...prev, [field]: val }))}
            onResetRange={() => setReportRange({ start: '', end: '' })}
            onPrintStudentList={handlePrintStudentList}
            onPrintReport={handlePrintReport}
            onExportCsv={handleExportDiaryCsv}
          />
        )}
      </main>

      {/* Navegação Inferior Mobile */}
      <BottomNav
        currentView={view}
        onNavigate={setView}
        onNewClass={handleStartNewClass}
      />
    </div>
  );
}
