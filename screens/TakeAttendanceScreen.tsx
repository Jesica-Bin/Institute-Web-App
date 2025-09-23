import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockStudents, mockCareers, mockYears, courseData } from '../data';
import { StudentAttendance, AttendanceStatus } from '../types';
import { ChevronRightIcon, XMarkIcon, CheckIcon, UsersIcon, ExclamationCircleIconOutline } from '../components/Icons';
import { getTodayAttendanceForSubject, setTodayAttendanceForSubject, setTodayRegisterAsClosed, notifyAbsentStudents } from '../store';

const AttendanceButton = ({ status, selected, onClick }: { status: string, selected: boolean, onClick: () => void }) => {
    const baseClasses = "w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all";
    const colorClasses = {
        P: 'bg-green-100 text-green-700 border-green-300',
        A: 'bg-red-100 text-red-700 border-red-300',
    }[status] || 'bg-slate-200 text-slate-500 border-slate-300';
    
    const selectedClasses = selected ? 'border-2 scale-110 shadow-md' : 'border';
    
    return <button onClick={onClick} className={`${baseClasses} ${colorClasses} ${selectedClasses}`}>{status}</button>;
};

// --- Summary Modal Components ---
interface SummaryData {
    total: number;
    present: number;
    absent: number;
    unmarked: number;
    students: StudentAttendance[];
    subject: string;
}

const StatCard: React.FC<{ label: string; value: number; color: string; icon: React.ElementType }> = ({ label, value, color, icon: Icon }) => (
    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
        <div className={`p-2 rounded-full ${color}`}>
            <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="ml-3">
            <p className="text-xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
        </div>
    </div>
);

const AttendanceSummaryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    summaryData: SummaryData | null;
}> = ({ isOpen, onClose, summaryData }) => {
    if (!isOpen || !summaryData) return null;

    const getStatusInfo = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PRESENT:
                return { text: 'Presente', color: 'bg-green-100 text-green-800' };
            case AttendanceStatus.ABSENT:
                return { text: 'Ausente', color: 'bg-red-100 text-red-800' };
            default:
                return { text: 'No marcado', color: 'bg-slate-100 text-slate-500' };
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Resumen de Asistencia</h2>
                        <p className="text-sm text-slate-500">{summaryData.subject} - {new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <StatCard label="Total" value={summaryData.total} color="bg-slate-400" icon={UsersIcon} />
                        <StatCard label="Presentes" value={summaryData.present} color="bg-green-500" icon={CheckIcon} />
                        <StatCard label="Ausentes" value={summaryData.absent} color="bg-red-500" icon={XMarkIcon} />
                        <StatCard label="No marcados" value={summaryData.unmarked} color="bg-amber-500" icon={UsersIcon} />
                    </div>
                    <h3 className="font-semibold text-slate-700 mb-2">Detalle de Estudiantes</h3>
                    <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg">
                        <ul className="divide-y divide-slate-200">
                            {summaryData.students.map(student => {
                                const statusInfo = getStatusInfo(student.status);
                                return (
                                    <li key={student.id} className="flex justify-between items-center p-3">
                                        <span className="font-medium text-slate-800">{student.lastName}, {student.name}</span>
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="flex justify-end p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

const AlertModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    message: string;
}> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <ExclamationCircleIconOutline className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">Atención</h3>
                    <p className="text-slate-600 mt-2">{message}</p>
                </div>
                <div className="flex justify-center p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-8 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};


const TakeAttendanceScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { career } = location.state || { career: null };
    
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
    const [students, setStudents] = useState<StudentAttendance[]>([]);
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        if (career && selectedYear && selectedSubject) {
            const filteredStudents = mockStudents
                .filter(s => s.carrera === career)
                .map(s => ({ ...s, status: AttendanceStatus.UNMARKED }));

            const todaysAttendance = getTodayAttendanceForSubject(selectedSubject);

            if (todaysAttendance) {
                 const studentsWithStatus = filteredStudents.map(student => ({
                    ...student,
                    status: todaysAttendance[student.id] || AttendanceStatus.UNMARKED,
                }));
                setStudents(studentsWithStatus);
            } else {
                setStudents(filteredStudents);
            }

        } else {
            setStudents([]);
        }
    }, [career, selectedYear, selectedSubject]);

    const handleStatusChange = (studentId: number, newStatus: AttendanceStatus) => {
        setStudents(prevStudents =>
            prevStudents.map(s => {
                if (s.id === studentId) {
                    // Toggle off if the same button is clicked
                    return { ...s, status: s.status === newStatus ? AttendanceStatus.UNMARKED : newStatus };
                }
                return s;
            })
        );
    };

    const handleSelectCareer = (selectedCareer: string) => {
        navigate('/tomar-asistencia', { state: { career: selectedCareer } });
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        setSelectedYear(year);
        setSelectedSubject('');
        setAvailableSubjects(year ? (courseData[career as keyof typeof courseData]?.[year] || []) : []);
    };
    
    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(e.target.value);
    };

    const handleSaveChanges = () => {
        if (!selectedSubject) {
            setAlertMessage("Por favor, seleccione una materia.");
            return;
        }
    
        const studentStatuses: { [studentId: number]: AttendanceStatus } = {};
        const absentStudentIds: number[] = [];
        students.forEach(student => {
            studentStatuses[student.id] = student.status;
            if (student.status === AttendanceStatus.ABSENT || student.status === AttendanceStatus.UNMARKED) {
                absentStudentIds.push(student.id);
            }
        });
    
        setTodayAttendanceForSubject(selectedSubject, studentStatuses);
        notifyAbsentStudents(new Date().toISOString().split('T')[0], selectedSubject, absentStudentIds);
        
        alert('Cambios guardados. Se notificará a los estudiantes ausentes.');
    };
    
    const handleCloseRegister = () => {
        const hasLateStudents = students.some(student => student.status === AttendanceStatus.LATE);
    
        if (hasLateStudents) {
            setAlertMessage("Primero debe resolver el estado de los estudiantes marcados como 'Tarde' para poder cerrar el registro.");
            return;
        }
    
        if (!selectedSubject) {
            setAlertMessage("Por favor, seleccione una materia.");
            return;
        }
    
        const studentStatuses: { [studentId: number]: AttendanceStatus } = {};
        students.forEach(student => {
            studentStatuses[student.id] = student.status;
        });
        setTodayAttendanceForSubject(selectedSubject, studentStatuses);
    
        setTodayRegisterAsClosed(selectedSubject);
    
        const presentCount = students.filter(s => s.status === AttendanceStatus.PRESENT).length;
        const absentCount = students.filter(s => s.status === AttendanceStatus.ABSENT).length;
        const unmarkedCount = students.filter(s => s.status === AttendanceStatus.UNMARKED).length;
        
        setSummaryData({
            total: students.length,
            present: presentCount,
            absent: absentCount,
            unmarked: unmarkedCount,
            students: students,
            subject: selectedSubject,
        });
        setIsSummaryModalOpen(true);
    };

    const handleModalClose = () => {
        setIsSummaryModalOpen(false);
        navigate('/asistencia');
    };

    if (!career) {
        return (
            <div className="space-y-4 max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500 mt-1 mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis.</p>
                    <div className="space-y-2">
                        {mockCareers.map(c => (
                            <button 
                                key={c} 
                                onClick={() => handleSelectCareer(c)}
                                className="w-full flex justify-between items-center p-4 bg-slate-100 rounded-lg text-left hover:bg-slate-200 transition-colors"
                            >
                                <span className="font-medium text-slate-800">{c}</span>
                                <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 max-w-4xl mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-500">Seleccione el año y la materia para ver la lista de estudiantes.</p>
                     <select 
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="mt-2 w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md"
                     >
                        <option value="">Seleccione un año</option>
                        {mockYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select 
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        disabled={!selectedYear || availableSubjects.length === 0}
                        className="mt-2 w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Seleccione una materia</option>
                        {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                
                {selectedYear && selectedSubject && (
                    <>
                        <div className="bg-white rounded-lg shadow-sm">
                            <ul className="divide-y divide-slate-100">
                                {students.length > 0 ? students.map(student => (
                                    <li key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <p className="font-medium">{student.name} {student.lastName}</p>
                                        <div className="flex space-x-2">
                                            <AttendanceButton status="P" selected={student.status === AttendanceStatus.PRESENT} onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)} />
                                            <AttendanceButton status="A" selected={student.status === AttendanceStatus.ABSENT} onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)} />
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-4 text-center text-slate-500">No hay estudiantes para esta materia.</li>
                                )}
                            </ul>
                        </div>

                        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-3 md:justify-end sticky bottom-4">
                            <button onClick={handleCloseRegister} className="w-full md:w-auto md:px-6 bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
                                Cerrar registro
                            </button>
                            <button onClick={handleSaveChanges} className="w-full md:w-auto md:px-6 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                                Guardar cambios
                            </button>
                        </div>
                    </>
                )}
            </div>
            <AttendanceSummaryModal 
                isOpen={isSummaryModalOpen}
                onClose={handleModalClose}
                summaryData={summaryData}
            />
            <AlertModal
                isOpen={!!alertMessage}
                onClose={() => setAlertMessage(null)}
                message={alertMessage || ''}
            />
        </>
    );
};

export default TakeAttendanceScreen;