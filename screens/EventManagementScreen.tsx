import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { mockEvents } from '../data';
import { Event, EventStatus } from '../types';
import { PlusIcon, CalendarIcon, ArchiveBoxIcon, ArrowUturnLeftIcon } from '../components/Icons';
import EventDetailScreen from './EventDetailScreen';

const ToggleSwitch: React.FC<{ enabled: boolean; setEnabled: () => void }> = ({ enabled, setEnabled }) => (
    <button
        onClick={setEnabled}
        className={`${enabled ? 'bg-indigo-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
    >
        <span className="sr-only">Activar evento</span>
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
    </button>
);

const DetailPlaceholder: React.FC<{ icon: React.ElementType; message: string; }> = ({ icon: Icon, message }) => (
    <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center min-h-[60vh]">
        <Icon className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Selecciona un elemento</h3>
        <p className="text-slate-500 mt-2">{message}</p>
    </div>
);

const EventManagementScreen: React.FC = () => {
    const [mainEvents, setMainEvents] = useState<Event[]>(mockEvents);
    const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
    const [view, setView] = useState<'main' | 'archived'>('main');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const location = useLocation();
    const navigate = useNavigate();
    const newEvent = location.state?.newEvent as Event | undefined;

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (newEvent && !mainEvents.some(e => e.id === newEvent.id)) {
            const updatedEvents = [newEvent, ...mainEvents];
            setMainEvents(updatedEvents);
            if (isDesktop) {
                setSelectedEvent(newEvent);
            }
            window.history.replaceState({}, document.title);
        }
    }, [newEvent, mainEvents, isDesktop]);

    useEffect(() => {
        if (isDesktop) {
            const currentList = view === 'main' ? mainEvents : archivedEvents;
            const selectionInList = currentList.some(e => e.id === selectedEvent?.id);
            if (currentList.length > 0 && !selectionInList) {
                setSelectedEvent(currentList[0]);
            } else if (currentList.length === 0) {
                setSelectedEvent(null);
            }
        }
    }, [isDesktop, mainEvents, archivedEvents, view]);

    const handleStatusToggle = (eventId: string) => {
        const updatedEvents = mainEvents.map(event =>
            event.id === eventId
                ? { ...event, status: event.status === EventStatus.ACTIVE ? EventStatus.INACTIVE : EventStatus.ACTIVE }
                : event
        );
        setMainEvents(updatedEvents);
        if (selectedEvent?.id === eventId) {
            setSelectedEvent(updatedEvents.find(e => e.id === eventId) || null);
        }
    };

    const handleArchiveEvent = (eventId: string) => {
        const eventToArchive = mainEvents.find(event => event.id === eventId);
        if (eventToArchive) {
            setMainEvents(prev => prev.filter(event => event.id !== eventId));
            setArchivedEvents(prev => [eventToArchive, ...prev]);
            if (selectedEvent?.id === eventId) {
                setSelectedEvent(null);
            }
        }
    };

    const handleUnarchiveEvent = (eventId: string) => {
        const eventToUnarchive = archivedEvents.find(event => event.id === eventId);
        if (eventToUnarchive) {
            setArchivedEvents(prev => prev.filter(event => event.id !== eventId));
            setMainEvents(prev => [eventToUnarchive, ...prev]);
            if (selectedEvent?.id === eventId) {
                setSelectedEvent(null);
            }
        }
    };

    const handleViewDetails = (event: Event) => {
        if (isDesktop) {
            setSelectedEvent(event);
        } else {
            navigate('/evento-detalle', { state: { event } });
        }
    };

    const eventsToShow = view === 'main' ? mainEvents : archivedEvents;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex-1">
                        <Link
                            to="/crear-evento"
                            className="w-full md:w-auto flex-shrink-0 flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span>Crear Evento</span>
                        </Link>
                    </div>
                    <button
                        onClick={() => setView(view === 'main' ? 'archived' : 'main')}
                        className="w-full md:w-auto flex-shrink-0 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm"
                    >
                        {view === 'main' ? 'Ver Archivados' : 'Ver Eventos'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {eventsToShow.map(event => (
                            <li key={event.id} className={`p-4 flex items-center justify-between transition-colors ${selectedEvent?.id === event.id && isDesktop ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                                <div onClick={() => handleViewDetails(event)} className="flex-grow cursor-pointer pr-4">
                                    <p className={`font-semibold ${selectedEvent?.id === event.id && isDesktop ? 'text-indigo-800' : ''}`}>{event.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} -
                                        {view === 'main' && (
                                            <span className={`ml-2 font-medium ${event.status === EventStatus.ACTIVE ? 'text-green-600' : 'text-slate-500'}`}>
                                                {event.status === EventStatus.ACTIVE ? 'Activo' : 'Inactivo'}
                                            </span>
                                        )}
                                        {view === 'archived' && <span className="ml-2 font-medium text-slate-500">Archivado</span>}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 flex-shrink-0">
                                    {view === 'main' ? (
                                        <>
                                            <ToggleSwitch
                                                enabled={event.status === EventStatus.ACTIVE}
                                                setEnabled={() => handleStatusToggle(event.id)}
                                            />
                                            {event.status === EventStatus.INACTIVE && (
                                                <button 
                                                    onClick={() => handleArchiveEvent(event.id)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                    aria-label={`Archivar evento ${event.name}`}
                                                >
                                                    <ArchiveBoxIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleUnarchiveEvent(event.id)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                            aria-label={`Desarchivar evento ${event.name}`}
                                        >
                                            <ArrowUturnLeftIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
             <div className="hidden lg:block lg:col-span-2">
                {selectedEvent ? (
                    <EventDetailScreen event={selectedEvent} />
                ) : (
                    <DetailPlaceholder icon={CalendarIcon} message={view === 'main' ? "Selecciona un evento para ver sus detalles." : "No hay eventos archivados."} />
                )}
            </div>
        </div>
    );
};

export default EventManagementScreen;