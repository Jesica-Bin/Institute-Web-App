import React, { useState, useCallback } from 'react';
import { mockEvents } from '../../data';
import { Event, EventStatus, EventAttendanceStatus } from '../../types';
import EventCheckinScreen from './EventCheckinScreen';
import { CalendarIcon } from '../../components/Icons';

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

const EventItem = ({ event, onRegister }: { event: Event, onRegister: (event: Event) => void }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4">
        <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${event.status === EventStatus.ACTIVE ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <CalendarIcon className={`w-6 h-6 ${event.status === EventStatus.ACTIVE ? 'text-indigo-600' : 'text-slate-500'}`} />
            </div>
        </div>
        <div className="flex-grow">
            <h3 className="font-bold text-slate-800">{event.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            
            {event.status === EventStatus.ACTIVE ? (
                <div className="mt-3">
                    <button 
                        onClick={() => onRegister(event)}
                        className="w-full sm:w-auto flex justify-center items-center px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors font-semibold text-sm"
                        aria-label={`Registrar asistencia para ${event.name}`}
                    >
                        <span>Registrar Asistencia</span>
                    </button>
                </div>
            ) : (
                event.attendanceStatus && (
                    <div className="mt-3">
                        <AttendanceStatusBadge status={event.attendanceStatus} />
                    </div>
                )
            )}
        </div>
    </div>
);


const EventAttendanceScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>(mockEvents);
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const [isCheckinOpen, setCheckinOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [scanAttempts, setScanAttempts] = useState<Record<string, number>>({});

    const handleRegister = (event: Event) => {
        const newAttempts = (scanAttempts[event.id] || 0) + 1;
        setScanAttempts(prev => ({ ...prev, [event.id]: newAttempts }));
        setSelectedEvent(event);
        setCheckinOpen(true);
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
                        // Fix: The 'key' prop should be on the wrapping element in a map, not passed to the component.
                        eventsToShow.map(event => <div key={event.id}><EventItem event={event} onRegister={handleRegister} /></div>)
                    ) : (
                        <div className="p-8 text-center bg-white rounded-lg shadow-sm text-slate-500 flex flex-col items-center">
                            <CalendarIcon className="w-12 h-12 text-slate-300 mb-2" />
                            <p>No hay eventos {activeTab === 'active' ? 'activos' : 'pasados'} por ahora.</p>
                        </div>
                    )}
                </div>
            </div>
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