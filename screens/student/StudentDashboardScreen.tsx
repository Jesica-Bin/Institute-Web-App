import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockStudentUser, mockStudentWeeklySchedule, mockWeeklyAttendance, mockAllNotifications, mockEvents, mockStudentSubjects } from '../../data';
import { EventStatus, NotificationType, AttendanceStatus } from '../../types';
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
    WrenchScrewdriverIcon,
    ExclamationCircleIconOutline
} from '../../components/Icons';

// --- Reason Modal Component ---
const ReasonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (subject: string, reason: string) => void;
    subjects: string[];
}> = ({ isOpen, onClose, onSave, subjects }) => {
    const [reason, setReason] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(subjects[0] || '');

    useEffect(() => {
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
                            rows={4}
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: Tráfico, turno médico, etc."
                            autoFocus
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Enviar</button>
                </div>
            </div>
        </div>
    );
};


// --- Late Notification Banner ---
const LateNotificationBanner: React.FC<{ onNotify: () => void }> = ({ onNotify }) => (
    <div className="bg-amber-50 p-3 sm:p-4 rounded-xl shadow-sm border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <ExclamationCircleIconOutline className="w-6 h-6 text-amber-700" />
            </div>
        </div>
        <div className="flex-grow text-left">
            <h3 className="font-bold text-amber-900">Asistencia registrada</h3>
            <p className="text-sm text-amber-800 mt-1">La preceptora ha tomado asistencia y no te encuentras presente. ¿Estás llegando tarde?</p>
        </div>
        <button
            onClick={onNotify}
            className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors text-sm"
        >
            Avisar tardanza
        </button>
    </div>
);


// --- Shortcut Management ---
interface Shortcut {
    key: string;
    to: string;
    text: string;
    icon: React.ElementType;
}

const ALL_SHORTCUTS: Shortcut[] = [
    { key: 'materias', to: '/mis-materias', text: 'Mis Materias', icon: DocumentTextIcon },
    { key: 'certificados', to: '/certificados', text: 'Certificados', icon: UsersIcon },
    { key: 'sugerencias', to: '/sugerencias', text: 'Sugerencias', icon: MegaphoneIcon },
    { key: 'asistencia', to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { key: 'eventos', to: '/eventos-qr', text: 'Eventos', icon: CalendarIcon }
];
const MAX_SHORTCUTS = 4;

// --- Modal Component for Managing Shortcuts ---
const ManageShortcutsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedKeys: string[]) => void;
    currentShortcutKeys: string[];
}> = ({ isOpen, onClose, onSave, currentShortcutKeys }) => {
    const [selectedKeys, setSelectedKeys] = useState(currentShortcutKeys);

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
                        {ALL_SHORTCUTS.map(shortcut => {
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


const NotificationIcon = ({ type }: { type: NotificationType }) => {
    const iconProps = { className: "w-5 h-5 text-slate-500" };
    switch (type) {
        case NotificationType.SYSTEM:
            return <WrenchScrewdriverIcon {...iconProps} />;
        case NotificationType.OFFICIAL:
            return <MegaphoneIcon {...iconProps} />;
        default:
            return null;
    }
};

const ShortcutButton = ({ to, text, icon: Icon }: { to: string, text: string, icon: React.ElementType }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
        <Icon className="w-8 h-8 text-indigo-700 mb-2" />
        <span className="text-sm font-semibold text-slate-800 text-center">{text}</span>
    </Link>
);

const ActiveEventBanner = ({ event }: { event: { name: string } }) => (
    <div className="bg-green-50 p-3 sm:p-4 rounded-xl shadow-sm border border-green-200 flex flex-row items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-200 rounded-full flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-green-700" />
            </div>
        </div>
        <div className="flex-grow text-left">
            <p className="text-xs sm:text-sm text-green-700 font-semibold">¡Evento Activo!</p>
            <h3 className="font-bold text-green-900 text-sm sm:text-base leading-tight">{event.name}</h3>
        </div>
        <Link
            to="/eventos-qr"
            className="flex-shrink-0 bg-green-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-center text-sm"
        >
            Ir
        </Link>
    </div>
);


const StudentDashboardScreen: React.FC = () => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([
        ALL_SHORTCUTS.find(s => s.key === 'materias')!,
        ALL_SHORTCUTS.find(s => s.key === 'certificados')!,
        ALL_SHORTCUTS.find(s => s.key === 'sugerencias')!,
    ]);
    const [isShortcutsModalOpen, setShortcutsModalOpen] = useState(false);
    const [lateNotificationSubjects, setLateNotificationSubjects] = useState<string[]>([]);
    const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

    useEffect(() => {
        // Check for late notifications on component mount
        const today = new Date().toISOString().split('T')[0];
        // Assuming student ID is 1 for this mock. In a real app, this would be the logged-in user's ID.
        const studentId = 1;
        const notifiedSubjects = getNotifiedAbsencesForStudent(today, studentId);
        setLateNotificationSubjects(notifiedSubjects);
    }, []);

    const handleSaveShortcuts = (newKeys: string[]) => {
        const newShortcutList = ALL_SHORTCUTS.filter(s => newKeys.includes(s.key));
        setShortcuts(newShortcutList);
        setShortcutsModalOpen(false);
    };

     const handleSaveReason = (subject: string, reason: string) => {
        const today = new Date().toISOString().split('T')[0];
        const studentId = 1; // Mock student ID

        setTodayAttendanceForSubject(subject, { [studentId]: AttendanceStatus.LATE });
        setTodayLateReasonForStudent(subject, studentId, reason);
        clearStudentNotification(today, subject, studentId);
        
        setLateNotificationSubjects(prev => prev.filter(s => s !== subject));
        setIsReasonModalOpen(false);
        alert('Motivo de tardanza enviado a la preceptora.');
    };

    const recentNotifications = [...mockAllNotifications]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);

    const getInitialDay = () => {
        const dayMap = ['Lunes', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Lunes'];
        return dayMap[new Date().getDay()];
    };

    const [currentDay, setCurrentDay] = useState(getInitialDay());
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    const activeEvent = useMemo(() => {
        const activeEvents = mockEvents
            .filter(e => e.status === EventStatus.ACTIVE)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return activeEvents.length > 0 ? activeEvents[0] : null;
    }, []);

    const handleDayChange = (direction: 'prev' | 'next') => {
        const currentIndex = daysOfWeek.indexOf(currentDay);
        if (direction === 'prev') {
            const newIndex = (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length;
            setCurrentDay(daysOfWeek[newIndex]);
        } else {
            const newIndex = (currentIndex + 1) % daysOfWeek.length;
            setCurrentDay(daysOfWeek[newIndex]);
        }
    };
    
    const displayDate = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const scheduleForSelectedDay = mockStudentWeeklySchedule[currentDay] || [];

    const subjectColors: { [key: string]: { bg: string; accent: string } } = {
        'Análisis Matemático': { bg: 'bg-indigo-50', accent: 'bg-indigo-500' },
        'Diseño Web': { bg: 'bg-purple-50', accent: 'bg-purple-500' },
        'Álgebra Lineal': { bg: 'bg-green-50', accent: 'bg-green-500' },
        'Programación I': { bg: 'bg-red-50', accent: 'bg-red-500' },
        'Inglés Técnico I': { bg: 'bg-yellow-50', accent: 'bg-yellow-500' },
        'Bases de Datos': { bg: 'bg-pink-50', accent: 'bg-pink-500' },
        'Sistemas Operativos': { bg: 'bg-orange-50', accent: 'bg-orange-500' },
        'Redes de Computadoras': { bg: 'bg-teal-50', accent: 'bg-teal-500' },
        'Ética y Deontología Profesional': { bg: 'bg-gray-50', accent: 'bg-gray-400' },
        'default': { bg: 'bg-slate-100', accent: 'bg-slate-400' }
    };

    const attendanceStatusColors: { [key: string]: string } = {
        'P': 'bg-green-100 border-green-300 text-green-800',
        'A': 'bg-red-100 border-red-300 text-red-800',
        'J': 'bg-amber-100 border-amber-300 text-amber-800',
    };

    return (
        <>
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                 <h1 className="text-2xl font-bold text-indigo-700">
                    Bienvenido, {mockStudentUser.name}
                </h1>
                <p className="text-slate-500 capitalize">{displayDate}</p>
            </div>
            
            {/* Late Notification */}
            {lateNotificationSubjects.length > 0 && (
                <LateNotificationBanner onNotify={() => setIsReasonModalOpen(true)} />
            )}
            
            {/* Mobile-only Event Banner */}
            {activeEvent && (
                <div className="lg:hidden">
                    <ActiveEventBanner event={activeEvent} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Horario del dia Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-slate-700">Horario del dia</h2>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleDayChange('prev')} className="p-1 rounded-full hover:bg-slate-100" aria-label="Día anterior">
                                    <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
                                </button>
                                <span className="font-semibold text-sm w-20 text-center">{currentDay}</span>
                                <button onClick={() => handleDayChange('next')} className="p-1 rounded-full hover:bg-slate-100" aria-label="Día siguiente">
                                    <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {scheduleForSelectedDay.length > 0 ? (
                                scheduleForSelectedDay.map(item => {
                                    const colors = subjectColors[item.subject] || subjectColors['default'];
                                    const subjectData = mockStudentSubjects.find(s => s.name === item.subject);
                                    return (
                                         <Link 
                                            key={item.id} 
                                            to={subjectData ? `/materia-detalle/${subjectData.id}` : '#'}
                                            className={`flex items-center space-x-3 p-3 ${colors.bg} rounded-lg hover:shadow-md hover:scale-[1.02] transition-all`}
                                         >
                                            <div className={`w-1.5 h-10 ${colors.accent} rounded-full`}></div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{item.subject}</p>
                                                <p className="text-xs text-slate-500">{item.time}</p>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg">
                                    <p>No hay clases programadas para este día.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Asistencia Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-slate-800">Asistencia de la semana</h2>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg flex justify-around">
                            {mockWeeklyAttendance.map(item => {
                                const colorClass = attendanceStatusColors[item.status] || 'bg-slate-200 border-slate-300 text-slate-500';
                                return (
                                    <div key={item.day} className="flex flex-col items-center space-y-2">
                                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shadow-sm ${colorClass}`}>
                                           {item.status}
                                       </div>
                                       <p className="text-xs text-slate-500 font-medium">{item.day}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Desktop-only Event Banner */}
                    {activeEvent && (
                        <div className="hidden lg:block">
                            <ActiveEventBanner event={activeEvent} />
                        </div>
                    )}
                     {/* Notificaciones recientes Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-slate-800">Notificaciones recientes</h2>
                            <Link to="/notificaciones" className="text-sm font-medium text-indigo-600 hover:underline">
                                Ver todas
                            </Link>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg">
                            {recentNotifications.map((notif, index) => (
                                 <div key={notif.id}>
                                    {index > 0 && <hr className="my-3 border-slate-200" />}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                            <NotificationIcon type={notif.type} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                                            <p className="text-xs text-slate-500">{notif.time}</p>
                                         </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shortcuts Card */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Atajos</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {/* FIX: Destructured the shortcut object to pass only the expected props to ShortcutButton. The 'key' property is a reserved prop used by React for list rendering and should not be passed to child components directly, which causes a TypeScript error if not defined in the component's props. */}
                            {shortcuts.map(({ key, to, text, icon }) => (
                                <ShortcutButton key={key} to={to} text={text} icon={icon} />
                            ))}
                            <button 
                                onClick={() => setShortcutsModalOpen(true)}
                                className="flex flex-col items-center justify-center p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-200 hover:border-slate-400 transition-colors"
                            >
                                {shortcuts.length > 0 ? (
                                    <>
                                        <PencilIcon className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-semibold text-slate-500 text-center">Editar atajos</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-semibold text-slate-500 text-center">Agregar atajo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
         <ManageShortcutsModal
            isOpen={isShortcutsModalOpen}
            onClose={() => setShortcutsModalOpen(false)}
            onSave={handleSaveShortcuts}
            currentShortcutKeys={shortcuts.map(s => s.key)}
        />
        <ReasonModal
            isOpen={isReasonModalOpen}
            onClose={() => setIsReasonModalOpen(false)}
            onSave={handleSaveReason}
            subjects={lateNotificationSubjects}
        />
        </>
    );
};

export default StudentDashboardScreen;
