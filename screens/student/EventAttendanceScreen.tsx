import React, { useState, useCallback } from 'react';
import { mockEvents } from '../../data';
import { Event, EventStatus, EventAttendanceStatus } from '../../types';
import EventCheckinScreen from './EventCheckinScreen';
import { CalendarIcon, XMarkIcon } from '../../components/Icons';

type Tab = 'active' | 'inactive';

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => {
    const baseClasses = "py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors flex-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const activeClasses = active ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-100";
    return <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>{label}</button>;
};

const AttendanceStatusBadge = ({ status }: { status: EventAttendanceStatus }) => {
    const colorClasses = {
        [EventAttendanceStatus.ATTENDED]: 'bg-green-100 text-green-800',
        [EventAttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
        [EventAttendanceStatus.JUSTIFIED]: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const EventItem = ({ event, onViewDetails }: { event: Event, onViewDetails: (event: Event) => void }) => (
    <button onClick={() => onViewDetails(event)} className="w-full text-left bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 hover:bg-slate-50 transition-colors">
        <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${event.status === EventStatus.ACTIVE ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <CalendarIcon className={`w-6 h-6 ${event.status === EventStatus.ACTIVE ? 'text-indigo-600' : 'text-slate-500'}`} />
            </div>
        </div>
        <div className="flex-grow min-w-0">
            <h3 className="font-bold text-slate-800 truncate">{event.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            
            <div className="mt-3">
                 {event.status === EventStatus.ACTIVE ? (
                     <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                 ) : (
                     event.attendanceStatus && <AttendanceStatusBadge status={event.attendanceStatus} />
                 )}
            </div>
        </div>
    </button>
);

const EventDetailModal: React.FC<{
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onRegister: (event: Event) => void;
}> = ({ event, isOpen, onClose, onRegister }) => {
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">{event.name}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <h4 className="text-sm font-medium text-slate-500">Fecha</h4>
                        <p className="text-slate-800">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-500">Ubicación</h4>
                        <p className="text-slate-800">{event.location}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-slate-500">Descripción</h4>
                        <p className="text-slate-600 whitespace-pre-wrap">{event.description}</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-b-xl">
                    {event.status === EventStatus.ACTIVE ? (
                        <button
                            onClick={() => onRegister(event)}
                            className="w-full bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors"
                        >
                            Registrar Asistencia
                        </button>
                    ) : (
                        <div className="flex justify-between items-center">
                             <span className="text-sm font-medium text-slate-600">Estado de asistencia:</span>
                             {event.attendanceStatus && <AttendanceStatusBadge status={event.attendanceStatus} />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const EventAttendanceScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const [isCheckinOpen, setCheckinOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [scanAttempts, setScanAttempts] = useState<Record<string, number>>({});
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [eventForDetail, setEventForDetail] = useState<Event | null>(null);

    const handleViewDetails = (event: Event) => {
        setEventForDetail(event);
        setIsDetailModalOpen(true);
    };
    
    const handleRegister = (event: Event) => {
        setIsDetailModalOpen(false);
        setTimeout(() => {
            const newAttempts = (scanAttempts[event.id] || 0) + 1;
            setScanAttempts(prev => ({ ...prev, [event.id]: newAttempts }));
            setSelectedEvent(event);
            setCheckinOpen(true);
        }, 150);
    };

    const handleCloseCheckin = useCallback((success?: boolean) => {
        if (success && selectedEvent) {
            setEvents(prevEvents => prevEvents.map(e => 
                e.id === selectedEvent.id 
                ? { ...e, status: EventStatus.INACTIVE, attendanceStatus: EventAttendanceStatus.ATTENDED } 
                : e
            ));
        }
        setCheckinOpen(false);
        setTimeout(() => setSelectedEvent(null), 300); // Allow animation to finish
    }, [selectedEvent]);
    
    const activeEvents = events.filter(e => e.status === EventStatus.ACTIVE);
    const inactiveEvents = events.filter(e => e.status === EventStatus.INACTIVE);

    const eventsToShow = activeTab === 'active' ? activeEvents : inactiveEvents;

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-slate-200 p-1 rounded-xl flex space-x-1 max-w-sm mx-auto">
                    <TabButton 
                        label="Eventos activos" 
                        active={activeTab === 'active'} 
                        onClick={() => setActiveTab('active')} 
                    />
                    <TabButton 
                        label="Eventos pasados" 
                        active={activeTab === 'inactive'} 
                        onClick={() => setActiveTab('inactive')} 
                    />
                </div>
                <div className="space-y-4">
                     {eventsToShow.length > 0 ? (
                        eventsToShow.map(event => <div key={event.id}><EventItem event={event} onViewDetails={handleViewDetails} /></div>)
                    ) : (
                        <div className="p-8 text-center bg-white rounded-lg shadow-sm text-slate-500 flex flex-col items-center">
                            <CalendarIcon className="w-12 h-12 text-slate-300 mb-2" />
                            <p>No hay eventos {activeTab === 'active' ? 'activos' : 'pasados'} por ahora.</p>
                        </div>
                    )}
                </div>
            </div>
            <EventDetailModal
                event={eventForDetail}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                onRegister={handleRegister}
            />
            <EventCheckinScreen
                event={selectedEvent}
                isOpen={isCheckinOpen}
                onClose={handleCloseCheckin}
                attemptCount={selectedEvent ? scanAttempts[selectedEvent.id] || 0 : 0}
            />
        </>
    );
};

export default EventAttendanceScreen;