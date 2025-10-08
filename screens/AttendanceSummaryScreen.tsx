

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockYears, mockStudents, mockCareers, courseData } from '../data';
import { LateStudent, AttendanceStatus } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, QrCodeIcon, DocumentChartBarIcon, CheckIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon, CalendarIcon } from '../components/Icons';
import { getTodayAttendanceForSubject, setTodayAttendanceForSubject, getTodayLateReasonsForSubject, deleteTodayLateReasonForStudent } from '../store';

// State when no course/subject is selected
const InitialStatePrompt = ({ className }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5 text-slate-300">
            <path d="M19 11V5.70711C19 5.15482 18.5523 4.70711 18 4.70711H5C4.44772 4.70711 4 5.15482 4 5.70711V18.2929C4 18.8452 4.44772 19.2929 5 19.2929H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 10H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8.5 14H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 20L18 22L22 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-xl font-bold text-slate-700">Selecciona un curso para empezar</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
            Usa los filtros de arriba para elegir una carrera, año y materia. Podrás ver el resumen de asistencia del día en tiempo real.
        </p>
    </div>
);

// State when course is selected but no attendance has been taken
const NoDataStatePrompt = ({ className }: { className?: string }) => (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-5 text-slate-300">
            <path d="M14.5 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7.5L14.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-xl font-bold text-slate-700">Aún no se ha tomado asistencia</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
            Usa el botón "Tomar asistencia" para empezar. Los resultados aparecerán aquí en tiempo real.
        </p>
    </div>
);


const StatItem = ({ label, value, color }: { label: string, value: number, color:string }) => (
    <div className="flex items-center space-x-2 sm:space-x-3">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <div className="flex items-baseline">
            <p className="text-lg sm:text-xl font-bold text-slate-800 mr-1 sm:mr-2">{value}</p>
            <p className="text-xs sm:text-sm text-slate-500">{label}</p>
        </div>
    </div>
);

const PieChart = ({ present, absent, late, justified, className }: { present: number, absent: number, late: number, justified: number, className?: string }) => {
    const total = present + absent + late + justified;
    if (total === 0) { // Should not happen with new logic but good as a fallback
        return <div className={className}></div>;
    }
    const circumference = 2 * Math.PI * 45; // radius = 45px for a 100x100 viewBox

    const presentStroke = (present / total) * circumference;
    const absentStroke = (absent / total) * circumference;
    const lateStroke = (late / total) * circumference;
    const justifiedStroke = (justified / total) * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
             <svg width="100%" height="100%" viewBox="0 0 100 100" className="-rotate-90">
                {/* Track */}
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" className="stroke-slate-200" />
                
                {/* Present */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-green-500"
                    strokeDasharray={`${presentStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={0}
                />
                 {/* Absent */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-red-500"
                    strokeDasharray={`${absentStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={-presentStroke}
                />
                 {/* Late */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-amber-500"
                    strokeDasharray={`${lateStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={-(presentStroke + absentStroke)}
                />
                {/* Justified */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-indigo-500"
                    strokeDasharray={`${justifiedStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={-(presentStroke + absentStroke + lateStroke)}
                />
            </svg>
        </div>
    );
};

const LateArrivalsInbox: React.FC<{
  students: LateStudent[];
  onResolve: (studentId: number, status: 'present' | 'absent') => void;
}> = ({ students, onResolve }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="w-full lg:w-5/12 rounded-lg flex flex-col order-2 lg:order-1 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={window.innerWidth >= 1024}
        className="flex justify-between items-center p-3 rounded-t-lg bg-custom-gold text-amber-900 w-full text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-bold">Llegadas Tarde</h3>
        <span className="p-1 rounded-full hover:bg-black/10 lg:hidden">
          {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] lg:max-h-full' : 'max-h-0'
        } lg:block lg:max-h-full`}
      >
        <div className="bg-white p-4 border border-slate-200 rounded-b-lg border-t-0">
            {students.length > 0 ? (
            <div className="divide-y divide-slate-200 overflow-y-auto max-h-80 pr-2">
                {students.map(student => (
                <div key={student.id} className="py-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-semibold text-slate-700">{student.lastName}, {student.name}</p>
                            <p className="text-sm text-slate-500 mt-1">"{student.reason}"</p>
                        </div>
                        <div className="flex space-x-2 flex-shrink-0">
                            <button onClick={() => onResolve(student.id, 'present')} className="p-2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition-colors" aria-label="Marcar Presente">
                                <CheckIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => onResolve(student.id, 'absent')} className="p-2 bg-white text-indigo-700 border border-indigo-700 rounded-full hover:bg-indigo-50 transition-colors" aria-label="Marcar Ausente">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <div className="flex items-center justify-center text-center text-sm text-slate-500 py-4">
                <p>No hay estudiantes marcados como "Tarde" en este momento.</p>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};


const AttendanceSummaryScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentCareerIndex, setCurrentCareerIndex] = React.useState(0);

    const [selectedYear, setSelectedYear] = React.useState('');
    const [selectedSubject, setSelectedSubject] = React.useState('');

    const availableYears = React.useMemo(() => {
        const career = mockCareers[currentCareerIndex];
        return Object.keys(courseData[career as keyof typeof courseData] || {});
    }, [currentCareerIndex]);

    const availableSubjects = React.useMemo(() => {
        const career = mockCareers[currentCareerIndex];
        if (!selectedYear) return [];
        return courseData[career as keyof typeof courseData]?.[selectedYear] || [];
    }, [currentCareerIndex, selectedYear]);
    
    const [lateStudents, setLateStudents] = React.useState<LateStudent[]>([]);
    const [attendanceStats, setAttendanceStats] = React.useState({ present: 0, absent: 0, late: 0, justified: 0 });

    React.useEffect(() => {
        if (!selectedSubject) {
            setAttendanceStats({ present: 0, absent: 0, late: 0, justified: 0 });
            setLateStudents([]);
            return;
        }

        const currentCareer = mockCareers[currentCareerIndex];
        const studentsInCareer = mockStudents.filter(s => s.carrera === currentCareer);
        const todaysAttendance = getTodayAttendanceForSubject(selectedSubject);
        const todaysLateReasons = getTodayLateReasonsForSubject(selectedSubject);

        if (todaysAttendance) {
            let presentCount = 0;
            let absentCount = 0;
            let lateCount = 0;
            let justifiedCount = 0;
            const lateStudentsList: LateStudent[] = [];

            studentsInCareer.forEach(student => {
                const status = todaysAttendance[student.id];
                switch (status) {
                    case AttendanceStatus.PRESENT:
                        presentCount++;
                        break;
                    case AttendanceStatus.ABSENT:
                        absentCount++;
                        break;
                    case AttendanceStatus.LATE:
                        lateCount++;
                        lateStudentsList.push({
                            id: student.id,
                            name: student.name,
                            lastName: student.lastName,
                            reason: todaysLateReasons?.[student.id] || 'Motivo no especificado.'
                        });
                        break;
                    case AttendanceStatus.JUSTIFIED:
                        justifiedCount++;
                        break;
                }
            });
            setAttendanceStats({ present: presentCount, absent: absentCount, late: lateCount, justified: justifiedCount });
            setLateStudents(lateStudentsList);
        } else {
            setAttendanceStats({ present: 0, absent: 0, late: 0, justified: 0 });
            setLateStudents([]);
        }

    }, [currentCareerIndex, selectedYear, selectedSubject]);

    const handleCareerChange = (direction: 'next' | 'prev') => {
        const change = direction === 'next' ? 1 : -1;
        setCurrentCareerIndex(prev => (prev + change + mockCareers.length) % mockCareers.length);
        setSelectedYear('');
        setSelectedSubject('');
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
        setSelectedSubject('');
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };

    const handleTakeAttendance = () => {
        const career = mockCareers[currentCareerIndex];
        navigate('/tomar-asistencia', { state: { career } });
    };

    const handleResolveLateStatus = (studentId: number, status: 'present' | 'absent') => {
        if (!selectedSubject) return;

        const newStatus = status === 'present' ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT;
        
        setTodayAttendanceForSubject(selectedSubject, { [studentId]: newStatus });
        deleteTodayLateReasonForStudent(selectedSubject, studentId);

        setLateStudents(prev => prev.filter(student => student.id !== studentId));
        setAttendanceStats(prev => ({
            ...prev,
            late: prev.late - 1,
            present: status === 'present' ? prev.present + 1 : prev.present,
            absent: status === 'absent' ? prev.absent + 1 : prev.absent,
        }));
    };

    const isSelectionMissing = !selectedYear || !selectedSubject;
    const noDataForSelection = !isSelectionMissing && (attendanceStats.present + attendanceStats.absent + attendanceStats.late + attendanceStats.justified === 0);
    const chartClassName = "w-[140px] h-[140px] lg:w-[220px] lg:h-[220px]";

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm flex flex-col space-y-6">
                {/* Filters Section */}
                <div className="flex-shrink-0">
                     <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                        <button onClick={() => handleCareerChange('prev')} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
                        </button>
                        <h3 className="text-lg font-bold text-indigo-800 text-center flex-1">{mockCareers[currentCareerIndex]}</h3>
                        <button onClick={() => handleCareerChange('next')} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                            <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                     <div className="flex space-x-2 mt-4">
                        <div className="flex-1">
                            <label htmlFor="year" className="sr-only">Año</label>
                            <select id="year" value={selectedYear} onChange={handleYearChange} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                <option value="">Seleccione un año</option>
                                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="subject" className="sr-only">Materia</label>
                            <select id="subject" value={selectedSubject} onChange={handleSubjectChange} disabled={!selectedYear} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed">
                                <option value="">Seleccione una materia</option>
                                {availableSubjects.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                
                <hr className="border-slate-100"/>
                
                {isSelectionMissing ? (
                    <InitialStatePrompt className="min-h-[400px] flex-grow"/>
                ) : noDataForSelection ? (
                    <NoDataStatePrompt className="min-h-[400px] flex-grow"/>
                ) : (
                    <div className="flex-grow flex flex-col lg:flex-row items-stretch gap-6">
                        <div className="w-full lg:w-7/12 flex flex-col items-center justify-center text-center p-4 order-1 lg:order-2">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Resumen de hoy</h2>
                            <div className="flex flex-row items-center justify-center gap-6 md:gap-12">
                                <PieChart 
                                    present={attendanceStats.present} 
                                    absent={attendanceStats.absent} 
                                    late={attendanceStats.late}
                                    justified={attendanceStats.justified}
                                    className={chartClassName}
                                />
                                <div className="space-y-3 text-left">
                                    <StatItem label="Presentes" value={attendanceStats.present} color="bg-green-500" />
                                    <StatItem label="Ausentes" value={attendanceStats.absent} color="bg-red-500" />
                                    <StatItem label="Tardes" value={attendanceStats.late} color="bg-amber-500" />
                                    <StatItem label="Justificados" value={attendanceStats.justified} color="bg-indigo-500" />
                                </div>
                            </div>
                        </div>

                        <LateArrivalsInbox 
                            students={lateStudents} 
                            onResolve={handleResolveLateStatus}
                        />
                    </div>
                )}

                {/* Buttons section */}
                <div className="pt-6 border-t border-slate-100 space-y-6">
                    <button
                        onClick={handleTakeAttendance}
                        className="w-full flex items-center justify-between px-6 py-4 bg-amber-400 text-amber-900 font-bold rounded-lg hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        <span>Tomar Asistencia</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => navigate('/gestion-eventos')}
                            className="flex flex-col items-center justify-center p-6 bg-indigo-800 text-white rounded-xl h-40 hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <CalendarIcon className="w-10 h-10 mb-2" />
                            <span className="font-semibold text-center">Gestionar Eventos (QR)</span>
                        </button>
                        <button
                            onClick={() => navigate('/reportes')}
                            className="flex flex-col items-center justify-center p-6 bg-indigo-800 text-white rounded-xl h-40 hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <DocumentChartBarIcon className="w-10 h-10 mb-2" />
                            <span className="font-semibold text-center">Ver Reportes</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceSummaryScreen;