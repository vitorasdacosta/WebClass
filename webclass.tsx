import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  Save, 
  History, 
  LayoutDashboard, 
  UserCheck, 
  FileText, 
  ChevronRight, 
  Printer, 
  Edit, 
  Phone, 
  X, 
  ArrowLeft, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  Info,
  Sparkles,
  RotateCcw
} from 'lucide-react';

// --- Interfaces de Tipos ---
export interface Student {
  id: string;
  name: string;
  phone: string;
  active?: boolean;
}

export type AttendanceMap = Record<string, boolean>;

export interface ClassEntry {
  id: string;
  date: string;
  topic: string;
  lecturer: string;
  texts: string;
  attendance: AttendanceMap;
  day: number;
  month: number;
  year: number;
}

export interface ReportRange {
  start: string;
  end: string;
}

export interface DateInfo {
  day: number;
  month: number;
  year: number;
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

export interface ToastConfig {
  isOpen: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export type ViewType = 'dashboard' | 'students' | 'report' | 'register' | 'history';

// --- Dados de Demonstração Pré-Configurados (Para Apresentações de Vendas) ---
export const DEMO_STUDENTS: Student[] = [
  { id: 'std-1', name: 'Ana Beatriz Souza', phone: '(11) 98765-4321', active: true },
  { id: 'std-2', name: 'Carlos Eduardo Pereira', phone: '(11) 97654-3210', active: true },
  { id: 'std-3', name: 'Fernanda Lima Santos', phone: '(21) 99888-7766', active: true },
  { id: 'std-4', name: 'Gabriel Ferreira Ramos', phone: '(31) 98456-1122', active: true },
  { id: 'std-5', name: 'Juliana Martins Silva', phone: '(11) 99123-4567', active: true },
  { id: 'std-6', name: 'Lucas Henrique Alves', phone: '(41) 98877-6655', active: true },
  { id: 'std-7', name: 'Mariana Ribeiro Costa', phone: '(71) 99345-6789', active: true },
  { id: 'std-8', name: 'Pedro Rocha Barbosa', phone: '(81) 98765-1234', active: true },
  { id: 'std-9', name: 'Rodrigo Mendes Carvalho', phone: '(11) 97111-2233', active: true },
  { id: 'std-10', name: 'Sofia Almeida Castro', phone: '(19) 99555-4433', active: true }
];

export const DEMO_CLASSES: ClassEntry[] = [
  {
    id: 'cls-1',
    date: '2026-08-10',
    topic: 'Fundamentos de Gestão e Liderança de Equipes',
    lecturer: 'Prof. Dr. Ricardo Fontana',
    texts: 'Capítulos 1 e 2 da apostila; Estudo de caso sobre liderança adaptativa.',
    attendance: {
      'std-1': true, 'std-2': true, 'std-3': true, 'std-4': false,
      'std-5': true, 'std-6': true, 'std-7': true, 'std-8': false,
      'std-9': true, 'std-10': true
    },
    day: 10,
    month: 8,
    year: 2026
  },
  {
    id: 'cls-2',
    date: '2026-08-17',
    topic: 'Comunicação Assertiva e Resolução de Conflitos',
    lecturer: 'Profa. Ma. Helena Vasconcelos',
    texts: 'Os 4 Pilares da CNV no ambiente profissional; Dinâmica prática.',
    attendance: {
      'std-1': true, 'std-2': true, 'std-3': false, 'std-4': true,
      'std-5': true, 'std-6': true, 'std-7': true, 'std-8': true,
      'std-9': true, 'std-10': false
    },
    day: 17,
    month: 8,
    year: 2026
  },
  {
    id: 'cls-3',
    date: '2026-08-24',
    topic: 'Planejamento Estratégico e Metodologia OKR',
    lecturer: 'Prof. Dr. Ricardo Fontana',
    texts: 'Módulo 3: Definição de Metas Trimestrais; Planilha de acompanhamento.',
    attendance: {
      'std-1': true, 'std-2': true, 'std-3': true, 'std-4': true,
      'std-5': true, 'std-6': false, 'std-7': true, 'std-8': true,
      'std-9': true, 'std-10': true
    },
    day: 24,
    month: 8,
    year: 2026
  },
  {
    id: 'cls-4',
    date: '2026-08-31',
    topic: 'Tomada de Decisão Baseada em Dados e Indicadores',
    lecturer: 'Prof. Me. André Calheiros',
    texts: 'Análise de relatórios de desempenho e mensuração de KPIs gerenciais.',
    attendance: {
      'std-1': true, 'std-2': false, 'std-3': true, 'std-4': true,
      'std-5': true, 'std-6': true, 'std-7': true, 'std-8': true,
      'std-9': false, 'std-10': true
    },
    day: 31,
    month: 8,
    year: 2026
  },
  {
    id: 'cls-5',
    date: '2026-09-08',
    topic: 'Apresentação dos Projetos Práticos e Avaliação Final',
    lecturer: 'Prof. Dr. Ricardo Fontana e Banca Convidada',
    texts: 'Rubrica de avaliação por competências; Entrega dos relatórios finais.',
    attendance: {
      'std-1': true, 'std-2': true, 'std-3': true, 'std-4': true,
      'std-5': true, 'std-6': true, 'std-7': true, 'std-8': true,
      'std-9': true, 'std-10': true
    },
    day: 8,
    month: 9,
    year: 2026
  }
];

// --- Utilitários de Segurança e Sanitização ---
const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// --- Utilitários de Data ---
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateString;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Formata data curta para o cabeçalho do relatório (ex: 02/11)
const formatShortDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateString;
  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
};

const getDayMonthYear = (dateString: string): DateInfo => {
  if (!dateString) return { day: 0, month: 0, year: 0 };
  const [year, month, day] = dateString.split('-').map(Number);
  return { day: day || 0, month: month || 0, year: year || 0 };
};

export default function ClassDiaryApp() {
  // --- Estados (Navegação e Modais) ---
  const [view, setView] = useState<ViewType>('dashboard'); 
  const fileInputRef = useRef<HTMLInputElement | null>(null); 
  


  // Estados dos Modais e Toasts
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    onConfirm: () => {}
  });

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

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Carregamento de dados com fallback para os dados de demonstração
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('diary_students');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Se estiver vazio, inicia com os dados de demonstração
      return DEMO_STUDENTS;
    } catch { 
      return DEMO_STUDENTS; 
    }
  });

  const [classes, setClasses] = useState<ClassEntry[]>(() => {
    try {
      const saved = localStorage.getItem('diary_classes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Se estiver vazio, inicia com as aulas de demonstração
      return DEMO_CLASSES;
    } catch { 
      return DEMO_CLASSES; 
    }
  });

  // Ordenação com useMemo para performance
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [students]);

  // --- Estados de Edição ---
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentPhone, setNewStudentPhone] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });
  const [editingClass, setEditingClass] = useState<ClassEntry | null>(null); 

  // --- Estado do Relatório Geral ---
  const [reportRange, setReportRange] = useState<ReportRange>({ start: '', end: '' });

  // --- Estado do Formulário de Aula ---
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

  // --- Persistência e Proteção ao Sair ---
  useEffect(() => {
    localStorage.setItem('diary_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('diary_classes', JSON.stringify(classes));
  }, [classes]);

  // Alerta nativo ao tentar fechar a aba
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault(); 
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // --- Funções de Demonstração e Reset ---
  const loadDemoData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Carregar Dados de Demonstração',
      message: 'Isso substituirá os dados atuais por uma turma modelo com 10 alunos cadastrados e 5 aulas com presenças preenchidas. Deseja continuar?',
      confirmText: 'Sim, Carregar Demonstração',
      cancelText: 'Cancelar',
      type: 'warning',
      onConfirm: () => {
        setStudents(DEMO_STUDENTS);
        setClasses(DEMO_CLASSES);
        closeModal();
        showToast('Dados de demonstração carregados com sucesso! Pronto para apresentação.', 'success');
      }
    });
  };

  const clearAllData = () => {
    setModalConfig({
      isOpen: true,
      title: 'Limpar Todos os Dados',
      message: 'Tem certeza que deseja apagar todos os alunos e aulas cadastradas para iniciar do zero?',
      confirmText: 'Sim, Limpar Tudo',
      cancelText: 'Cancelar',
      type: 'danger',
      onConfirm: () => {
        setStudents([]);
        setClasses([]);
        closeModal();
        showToast('Sistema limpo com sucesso.', 'info');
      }
    });
  };

  // --- Funções de Backup ---
  const handleExport = () => {
    const data = { students, classes, exportedAt: new Date().toISOString() };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `backup-diario-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showToast('Arquivo de backup exportado com sucesso!', 'success');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const importedData = JSON.parse(text);
        if (importedData.students && Array.isArray(importedData.students)) {
          setStudents(importedData.students);
        }
        if (importedData.classes && Array.isArray(importedData.classes)) {
          setClasses(importedData.classes);
        }
        showToast('Dados restaurados com sucesso!', 'success');

      } catch { 
        showToast('Erro ao ler arquivo de backup. Verifique se é um JSON válido.', 'error'); 
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // --- Funções de Alunos ---
  const addStudent = () => {
    if (!newStudentName.trim()) {
      showToast('Informe o nome do aluno.', 'error');
      return;
    }
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      name: newStudentName.trim(),
      phone: newStudentPhone.trim(),
      active: true
    };
    setStudents(prev => [...prev, newStudent]);
    setNewStudentName('');
    setNewStudentPhone('');
    showToast(`Aluno "${newStudent.name}" adicionado com sucesso!`, 'success');
  };

  const removeStudent = (id: string, name: string) => {
    setModalConfig({
      isOpen: true,
      title: 'Remover Aluno',
      message: `Tem certeza que deseja remover o(a) aluno(a) "${name}"? O histórico de presenças anteriores será mantido.`,
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

  const startEditingStudent = (student: Student) => {
    setEditingId(student.id);
    setEditForm({ name: student.name, phone: student.phone || '' });
  };

  const saveStudentEdit = () => {
    if (!editForm.name.trim()) {
      showToast('O nome não pode ficar em branco.', 'error');
      return;
    }
    setStudents(prev => prev.map(s => s.id === editingId ? { ...s, name: editForm.name.trim(), phone: editForm.phone.trim() } : s));
    setEditingId(null);
    showToast('Cadastro atualizado com sucesso!', 'success');
  };

  // --- Funções de Aula ---
  const startNewClass = () => {
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

  const startEditingClass = (cls: ClassEntry) => {
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

  const toggleAttendance = (studentId: string) => {
    setClassForm(prev => ({
      ...prev,
      attendance: { ...prev.attendance, [studentId]: !prev.attendance[studentId] }
    }));
  };

  const saveClass = () => {
    if (!classForm.topic.trim() || !classForm.lecturer.trim()) { 
      showToast('Por favor, preencha o tema e o preletor da aula.', 'error'); 
      return; 
    }
    const dateInfo = getDayMonthYear(classForm.date);
    if (editingClass) {
      setClasses(prev => prev.map(c => c.id === editingClass.id ? { ...c, ...classForm, ...dateInfo } : c));
      setEditingClass(null);
      showToast('Aula atualizada com sucesso!', 'success');
    } else {
      const newEntry: ClassEntry = { 
        id: `cls-${Date.now()}`, 
        ...classForm, 
        ...dateInfo 
      };
      setClasses(prev => [newEntry, ...prev]);
      showToast('Aula registrada com sucesso!', 'success');
    }
    setView('history');
  };

  const cancelClassEdit = () => { 
    setEditingClass(null); 
    setView('history'); 
  };

  const deleteClass = (id: string, topic: string) => {
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

  // --- Impressão Individual ---
  const handlePrint = (classEntry: ClassEntry) => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Aula - ${escapeHtml(formatDate(classEntry.date))}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1f2937; }
            h1 { color: #1d4ed8; text-align: center; margin-bottom: 8px; font-size: 22px; }
            .meta { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 14px; }
            .meta p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #334155; font-weight: 600; }
            .present { color: #16a34a; font-weight: bold; text-align: center; }
            .absent { color: #dc2626; font-weight: bold; text-align: center; }
            .center { text-align: center; width: 40px; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Diário de Classe - ${escapeHtml(formatDate(classEntry.date))}</h1>
          <div class="meta">
            <p><strong>Tema da Aula:</strong> ${escapeHtml(classEntry.topic)}</p>
            <p><strong>Preletor / Professor:</strong> ${escapeHtml(classEntry.lecturer)}</p>
            ${classEntry.texts ? `<p><strong>Materiais / Referências:</strong> ${escapeHtml(classEntry.texts)}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th class="center">#</th>
                <th>Nome do Aluno</th>
                <th class="center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${sortedStudents.map((s, idx) => `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td>${escapeHtml(s.name)}</td>
                  <td class="${classEntry.attendance[s.id] ? 'present' : 'absent'}">
                    ${classEntry.attendance[s.id] ? 'PRESENTE' : 'FALTA'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) { 
      win.document.write(printContent); 
      win.document.close(); 
    }
  };

  // --- Impressão Relatório Geral (Matriz) ---
  const handlePrintReport = () => {
    const filteredClasses = classes
      .filter(c => (!reportRange.start || c.date >= reportRange.start) && (!reportRange.end || c.date <= reportRange.end))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (filteredClasses.length === 0) {
      showToast('Nenhuma aula encontrada no período selecionado.', 'error');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Relatório Geral de Frequência</title>
          <style>
            @page { size: landscape; margin: 12mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 10px; font-size: 11px; color: #111827; }
            h1 { color: #1d4ed8; text-align: center; margin-bottom: 4px; font-size: 18px; }
            .meta { text-align: center; color: #4b5563; margin-bottom: 16px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #cbd5e1; padding: 4px 6px; text-align: center; }
            th.num-col { width: 30px; text-align: center; background-color: #f1f5f9; }
            td.num-col { text-align: center; color: #64748b; font-size: 10px; }
            th.name-col { text-align: left; min-width: 160px; }
            td.name-col { text-align: left; font-weight: 600; }
            th { background-color: #f1f5f9; font-size: 10px; color: #334155; }
            .p-mark { color: #16a34a; font-weight: bold; background-color: #f0fdf4; }
            .f-mark { color: #dc2626; opacity: 0.6; }
            .tot-col { font-weight: bold; background-color: #f8fafc; }
            tr:nth-child(even) { background-color: #fafafa; }
          </style>
        </head>
        <body>
          <h1>Relatório Geral de Frequência</h1>
          <div class="meta">
            Período: ${reportRange.start ? escapeHtml(formatDate(reportRange.start)) : 'Início'} até ${reportRange.end ? escapeHtml(formatDate(reportRange.end)) : 'Fim'}
            • Total de Aulas: ${filteredClasses.length}
            • Total de Alunos: ${sortedStudents.length}
          </div>
          
          <table>
            <thead>
              <tr>
                <th class="num-col">#</th>
                <th class="name-col">Aluno</th>
                ${filteredClasses.map(c => `<th>${escapeHtml(formatShortDate(c.date))}</th>`).join('')}
                <th class="tot-col">Total P</th>
              </tr>
            </thead>
            <tbody>
              ${sortedStudents.map((student, index) => {
                let totalPresence = 0;
                const cells = filteredClasses.map(c => {
                  const isPresent = Boolean(c.attendance[student.id]);
                  if (isPresent) totalPresence++;
                  return `<td class="${isPresent ? 'p-mark' : 'f-mark'}">${isPresent ? 'P' : 'F'}</td>`;
                }).join('');
                return `<tr>
                          <td class="num-col">${index + 1}</td>
                          <td class="name-col">${escapeHtml(student.name)}</td>
                          ${cells}
                          <td class="tot-col">${totalPresence}</td>
                        </tr>`;
              }).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) { 
      win.document.write(printContent); 
      win.document.close(); 
    }
  };

  // --- Impressão Lista de Cadastro ---
  const handlePrintStudentList = () => {
    const printContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Lista de Alunos Cadastrados</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; font-size: 13px; color: #1f2937; }
            h1 { color: #1d4ed8; text-align: center; margin-bottom: 4px; font-size: 20px; }
            .meta { text-align: center; color: #64748b; margin-bottom: 20px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #f1f5f9; color: #334155; font-weight: 600; }
            .num-col { width: 45px; text-align: center; }
            td.num-col { text-align: center; color: #64748b; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Lista de Cadastro de Alunos</h1>
          <div class="meta">Total de Alunos Cadastrados: ${sortedStudents.length}</div>
          
          <table>
            <thead>
              <tr>
                <th class="num-col">#</th>
                <th>Nome Completo</th>
                <th>Telefone / Contato</th>
              </tr>
            </thead>
            <tbody>
              ${sortedStudents.map((student, index) => `
                <tr>
                  <td class="num-col">${index + 1}</td>
                  <td>${escapeHtml(student.name)}</td>
                  <td>${student.phone ? escapeHtml(student.phone) : '<span style="color:#94a3b8">—</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) { 
      win.document.write(printContent); 
      win.document.close(); 
    }
  };

  // --- UI Helpers ---
  const NavButton = ({ 
    target, 
    icon: Icon, 
    label, 
    action 
  }: { 
    target: ViewType; 
    icon: React.ElementType; 
    label: string; 
    action?: () => void;
  }) => (
    <button 
      onClick={action ? action : () => setView(target)}
      className={`flex flex-col items-center justify-center p-2 w-full rounded-lg transition-colors ${
        view === target ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-500 hover:bg-gray-50'
      }`}
    >
      <Icon size={24} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  const totalClasses = classes.length;
  const totalStudents = students.length;
  const lastClass = classes.length > 0 ? classes[0] : null;

  const reportClasses = useMemo(() => {
    return classes
      .filter(c => (!reportRange.start || c.date >= reportRange.start) && (!reportRange.end || c.date <= reportRange.end))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [classes, reportRange]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-20 md:pb-0 relative">
      
      {/* --- NOTIFICAÇÃO FLUTUANTE (TOAST) --- */}
      {toast.isOpen && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-short transition-all">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle size={18} className="text-red-600 shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-600 shrink-0" />}
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, isOpen: false }))} 
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMAÇÃO ESTILIZADO (Substitui window.confirm) --- */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 transform transition-all animate-scaleUp">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${
                modalConfig.type === 'danger' 
                  ? 'bg-red-100 text-red-600' 
                  : modalConfig.type === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{modalConfig.title}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{modalConfig.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {modalConfig.cancelText || 'Cancelar'}
              </button>
              <button
                type="button"
                onClick={modalConfig.onConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                  modalConfig.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : modalConfig.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {modalConfig.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CABEÇALHO --- */}
      <header className="bg-blue-700 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <BookOpen size={24} />
            <h1 className="text-xl font-bold">Diário de Classe</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDemoData}
              className="bg-blue-800 hover:bg-blue-900 text-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-inner"
              title="Carregar turma modelo para demonstração comercial"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>Modo Demonstração</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">
        
        {/* --- DASHBOARD --- */}
        {view === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Banner comercial de Demonstração */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl shrink-0">
                  <Sparkles className="text-amber-300" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Turma Modelo de Demonstração Pronta</h3>
                  <p className="text-xs text-blue-100 mt-0.5">
                    Demonstre facilmente o sistema para clientes com alunos, aulas e frequências realistas já preenchidos.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={loadDemoData}
                  className="bg-white text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm w-full sm:w-auto text-center"
                >
                  Recarregar Demo
                </button>
                <button
                  onClick={clearAllData}
                  className="bg-blue-800/80 hover:bg-blue-900 text-blue-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors w-full sm:w-auto text-center"
                  title="Limpar para iniciar cadastro real"
                >
                  Limpar
                </button>
              </div>
            </div>

            {/* Contadores */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setView('students')}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-blue-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={20} />
                    <h3 className="font-semibold text-gray-700 text-sm">Alunos</h3>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{totalStudents}</p>
                <span className="text-xs text-gray-400 mt-1 block">cadastrados</span>
              </div>

              <div 
                onClick={() => setView('history')}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-green-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-green-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <h3 className="font-semibold text-gray-700 text-sm">Aulas</h3>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{totalClasses}</p>
                <span className="text-xs text-gray-400 mt-1 block">registradas</span>
              </div>
            </div>

            {/* Menu de Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Ações Rápidas</h2>
              </div>
              <div className="p-4 grid gap-3">
                <button 
                  onClick={startNewClass}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors shadow-sm"
                >
                  <Plus size={20} />
                  <span>Nova Chamada / Registrar Aula</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setView('students')}
                    className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 font-medium transition-colors"
                  >
                    <Users size={20} className="text-blue-600" />
                    <span className="text-sm">Gerenciar Alunos</span>
                  </button>
                  <button 
                    onClick={() => setView('report')}
                    className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 font-medium transition-colors"
                  >
                    <FileSpreadsheet size={20} className="text-emerald-600" />
                    <span className="text-sm">Relatórios e Frequência</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Box de Backup */}
            <div className="bg-blue-50/80 rounded-2xl shadow-sm border border-blue-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-sm text-blue-900 flex items-center gap-1.5">
                  <Download size={16} /> Backup dos Dados
                </h2>
                <span className="text-[11px] font-medium text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                  Formato JSON
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleExport} 
                  className="bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-2xs"
                >
                  <Download size={16} /> Baixar Cópia
                </button>
                <button 
                  onClick={handleImportClick} 
                  className="bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-2xs"
                >
                  <Upload size={16} /> Restaurar Backup
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Card da Última Aula */}
            {lastClass && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Última Aula Realizada</h3>
                  <span className="text-xs text-gray-500">{formatDate(lastClass.date)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{lastClass.topic}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Preletor: {lastClass.lecturer}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <UserCheck size={14} />
                    <span>{Object.values(lastClass.attendance || {}).filter(Boolean).length} Presentes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STUDENTS VIEW --- */}
        {view === 'students' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <Users className="text-blue-600" /> Cadastro de Alunos
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                    {sortedStudents.length} {sortedStudents.length === 1 ? 'aluno' : 'alunos'}
                  </span>
                  <button
                    onClick={loadDemoData}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                    title="Restaurar turma de demonstração"
                  >
                    <RotateCcw size={12} /> Turma Demo
                  </button>
                </div>
              </div>

              {/* Inclusão de Novo Aluno */}
              <div className="grid md:grid-cols-2 gap-2 mb-4 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <input 
                  type="text" 
                  placeholder="Nome completo do aluno..." 
                  className="bg-white border border-gray-300 rounded-lg p-2.5 text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                  value={newStudentName} 
                  onChange={(e) => setNewStudentName(e.target.value)} 
                />
                <div className="flex gap-2">
                  <input 
                    type="tel" 
                    placeholder="Telefone (opcional)..." 
                    className="bg-white border border-gray-300 rounded-lg p-2.5 text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                    value={newStudentPhone} 
                    onChange={(e) => setNewStudentPhone(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && addStudent()} 
                  />
                  <button 
                    onClick={addStudent} 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-xs"
                    title="Adicionar aluno"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Lista com Rolagem */}
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {sortedStudents.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 border border-dashed rounded-xl bg-gray-50 text-sm">
                    Nenhum aluno cadastrado ainda. Use o campo acima para adicionar ou clique em <strong>Turma Demo</strong>.
                  </div>
                ) : (
                  sortedStudents.map(student => (
                    <div 
                      key={student.id} 
                      className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3 hover:border-gray-300 transition-colors"
                    >
                      {editingId === student.id ? (
                        <div className="flex-1 w-full grid gap-2">
                          <input 
                            className="border border-blue-300 p-2 rounded-lg text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                            value={editForm.name} 
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                            placeholder="Nome..."
                          />
                          <input 
                            className="border border-gray-300 p-2 rounded-lg text-sm w-full focus:outline-hidden focus:ring-2 focus:ring-blue-500" 
                            value={editForm.phone} 
                            onChange={e => setEditForm({ ...editForm, phone: e.target.value })} 
                            placeholder="Telefone..."
                          />
                          <div className="flex gap-2 justify-end mt-1">
                             <button 
                               onClick={saveStudentEdit} 
                               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                             >
                               Salvar
                             </button>
                             <button 
                               onClick={() => setEditingId(null)} 
                               className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                             >
                               Cancelar
                             </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 text-center sm:text-left">
                            <span className="font-semibold text-gray-900 block">{student.name}</span>
                            {student.phone ? (
                              <div className="text-xs text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                                <Phone size={12} className="text-gray-400" /> {student.phone}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Sem telefone cadastrado</span>
                            )}
                          </div>
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => startEditingStudent(student)} 
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              title="Editar aluno"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => removeStudent(student.id, student.name)} 
                              className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Remover aluno"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- REPORT VIEW --- */}
        {view === 'report' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Relatório de Cadastro */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                   <Users className="text-blue-600" /> Lista de Alunos Cadastrados
                 </h2>
                 <span className="text-xs text-gray-500">{sortedStudents.length} alunos</span>
               </div>
               <p className="text-sm text-gray-500 mb-4">Gere uma lista limpa com nomes e telefones para conferência ou impressão.</p>
               <button 
                 onClick={handlePrintStudentList} 
                 className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-blue-200 transition-colors"
               >
                 <Printer size={18} /> Imprimir Lista de Alunos
               </button>
            </div>

            {/* Matriz Geral de Frequência */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-900">
                <FileSpreadsheet className="text-emerald-600" /> Relatório Geral de Frequência
              </h2>
              <p className="text-sm text-gray-500 mb-4">Filtre por período para visualizar a matriz de presença de cada aula registrada.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-5 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data Inicial</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={reportRange.start} 
                    onChange={e => setReportRange({ ...reportRange, start: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data Final</label>
                  <input 
                    type="date" 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={reportRange.end} 
                    onChange={e => setReportRange({ ...reportRange, end: e.target.value })} 
                  />
                </div>
              </div>

              {reportClasses.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
                  Nenhuma aula registrada dentro deste período.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto border border-gray-200 rounded-xl mb-4">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="p-2.5 text-center border-b w-10 font-bold">#</th>
                          <th className="p-2.5 text-left sticky left-0 bg-gray-50 border-b font-bold min-w-[140px]">Aluno</th>
                          {reportClasses.map(c => (
                            <th key={c.id} className="p-2.5 text-center border-b min-w-[60px] text-xs font-semibold">
                              {formatShortDate(c.date)}
                            </th>
                          ))}
                          <th className="p-2.5 text-center border-b bg-gray-100 font-bold min-w-[60px]">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedStudents.map((student, index) => {
                          let totalP = 0;
                          return (
                            <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                              <td className="p-2.5 text-center text-gray-400 text-xs">{index + 1}</td>
                              <td className="p-2.5 sticky left-0 bg-white font-medium text-gray-900 border-r border-gray-100">
                                {student.name}
                              </td>
                              {reportClasses.map(c => {
                                const isPresent = Boolean(c.attendance[student.id]);
                                if (isPresent) totalP++;
                                return (
                                  <td 
                                    key={c.id} 
                                    className={`p-2.5 text-center font-bold text-xs ${
                                      isPresent ? 'text-emerald-600 bg-emerald-50/40' : 'text-red-400 opacity-60'
                                    }`}
                                  >
                                    {isPresent ? 'P' : 'F'}
                                  </td>
                                );
                              })}
                              <td className="p-2.5 text-center font-bold text-blue-700 bg-blue-50/50">
                                {totalP}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button 
                    onClick={handlePrintReport} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Printer size={20} /> Imprimir Relatório Completo (Paisagem)
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* --- REGISTER VIEW --- */}
        {view === 'register' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Informações da Aula */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <FileText className="text-blue-600" /> {editingClass ? 'Editar Registro de Aula' : 'Nova Chamada / Aula'}
                </h2>
                {editingClass && (
                  <button 
                    onClick={cancelClassEdit} 
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ArrowLeft size={14} /> Voltar ao Histórico
                  </button>
                )}
              </div>
              <div className="grid gap-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Data da Aula</label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={classForm.date} 
                    onChange={e => setClassForm({ ...classForm, date: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Tema da Aula</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={classForm.topic} 
                    onChange={e => setClassForm({ ...classForm, topic: e.target.value })} 
                    placeholder="Ex: Introdução à Matemática Financeira" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Preletor / Professor</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={classForm.lecturer} 
                    onChange={e => setClassForm({ ...classForm, lecturer: e.target.value })} 
                    placeholder="Nome do professor ou palestrante" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Materiais / Referências</label>
                  <textarea 
                    rows={2} 
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" 
                    value={classForm.texts} 
                    onChange={e => setClassForm({ ...classForm, texts: e.target.value })} 
                    placeholder="Livros, páginas, links ou notas de apoio..." 
                  />
                </div>
              </div>
            </div>

            {/* Grade de Chamada */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                  <UserCheck className="text-blue-600" /> Lista de Chamada
                </h2>
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {Object.values(classForm.attendance).filter(Boolean).length} de {sortedStudents.length} presentes
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">Clique no aluno para alternar entre presença e falta.</p>

              <div className="space-y-2">
                {sortedStudents.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
                    Nenhum aluno cadastrado. Cadastre alunos antes de realizar a chamada.
                  </div>
                ) : (
                  sortedStudents.map(student => {
                    const isPresent = Boolean(classForm.attendance[student.id]);
                    return (
                      <div 
                        key={student.id} 
                        onClick={() => toggleAttendance(student.id)} 
                        className={`flex justify-between items-center p-3.5 rounded-xl cursor-pointer border transition-all select-none ${
                          isPresent 
                            ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs' 
                            : 'bg-red-50/60 border-red-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className={`font-semibold text-sm ${isPresent ? 'text-emerald-950' : 'text-red-950'}`}>
                          {student.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase ${isPresent ? 'text-emerald-700' : 'text-red-600'}`}>
                            {isPresent ? 'Presente' : 'Falta'}
                          </span>
                          {isPresent ? (
                            <CheckCircle className="text-emerald-600" size={22} />
                          ) : (
                            <XCircle className="text-red-500" size={22} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="flex gap-2 mb-8">
              <button 
                onClick={saveClass} 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 text-base transition-all hover:shadow-lg"
              >
                <Save size={22} /> {editingClass ? 'Atualizar Registro da Aula' : 'Salvar Diário de Aula'}
              </button>
            </div>
          </div>
        )}

        {/* --- HISTORY VIEW --- */}
        {view === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-xl flex items-center gap-2 text-gray-900">
                <History className="text-blue-600" /> Histórico de Aulas
              </h2>
              <button 
                onClick={startNewClass} 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Plus size={16} /> Nova Aula
              </button>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500 text-sm">
                Nenhuma aula registrada até o momento.
              </div>
            ) : (
              classes.map(cls => (
                <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50/90 p-3.5 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-900">{formatDate(cls.date)}</span>
                      <span className="text-gray-500 text-xs ml-2">• Prof: {cls.lecturer}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => startEditingClass(cls)} 
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar aula"
                      >
                        <Edit size={17} />
                      </button>
                      <button 
                        onClick={() => deleteClass(cls.id, cls.topic)} 
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir aula"
                      >
                        <Trash2 size={17} />
                      </button>
                      <button 
                        onClick={() => handlePrint(cls)} 
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Imprimir diário desta aula"
                      >
                        <Printer size={17} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-blue-700">{cls.topic}</h3>
                    {cls.texts && (
                      <p className="text-xs text-gray-600 mt-1 italic">
                        {cls.texts}
                      </p>
                    )}
                    
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-xs font-semibold text-gray-600 select-none">
                          <span className="flex items-center gap-1.5">
                            <ChevronRight className="group-open:rotate-90 transition-transform text-gray-400" size={16} /> 
                            Ver Detalhes da Presença
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 text-[11px]">
                            {Object.values(cls.attendance || {}).filter(Boolean).length} presentes
                          </span>
                        </summary>
                        <div className="mt-3 grid grid-cols-2 gap-2 pt-1 border-t border-dashed border-gray-100">
                          {sortedStudents.map(student => (
                            <div key={student.id} className="flex items-center gap-2 text-xs py-0.5">
                              {cls.attendance?.[student.id] ? (
                                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                              ) : (
                                <XCircle size={14} className="text-red-400 shrink-0" />
                              )}
                              <span className={cls.attendance?.[student.id] ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                                {student.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Navegação Inferior para Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around p-2 md:hidden shadow-lg z-20">
        <NavButton target="dashboard" icon={LayoutDashboard} label="Início" />
        <NavButton target="register" icon={Plus} label="Aula" action={startNewClass} />
        <NavButton target="history" icon={History} label="Histórico" />
      </nav>
    </div>
  );
}