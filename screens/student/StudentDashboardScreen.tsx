

import * as React from 'react';
import { Link } from 'react-router-dom';
import { mockStudentUser, mockStudentWeeklySchedule, mockWeeklyAttendance, mockEvents, mockStudentSubjects } from '../../data';
import { EventStatus, AttendanceStatus } from '../../types';
import { getNotifiedAbsencesForStudent, setTodayLateReasonForStudent, clearStudentNotification, setTodayAttendanceForSubject } from '../../store';
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    CheckBadgeIcon, 
    CalendarIcon, 
    DocumentTextIcon,
    UsersIcon,
    MegaphoneIcon,
    PlusIcon,
    XMarkIcon,
    CheckIcon,
    PencilIcon,
    ExclamationCircleIconOutline,
    ChatBubbleLeftRightIcon
} from '../../components/Icons';

// --- Reason Modal Component ---
const ReasonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (subject: string, reason: string) => void;
    subjects: string[];
}> = ({ isOpen, onClose, onSave, subjects }) => {
    const [reason, setReason] = React.useState('');
    const [selectedSubject, setSelectedSubject] = React.useState(subjects[0] || '');

    React.useEffect(() => {
        if (isOpen) {
            setReason(''); // Reset reason when modal opens
            setSelectedSubject(subjects[0] || '');
        }
    }, [isOpen, subjects]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (reason.trim() && selectedSubject) {
            onSave(selectedSubject, reason.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">Avisar tardanza</h3>
                    <p className="text-sm text-slate-500">Informa el motivo de tu llegada tarde.</p>
                </div>
                <div className="p-5 space-y-4">
                     <div>
                        <label htmlFor="subject-select" className="block text-sm font-medium text-slate-700 mb-1">Materia</label>
                        <select
                            id="subject-select"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="reason-textarea" className="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
                        <textarea
                            id="reason-textarea"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: Tráfico en la autopista, llego en 20 mins."
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Guardar</button>
                </div>
            </div>
        </div>
    );
};

// --- Shortcut Management ---
interface Shortcut {
    key: string;
    to: string;
    text: string;
    icon: React.ElementType;
}

const ALL_STUDENT_SHORTCUTS: Shortcut[] = [
    { key: 'materias', to: '/mis-materias', text: 'Materias', icon: DocumentTextIcon },
    { key: 'asistencia', to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { key: 'calendario', to: '/calendario-escolar', text: 'Calendario', icon: CalendarIcon },
    { key: 'certificados', to: '/certificados', text: 'Certificados', icon: UsersIcon },
    { key: 'sugerencias', to: '/sugerencias', text: 'Sugerencias', icon: MegaphoneIcon },
];
const MAX_SHORTCUTS = 4;

const ManageShortcutsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedKeys: string[]) => void;
    currentShortcutKeys: string[];
}> = ({ isOpen, onClose, onSave, currentShortcutKeys }) => {
    const [selectedKeys, setSelectedKeys] = React.useState(currentShortcutKeys);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedKeys(currentShortcutKeys);
        }
    }, [isOpen, currentShortcutKeys]);

    const handleToggle = (key: string) => {
        setSelectedKeys(prev => 
            prev.includes(key) 
                ? prev.filter(k => k !== key) 
                : [...prev, key]
        );
    };

    const handleSave = () => {
        onSave(selectedKeys);
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">Editar Atajos</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Selecciona los atajos que quieres ver en tu panel de inicio (máx. {MAX_SHORTCUTS}).</p>
                    <div className="space-y-3">
                        {ALL_STUDENT_SHORTCUTS.map(shortcut => {
                            const isSelected = selectedKeys.includes(shortcut.key);
                            const isDisabled = !isSelected && selectedKeys.length >= MAX_SHORTCUTS;
                            return (
                                <label 
                                    key={shortcut.key} 
                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                                        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() => handleToggle(shortcut.key)}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                        <CheckIcon className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                    <shortcut.icon className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                                    <span className={`font-medium ${isSelected ? 'text-indigo-800' : 'text-slate-700'}`}>{shortcut.text}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Guardar</button>
                </div>
            </div>
        </div>
    );
};

// FIX: Using React.FC with an interface for props to avoid potential issues with TypeScript's JSX type inference.
interface ShortcutButtonProps {
  to: string;
  text: string;
  icon: React.ElementType;
}
const ShortcutButton: React.FC<ShortcutButtonProps> = ({ to, text, icon: Icon }) => (
    <Link to={to} className="h-full flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
        <Icon className="w-8 h-8 text-indigo-700 mb-2" />
        <span className="text-sm font-semibold text-slate-800 text-center">{text}</span>
    </Link>
);

const StudentDashboardScreen: React.FC = () => {
    const [today] = React.useState(new Date());
    const [isReasonModalOpen, setIsReasonModalOpen] = React.useState(false);

    // --- Absence Notifications ---
    const todayStr = today.toISOString().split('T')[0];
    const initialAbsences = getNotifiedAbsencesForStudent(todayStr, 1); // Mock student ID 1
    const [notifiedAbsences, setNotifiedAbsences] = React.useState<string[]>(initialAbsences);

    const handleClearNotification = (subject: string) => {
        clearStudentNotification(todayStr, subject, 1);
        setNotifiedAbsences(prev => prev.filter(s => s !== subject));
    };

    // --- Late Arrival Logic ---
    const handleSaveLateReason = (subject: string, reason: string) => {
        setTodayAttendanceForSubject(subject, { 1: AttendanceStatus.LATE }); // Mock student ID 1
        setTodayLateReasonForStudent(subject, 1, reason); // Mock student ID 1
        setIsReasonModalOpen(false);
        alert(`Aviso de tardanza enviado para ${subject}.`);
    };

    // --- Schedule Logic ---
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDayName = days[today.getDay()];
    const todaySchedule = mockStudentWeeklySchedule[currentDayName] || [];

    // --- Shortcuts Logic ---
    const [shortcutKeys, setShortcutKeys] = React.useState(['materias', 'asistencia', 'calendario']);
    const [isShortcutModalOpen, setIsShortcutModalOpen] = React.useState(false);

    const shortcutButtons = shortcutKeys.map(key => ALL_STUDENT_SHORTCUTS.find(s => s.key === key)).filter(Boolean) as Shortcut[];

    const handleSaveShortcuts = (newKeys: string[]) => {
        setShortcutKeys(newKeys);
        setIsShortcutModalOpen(false);
    };

    // --- Weekly Attendance Data ---
    const attendanceData = [
        { day: 'Lun', status: 'P' },
        { day: 'Mar', status: 'P' },
        { day: 'Mie', status: 'A' },
        { day: 'Jue', status: 'P' },
        { day: 'Vie', status: 'J' },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'P': return 'bg-green-100 text-green-800 border-green-200';
            case 'A': return 'bg-red-100 text-red-800 border-red-200';
            case 'J': return 'bg-amber-100 text-amber-800 border-amber-200';
            default: return 'bg-slate-100 text-slate-500 border-slate-200';
        }
    };

    const activeEvents = mockEvents.filter(e => e.status === EventStatus.ACTIVE);
    const todayDayStr = today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <>
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Bienvenido, {mockStudentUser.name.split(' ')[0]}</h1>
                <p className="text-slate-500 capitalize">{todayDayStr}</p>
            </div>

            {/* Absence Notifications */}
            {notifiedAbsences.length > 0 && (
                 <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-3">
                    <div className="flex items-start space-x-3">
                         <ExclamationCircleIconOutline className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-800">Registro de Inasistencia</h3>
                            <p className="text-sm text-red-700 mt-1">Se ha registrado tu ausencia en las siguientes materias de hoy. Si fue un error, contacta a tu preceptor/a.</p>
                        </div>
                    </div>
                    <ul className="space-y-2 pl-9">
                        {notifiedAbsences.map(subject => (
                            <li key={subject} className="flex items-center justify-between">
                                <span className="font-semibold text-sm text-red-900">{subject}</span>
                                <button onClick={() => handleClearNotification(subject)} className="text-xs font-semibold text-red-600 hover:underline">Marcar como visto</button>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Tu horario de hoy</h2>
                {todaySchedule.length > 0 ? (
                    <div className="space-y-3">
                        {todaySchedule.map(item => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                                <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                                <div>
                                    <p className="font-semibold">{item.subject}</p>
                                    <p className="text-sm text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-center text-slate-500 py-6">
                        <p>No tienes clases programadas para hoy.</p>
                    </div>
                )}
                 <div className="mt-4">
                    <button 
                        onClick={() => setIsReasonModalOpen(true)}
                        className="flex items-center justify-center w-full bg-amber-400 text-amber-900 font-bold py-3 rounded-lg hover:bg-amber-500 transition-colors"
                    >
                        <span>Avisar llegada tarde</span>
                        <ChevronRightIcon className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>

            {/* Shortcuts Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Atajos</h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {shortcutButtons.map(shortcut => (
                        <div key={shortcut.key} className="flex-shrink-0 w-28">
                            <ShortcutButton to={shortcut.to} text={shortcut.text} icon={shortcut.icon} />
                        </div>
                    ))}
                    <div className="flex-shrink-0 w-28">
                        <button 
                            onClick={() => setIsShortcutModalOpen(true)}
                            className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-200 hover:border-slate-400 transition-colors"
                        >
                            {shortcutButtons.length > 0 ? (
                                <>
                                    <PencilIcon className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-semibold text-slate-500 text-center">Editar</span>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-semibold text-slate-500 text-center">Agregar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asistencia de la semana */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Asistencia de la semana</h2>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-around items-center text-center">
                            {attendanceData.map(({ day, status }) => (
                                <div key={day} className="flex flex-col items-center space-y-2">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg ${getStatusStyles(status)}`}>
                                        {status}
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 text-right">
                        <Link to="/asistencia-registro" className="text-sm font-medium text-indigo-600 hover:underline">
                            Ver registro completo
                        </Link>
                    </div>
                </div>

                {/* Foro de Consultas Card */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Foro de Consultas</h2>
                    <div className="space-y-3">
                        {mockStudentSubjects.filter(s => s.status === 'cursando').slice(0, 4).map(subject => (
                            <Link
                                key={subject.id}
                                to={`/materias/${subject.id}/foro`}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-sm">{subject.name}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-indigo-600">Ir al foro</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
        <ReasonModal
            isOpen={isReasonModalOpen}
            onClose={() => setIsReasonModalOpen(false)}
            onSave={handleSaveLateReason}
            subjects={todaySchedule.map(s => s.subject)}
        />
        <ManageShortcutsModal
            isOpen={isShortcutModalOpen}
            onClose={() => setIsShortcutModalOpen(false)}
            onSave={handleSaveShortcuts}
            currentShortcutKeys={shortcutKeys}
        />
        </>
    );
};

export default StudentDashboardScreen;
