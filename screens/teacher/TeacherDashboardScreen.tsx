import * as React from 'react';
import { Link } from 'react-router-dom';
import { mockTeacherUser, mockOfficialCommunications } from '../../data';
import { getCalendarEvents, getClassLogForEvent, addOrUpdateClassLog, updateCalendarEvent } from '../../store';
import { CalendarEvent, ClassLog, ClassStatus, CalendarEventType } from '../../types';
import { ChevronRightIcon, CalendarIcon, MegaphoneIcon, BookOpenIcon, CheckIcon, XMarkIcon } from '../../components/Icons';

const ClassLogModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (logData: Omit<ClassLog, 'id' | 'date' | 'eventId'>) => void;
    event: CalendarEvent | null;
}> = ({ isOpen, onClose, onSave, event }) => {
    
    const [topic, setTopic] = React.useState('');
    const [activities, setActivities] = React.useState('');
    const [observations, setObservations] = React.useState('');

    const existingLog = event ? getClassLogForEvent(event.id, event.date) : null;
    const isViewing = !!existingLog;

    React.useEffect(() => {
        if (isOpen) {
            setTopic(existingLog?.topic || '');
            setActivities(existingLog?.activities || '');
            setObservations(existingLog?.observations || '');
        }
    }, [isOpen, existingLog]);

    if (!isOpen || !event) return null;

    const handleSave = () => {
        if (topic.trim() && activities.trim()) {
            onSave({ topic, activities, observations });
        } else {
            alert('El tema y las actividades son obligatorios.');
        }
    };

    const inputStyle = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">{isViewing ? 'Ver' : 'Completar'} Libro de Temas</h3>
                    <p className="text-sm text-slate-500">{event.title} - {new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES')}</p>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">Tema del día</label>
                        <input id="topic" type="text" value={topic} onChange={e => setTopic(e.target.value)} disabled={isViewing} className={inputStyle} placeholder="Ej: Introducción a la Tipografía" />
                    </div>
                     <div>
                        <label htmlFor="activities" className="block text-sm font-medium text-slate-700 mb-1">Actividades realizadas</label>
                        <textarea id="activities" value={activities} onChange={e => setActivities(e.target.value)} disabled={isViewing} rows={4} className={inputStyle} placeholder="Ej: Presentación teórica, inicio de TP1..."></textarea>
                    </div>
                     <div>
                        <label htmlFor="observations" className="block text-sm font-medium text-slate-700 mb-1">Observaciones (opcional)</label>
                        <textarea id="observations" value={observations} onChange={e => setObservations(e.target.value)} disabled={isViewing} rows={2} className={inputStyle} placeholder="Ej: Recordar traer materiales para la próxima clase..."></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">
                        {isViewing ? 'Cerrar' : 'Cancelar'}
                    </button>
                    {!isViewing && (
                        <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">
                            Guardar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const TeacherDashboardScreen: React.FC = () => {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const recentNotifications = mockOfficialCommunications.slice(0, 3);
    const [isLogModalOpen, setIsLogModalOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
    // Fix: Use state to store classes and a forceUpdate trigger for re-fetching.
    const [todaysClasses, setTodaysClasses] = React.useState<CalendarEvent[]>([]);
    const [forceUpdate, setForceUpdate] = React.useState(0);

    React.useEffect(() => {
        // Use a fixed date to match mock data
        const todayStr = '2025-10-08';
        getCalendarEvents().then(allEvents => {
            const filteredClasses = allEvents.filter(event => 
                event.date === todayStr &&
                event.type === CalendarEventType.CLASS &&
                (event.professor === mockTeacherUser.name || event.professor?.includes('Martinez')) // Martinez has a DICTATED class
            ).sort((a,b) => (a.startTime || '0').localeCompare(b.startTime || '0'));
            setTodaysClasses(filteredClasses);
        });
    }, [forceUpdate]);


    const handleOpenLogModal = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsLogModalOpen(true);
    };

    const handleSaveLog = (logData: Omit<ClassLog, 'id' | 'date' | 'eventId'>) => {
        if (selectedEvent) {
            addOrUpdateClassLog({
                eventId: selectedEvent.id,
                date: selectedEvent.date,
                ...logData
            });
            updateCalendarEvent({ ...selectedEvent, status: ClassStatus.DICTATED });
            setIsLogModalOpen(false);
            setSelectedEvent(null);
            setForceUpdate(val => val + 1); // Force re-render
        }
    };

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Bienvenido, {mockTeacherUser.name.split(' ')[0]}</h1>
                    <p className="text-slate-500 capitalize">{today}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Clases de Hoy Card */}
                        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">Clases de Hoy</h2>
                                <Link to="/calendario" className="text-sm font-medium text-indigo-600 hover:underline">
                                    Ir a calendario
                                </Link>
                            </div>
                            <div className="space-y-3 flex-grow">
                                {todaysClasses.length > 0 ? todaysClasses.map(event => {
                                    const log = getClassLogForEvent(event.id, event.date);
                                    const isCompleted = !!log || event.status === ClassStatus.DICTATED;
                                    return (
                                        <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-1.5 h-10 ${isCompleted ? 'bg-green-500' : 'bg-indigo-600'} rounded-full`}></div>
                                                <div>
                                                    <p className="font-semibold">{event.title}</p>
                                                    <p className="text-sm text-slate-500">{event.startTime} - {event.endTime}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleOpenLogModal(event)} className={`text-sm font-semibold py-1 px-3 rounded-full transition-colors ${isCompleted ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'}`}>
                                                {isCompleted ? 'Ver' : 'Completar'}
                                            </button>
                                        </div>
                                    )
                                }) : (
                                    <div className="flex flex-col items-center justify-center text-center text-slate-500 h-full py-8">
                                        <CalendarIcon className="w-12 h-12 text-slate-300 mb-2"/>
                                        <p>No tienes clases programadas para hoy.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Tareas Pendientes Card */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-3">Tareas Pendientes</h2>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-md border border-amber-200">
                                    <div className="w-10 h-10 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <CalendarIcon className="w-5 h-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-amber-900">Cargar notas del Parcial 1</p>
                                        <p className="text-xs text-amber-700">Vence en 3 días</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notificaciones Card */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold">Últimas Notificaciones</h2>
                                <Link to="/notificaciones" className="text-sm font-medium text-indigo-600 hover:underline">
                                    Ver todos
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {recentNotifications.map(comm => (
                                    <div key={comm.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md">
                                        <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                            <MegaphoneIcon className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{comm.title}</p>
                                            <p className="text-xs text-slate-500">{comm.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ClassLogModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
                onSave={handleSaveLog}
                event={selectedEvent}
            />
        </>
    );
};

export default TeacherDashboardScreen;
