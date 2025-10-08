import * as React from 'react';
import { mockCareers, courseData, mockStudents, mockSubjectDetails } from '../data';
import { Student } from '../types';
import { ArrowDownTrayIcon, DocumentTextIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '../components/Icons';
import { getFullAttendanceStore, isRegisterClosed } from '../store';

// To prevent TypeScript errors for CDN-loaded libraries
declare const jspdf: any;
declare const XLSX: any;

// --- Helper Types ---
type AttendanceStatus = 'P' | 'A' | 'T' | 'J';
type AttendanceData = {
    [studentId: number]: {
        [date: string]: AttendanceStatus;
    };
};

interface SubjectPreviewData {
    subject: string;
    students: Student[];
    dates: Date[];
    attendance: AttendanceData;
}

interface GroupedPreviewData {
    career: string;
    year: string;
    subjectPreviews: SubjectPreviewData[];
}


// --- Helper Functions ---
const getAttendanceData = (students: Student[], startDate: Date, endDate: Date, subject: string): { students: Student[]; dates: Date[]; attendance: AttendanceData } => {
    const fullStore = getFullAttendanceStore();

    const dates: Date[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() > 0 && d.getDay() < 6) { // Only weekdays
            dates.push(new Date(d));
        }
    }

    const attendance: AttendanceData = {};
    const fallbackStatuses: AttendanceStatus[] = ['P', 'P', 'P', 'P', 'P', 'P', 'A', 'J', 'T'];

    students.forEach(student => {
        attendance[student.id] = {};
        dates.forEach(date => {
            const dateString = date.toISOString().split('T')[0];
            const registerIsClosed = isRegisterClosed(dateString, subject);

            if (registerIsClosed) {
                const storedStatus = fullStore[dateString]?.[subject]?.[student.id];
                if (storedStatus && storedStatus !== 'UNMARKED') {
                    attendance[student.id][dateString] = storedStatus as 'P' | 'A' | 'T' | 'J';
                } else {
                    // If register is closed but a student is unmarked (or not in the list), they are considered absent.
                    attendance[student.id][dateString] = 'A';
                }
            } else {
                // If register is not closed, use simulated data
                attendance[student.id][dateString] = fallbackStatuses[Math.floor(Math.random() * fallbackStatuses.length)];
            }
        });
    });

    return { students, dates, attendance };
};

const formatDate = (date: Date) => date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit' });

// --- CheckboxGroup Component ---
const CheckboxGroup: React.FC<{
    title: string;
    options: string[];
    selected: string[];
    onToggle: (option: string) => void;
    onToggleAll: () => void;
    allSelected: boolean;
}> = ({ title, options, selected, onToggle, onToggleAll, allSelected }) => (
    <div className="bg-slate-50 p-4 rounded-lg">
        <div className="flex justify-between items-baseline mb-3">
             <h3 className="text-base font-semibold text-slate-700">{title}</h3>
            <button onClick={onToggleAll} className="text-xs font-semibold text-indigo-600 hover:underline">
                {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
            </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 max-h-48 overflow-y-auto pr-2">
            {options.map(option => (
                <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selected.includes(option)}
                        onChange={() => onToggle(option)}
                        className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center transition-colors peer-checked:bg-indigo-600 peer-checked:border-indigo-600">
                        <CheckIcon className="w-3 h-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-slate-700 select-none">{option}</span>
                </label>
            ))}
        </div>
    </div>
);

// --- Preview Components ---
const AttendanceBadge: React.FC<{ status: AttendanceStatus }> = ({ status }) => {
    const styles: { [key in AttendanceStatus]: string } = {
        P: 'bg-green-100 text-green-800',
        A: 'bg-red-100 text-red-800',
        T: 'bg-amber-100 text-amber-800',
        J: 'bg-indigo-100 text-indigo-800',
    };
    if (!status || !styles[status]) {
        return <span className="flex items-center justify-center h-6 w-6 text-slate-400">-</span>;
    }
    return (
        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${styles[status]}`}>
            {status}
        </span>
    );
};

const GroupedReportPreview: React.FC<{ data: GroupedPreviewData; totalSelectedSubjects: number }> = ({ data, totalSelectedSubjects }) => {
    const { career, year, subjectPreviews } = data;
    return (
        <div>
            <p className="text-sm text-slate-500 mt-1">
                Mostrando vista previa para: <span className="font-semibold">{career} - {year}</span>.
            </p>
            {totalSelectedSubjects > 1 && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-md mt-2 border border-amber-200">
                    Nota: La exportación incluirá las <strong>{totalSelectedSubjects}</strong> materias seleccionadas.
                </p>
            )}
            <div className="mt-4 space-y-6">
                {subjectPreviews.map((preview) => (
                    <div key={preview.subject}>
                         <h4 className="text-md font-semibold text-slate-800 mb-2">{preview.subject}</h4>
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                            <table className="w-full min-w-[600px] text-sm text-left">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 sticky left-0 bg-slate-100">Estudiante</th>
                                        {preview.dates.map(date => <th scope="col" key={date.toISOString()} className="px-4 py-3 text-center">{formatDate(date)}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {preview.students.map(student => (
                                        <tr key={student.id} className="bg-white hover:bg-slate-50">
                                            <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-inherit">{student.lastName}, {student.name}</td>
                                            {preview.dates.map(date => {
                                                const status = preview.attendance[student.id]?.[date.toISOString().split('T')[0]];
                                                return <td key={date.toISOString()} className="px-4 py-2 text-center"><AttendanceBadge status={status} /></td>;
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main ReportsScreen ---
const ReportsScreen: React.FC = () => {
    const [selectedCareers, setSelectedCareers] = React.useState<string[]>([]);
    const [selectedYears, setSelectedYears] = React.useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
    const [allPreviews, setAllPreviews] = React.useState<GroupedPreviewData[]>([]);
    const [previewIndex, setPreviewIndex] = React.useState(0);
    
    const [dateRangeType, setDateRangeType] = React.useState('monthly');
    const [customStart, setCustomStart] = React.useState('');
    const [customEnd, setCustomEnd] = React.useState('');

    const startDateRef = React.useRef<HTMLInputElement>(null);
    const endDateRef = React.useRef<HTMLInputElement>(null);

    const handleDateIconClick = (ref: React.RefObject<HTMLInputElement>) => {
        if (ref.current) {
            try {
                ref.current.showPicker();
            } catch (error) {
                // For browsers that don't support showPicker(), focus the input.
                // Clicking the input itself will open the picker.
                ref.current.focus();
            }
        }
    };

    const getPeriod = (): { startDate: Date; endDate: Date; periodLabel: string } | null => {
        let startDate = new Date();
        let endDate = new Date();
        let periodLabel = '';
        const now = new Date();

        switch (dateRangeType) {
            case 'weekly':
                const firstDayOfWeek = now.getDate() - now.getDay() + 1;
                startDate = new Date(now.setDate(firstDayOfWeek));
                endDate = new Date(new Date().setDate(firstDayOfWeek + 4));
                periodLabel = `Semana del ${startDate.toLocaleDateString('es-ES')} al ${endDate.toLocaleDateString('es-ES')}`;
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                periodLabel = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                break;
            case 'custom':
                if (!customStart || !customEnd) return null;
                startDate = new Date(customStart + 'T00:00:00');
                endDate = new Date(customEnd + 'T00:00:00');
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;
                periodLabel = `del ${startDate.toLocaleDateString('es-ES')} al ${endDate.toLocaleDateString('es-ES')}`;
                break;
        }
        return { startDate, endDate, periodLabel };
    };

    // --- Derived Memoized Values ---
    const availableYears = React.useMemo(() => {
        if (selectedCareers.length === 0) return [];
        const years = new Set<string>();
        selectedCareers.forEach(career => {
            Object.keys(courseData[career as keyof typeof courseData] || {}).forEach(year => years.add(year));
        });
        return Array.from(years).sort();
    }, [selectedCareers]);

    const availableSubjects = React.useMemo(() => {
        if (selectedCareers.length === 0 || selectedYears.length === 0) return [];
        const subjects = new Set<string>();
        selectedCareers.forEach(career => {
            selectedYears.forEach(year => {
                (courseData[career as keyof typeof courseData]?.[year] || []).forEach(subject => subjects.add(subject));
            });
        });
        return Array.from(subjects).sort();
    }, [selectedCareers, selectedYears]);
    
    // --- Export & Preview Logic ---
    const getReportTasks = () => {
        return selectedCareers.flatMap(career =>
            selectedYears.flatMap(year => {
                const subjectsForYear = courseData[career as keyof typeof courseData]?.[year] || [];
                const relevantSubjects = subjectsForYear.filter(s => selectedSubjects.includes(s));
                return relevantSubjects.map(subject => ({ career, year, subject }));
            })
        );
    };

    React.useEffect(() => {
        const period = getPeriod();
        const tasks = getReportTasks();

        if (tasks.length === 0 || !period) {
            setAllPreviews([]);
            return;
        }

        const groupedTasks: { [key: string]: { career: string; year: string; subjects: string[] } } = {};
        tasks.forEach(task => {
            const key = `${task.career}|${task.year}`;
            if (!groupedTasks[key]) {
                groupedTasks[key] = { career: task.career, year: task.year, subjects: [] };
            }
            groupedTasks[key].subjects.push(task.subject);
        });

        const generatedPreviews: GroupedPreviewData[] = Object.values(groupedTasks).map(group => {
            const subjectPreviews: SubjectPreviewData[] = group.subjects.map(subject => {
                const studentsForPreview = mockStudents.filter(s => s.carrera === group.career);
                const attendanceSheet = getAttendanceData(studentsForPreview, period.startDate, period.endDate, subject);
                return {
                    subject: subject,
                    ...attendanceSheet,
                };
            });
            return {
                career: group.career,
                year: group.year,
                subjectPreviews: subjectPreviews,
            };
        });

        setAllPreviews(generatedPreviews);
        setPreviewIndex(0);

    }, [selectedCareers, selectedYears, selectedSubjects, dateRangeType, customStart, customEnd]);


    // --- State Toggle Functions ---
    const handleToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, option: string) => {
        setter(prev => prev.includes(option) ? prev.filter(item => item !== option) : [...prev, option]);
    };
    
    const handleToggleAll = (setter: React.Dispatch<React.SetStateAction<string[]>>, options: string[], selected: string[]) => {
        if (selected.length === options.length) {
            setter([]);
        } else {
            setter(options);
        }
    };

    // --- Export Handlers ---
    const handleExportPDF = () => {
        const period = getPeriod();
        if (!period) return;
        const tasks = getReportTasks();

        const doc = new jspdf.jsPDF('landscape');
        
        tasks.forEach(({ career, year, subject }, index) => {
            if (index > 0) doc.addPage();
            
            const students = mockStudents.filter(s => s.carrera === career);
            const data = getAttendanceData(students, period.startDate, period.endDate, subject);
            const teacher = Object.values(mockSubjectDetails).find(s => s.name === subject)?.professor || 'N/A';
            const tableHeaders = ['N.º', 'Apellido y Nombre', ...data.dates.map(formatDate), 'Asist.', 'Inasist.'];
            const tableBody = data.students.map((student, idx) => {
                const row = data.attendance[student.id] || {};
                const present = Object.values(row).filter(s => s === 'P' || s === 'J').length;
                const absent = Object.values(row).filter(s => s === 'A').length;
                return [idx + 1, `${student.lastName}, ${student.name}`, ...data.dates.map(d => row[d.toISOString().split('T')[0]] || ''), present, absent];
            });

            doc.setFontSize(16); doc.text(`Planilla de Asistencia`, 14, 22);
            doc.setFontSize(10);
            doc.text(`Carrera: ${career}`, 14, 30); doc.text(`Año: ${year}`, 100, 30);
            doc.text(`Materia: ${subject}`, 14, 35); doc.text(`Docente: ${teacher}`, 100, 35);
            doc.text(`Período: ${period.periodLabel}`, 14, 40);

            (doc as any).autoTable({
                startY: 45, head: [tableHeaders], body: tableBody, theme: 'grid',
                headStyles: { fillColor: [67, 56, 202], textColor: 255 }, styles: { fontSize: 8, cellPadding: 1.5 },
                columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 40 } }
            });
        });
        
        doc.save(`Reporte_Asistencia.pdf`);
    };

    const handleExportExcel = () => {
        const period = getPeriod();
        if (!period) return;
        const tasks = getReportTasks();
        
        const wb = XLSX.utils.book_new();
        
        tasks.forEach(({ career, year, subject }) => {
            const students = mockStudents.filter(s => s.carrera === career);
            const data = getAttendanceData(students, period.startDate, period.endDate, subject);
            const teacher = Object.values(mockSubjectDetails).find(s => s.name === subject)?.professor || 'N/A';

            const header = [
                [`Planilla de Asistencia - Carrera: ${career}`],
                [`Materia: ${subject} - Año: ${year}`],
                [`Docente: ${teacher} - Período: ${period.periodLabel}`],
                [],
            ];
            const tableHeaders = ['N.º', 'Apellido y Nombre', ...data.dates.map(formatDate), 'Asist.', 'Inasist.'];
            const tableBody = data.students.map((student, idx) => {
                const row = data.attendance[student.id] || {};
                const present = Object.values(row).filter(s => s === 'P' || s === 'J').length;
                const absent = Object.values(row).filter(s => s === 'A').length;
                return [idx + 1, `${student.lastName}, ${student.name}`, ...data.dates.map(d => row[d.toISOString().split('T')[0]] || ''), present, absent];
            });
            
            const ws = XLSX.utils.aoa_to_sheet([...header, tableHeaders, ...tableBody]);
            const sheetName = `${career.substring(0,5)}-${year.substring(0,2)}-${subject.substring(0,10)}`.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 31);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });
        
        XLSX.writeFile(wb, "Reporte_Asistencia_Multi.xlsx");
    };

    const handlePrevPreview = () => {
        setPreviewIndex(prev => (prev === 0 ? allPreviews.length - 1 : prev - 1));
    };

    const handleNextPreview = () => {
        setPreviewIndex(prev => (prev === allPreviews.length - 1 ? 0 : prev + 1));
    };
    
    const isExportDisabled = selectedSubjects.length === 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-800 p-6 rounded-lg shadow-md text-white flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <DocumentTextIcon className="w-8 h-8"/>
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Ver Reportes</h2>
                    <p className="text-indigo-100 mt-1">Selecciona los filtros para generar una vista previa y exportar las planillas.</p>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-6">
                <CheckboxGroup title="1. Selecciona las Carreras" options={mockCareers} selected={selectedCareers} onToggle={(opt) => handleToggle(setSelectedCareers, opt)} onToggleAll={() => handleToggleAll(setSelectedCareers, mockCareers, selectedCareers)} allSelected={selectedCareers.length === mockCareers.length} />
                
                {selectedCareers.length > 0 && <CheckboxGroup title="2. Selecciona los Años" options={availableYears} selected={selectedYears} onToggle={(opt) => handleToggle(setSelectedYears, opt)} onToggleAll={() => handleToggleAll(setSelectedYears, availableYears, selectedYears)} allSelected={selectedYears.length === availableYears.length} />}
                
                {selectedYears.length > 0 && <CheckboxGroup title="3. Selecciona las Materias" options={availableSubjects} selected={selectedSubjects} onToggle={(opt) => handleToggle(setSelectedSubjects, opt)} onToggleAll={() => handleToggleAll(setSelectedSubjects, availableSubjects, selectedSubjects)} allSelected={selectedSubjects.length === availableSubjects.length} />}

                <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="text-base font-semibold text-slate-700 mb-3">4. Selecciona el Período</h3>
                    <div className="flex space-x-2 bg-slate-200 p-1 rounded-full">
                        <button onClick={() => setDateRangeType('weekly')} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-full transition-all duration-200 ${dateRangeType === 'weekly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Semanal</button>
                        <button onClick={() => setDateRangeType('monthly')} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-full transition-all duration-200 ${dateRangeType === 'monthly' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Mensual</button>
                        <button onClick={() => setDateRangeType('custom')} className={`flex-1 py-2 px-3 text-sm font-semibold rounded-full transition-all duration-200 ${dateRangeType === 'custom' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:bg-slate-300'}`}>Personalizado</button>
                    </div>
                    {dateRangeType === 'custom' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-slate-600 mb-1">Desde</label>
                                <div className="relative">
                                    <input
                                        ref={startDateRef}
                                        type="date"
                                        id="start-date"
                                        value={customStart}
                                        onChange={e => setCustomStart(e.target.value)}
                                        className="w-full p-2 pr-10 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button type="button" onClick={() => handleDateIconClick(startDateRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de inicio">
                                        <CalendarDaysIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-slate-600 mb-1">Hasta</label>
                                <div className="relative">
                                    <input
                                        ref={endDateRef}
                                        type="date"
                                        id="end-date"
                                        value={customEnd}
                                        onChange={e => setCustomEnd(e.target.value)}
                                        className="w-full p-2 pr-10 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                     <button type="button" onClick={() => handleDateIconClick(endDateRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de fin">
                                        <CalendarDaysIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {allPreviews.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-slate-800">Vista Previa del Reporte</h3>
                        {allPreviews.length > 1 && (
                            <div className="flex items-center space-x-2">
                                <button onClick={handlePrevPreview} className="p-2 rounded-full hover:bg-slate-100" aria-label="Anterior">
                                    <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
                                </button>
                                <span className="text-sm font-medium text-slate-500">{previewIndex + 1} / {allPreviews.length}</span>
                                <button onClick={handleNextPreview} className="p-2 rounded-full hover:bg-slate-100" aria-label="Siguiente">
                                    <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        )}
                    </div>
                    <GroupedReportPreview data={allPreviews[previewIndex]} totalSelectedSubjects={selectedSubjects.length} />
                </div>
            )}
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-4">
                 <h3 className="text-base font-semibold text-slate-700">5. Opciones de Exportación</h3>
                 <div className="flex flex-col items-stretch space-y-3">
                    <button onClick={handleExportPDF} disabled={isExportDisabled} className="flex items-center justify-center space-x-2 w-full font-bold py-3 px-4 rounded-lg transition-colors enabled:bg-indigo-800 enabled:text-white enabled:hover:bg-indigo-900 disabled:bg-transparent disabled:text-indigo-800 disabled:border disabled:border-indigo-800 disabled:cursor-not-allowed">
                        <ArrowDownTrayIcon className="w-5 h-5"/><span>Exportar a PDF</span>
                    </button>
                    <button onClick={handleExportExcel} disabled={isExportDisabled} className="flex items-center justify-center space-x-2 w-full font-bold py-3 px-4 rounded-lg transition-colors enabled:bg-indigo-800 enabled:text-white enabled:hover:bg-indigo-900 disabled:bg-transparent disabled:text-indigo-800 disabled:border disabled:border-indigo-800 disabled:cursor-not-allowed">
                        <ArrowDownTrayIcon className="w-5 h-5"/><span>Exportar a Excel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen;