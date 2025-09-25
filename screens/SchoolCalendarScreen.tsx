import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCalendarEvents } from '../data';
import { CalendarEvent, ClassStatus, CalendarEventType } from '../types';
import { 
    ChevronLeftIcon, ChevronRightIcon, PlusIcon, InformationCircleIcon,
    TrashIcon, ChevronDownIcon, ChevronUpIcon, XMarkIcon, EllipsisVerticalIcon,
    ArrowsRightLeftIcon,
    CheckBadgeIcon,
    CalendarDaysIcon,
    ArrowUturnLeftIcon,
} from '../components/Icons';
import { setSchoolYear, getSchoolYear, fetchNationalHolidays } from '../store';

// --- Helper Functions & Constants ---
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

const getWeekDays = (currentDate: Date) => {
    const date = new Date(currentDate);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(new Date(startOfWeek));
        startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
    return weekDays;
};

const getDayStatus = (events: CalendarEvent[]) => {
    if (events.some(e => e.type === CalendarEventType.HOLIDAY)) return 'holiday';
    if (events.some(e => e.type === CalendarEventType.INSTITUTIONAL || e.status === ClassStatus.CANCELED)) return 'canceled';
    if (events.some(e => e.type === CalendarEventType.CLASS)) return 'normal';
    return 'default';
};

const addableEventTypes: { [key in CalendarEventType.HOLIDAY | CalendarEventType.INSTITUTIONAL]: string } = {
    [CalendarEventType.HOLIDAY]: 'Feriado',
    [CalendarEventType.INSTITUTIONAL]: 'Suspensión de Clases',
};


const SchoolCalendarScreen: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [swapCandidate, setSwapCandidate] = useState<CalendarEvent | null>(null);
    const [menuState, setMenuState] = useState<{ event: CalendarEvent; position?: { top: number; left: number } } | null>(null);
    const [expandedHours, setExpandedHours] = useState<string[]>([]);
    const [mobileView, setMobileView] = useState<'calendar' | 'agenda'>('calendar');
    
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCalendarData = async () => {
            const year = currentDate.getFullYear();
            const nationalHolidays = await fetchNationalHolidays(year);
            const nationalHolidayDates = new Set(nationalHolidays.map(h => h.date));
            const institutionalHolidayDates = new Set<string>();

            mockCalendarEvents.forEach(event => {
                if (event.type === CalendarEventType.HOLIDAY || event.type === CalendarEventType.INSTITUTIONAL) {
                    institutionalHolidayDates.add(event.date);
                }
            });

            const allHolidayDates = new Set([...nationalHolidayDates, ...institutionalHolidayDates]);

            const processedEvents = mockCalendarEvents.map(event => {
                if (event.type === CalendarEventType.CLASS && allHolidayDates.has(event.date)) {
                    return { ...event, status: ClassStatus.CANCELED };
                }
                return event;
            });
            
            // Combine mock events with fetched national holidays, avoiding duplicates
            const finalEvents = [...processedEvents];
            nationalHolidays.forEach(holiday => {
                if (!mockCalendarEvents.some(e => e.date === holiday.date && e.title === holiday.title)) {
                    finalEvents.push(holiday);
                }
            });
            
            setEvents(finalEvents.sort((a,b) => a.date.localeCompare(b.date) || (a.startTime || '').localeCompare(b.startTime || '')));
        };
        
        loadCalendarData();
    }, [currentDate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuState(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const eventsByDate = useMemo(() => {
        const grouped: { [key: string]: CalendarEvent[] } = {};
        events.forEach(event => {
            const dateKey = event.date;
            if (!grouped[dateKey]) { grouped[dateKey] = []; }
            grouped[dateKey].push(event);
        });
        return grouped;
    }, [events]);

    const agendaByHour = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const dayEvents = (eventsByDate[dateStr] || []).filter(e => e.type === CalendarEventType.CLASS);
        
        const grouped: { [key: string]: CalendarEvent[] } = {};
        dayEvents.forEach(event => {
            const timeKey = event.startTime || 'Sin hora';
            if (!grouped[timeKey]) { grouped[timeKey] = []; }
            grouped[timeKey].push(event);
        });
        
        const sortedHours = Object.keys(grouped).sort();
        if (sortedHours.length > 0 && expandedHours.length === 0) {
            setExpandedHours([sortedHours[0]]);
        } else if (sortedHours.length === 0) {
            setExpandedHours([]);
        }

        return grouped;
    }, [selectedDate, eventsByDate]);
    
    const nonClassEventsForSelectedDay = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return (eventsByDate[dateStr] || []).filter(e => e.type !== CalendarEventType.CLASS);
    }, [selectedDate, eventsByDate]);

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
        else newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
        else newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
        const fullEvent: CalendarEvent = {
            ...newEvent,
            id: `evt-${Date.now()}`,
        };
        const updatedEvents = events.map(event => {
            if (event.type === CalendarEventType.CLASS && event.date === newEvent.date) {
                return { ...event, status: ClassStatus.CANCELED };
            }
            return event;
        });
        updatedEvents.push(fullEvent);
        setEvents(updatedEvents.sort((a,b) => a.date.localeCompare(b.date) || (a.startTime || '').localeCompare(b.startTime || '')));
    };

    const handleOpenMenu = (event: CalendarEvent, e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const menuWidth = 224; // w-56 in Tailwind
        const screenPadding = 8;

        // Position menu's right edge near the button's right edge
        let left = rect.right - menuWidth;
        // Ensure it doesn't go off the left edge of the screen
        if (left < screenPadding) {
            left = screenPadding;
        }

        setMenuState({ 
            event, 
            position: { 
                top: rect.bottom + 2, 
                left: left
            } 
        });
    };
    
    const handleToggleHour = (hour: string) => {
        setExpandedHours(prev => 
            prev.includes(hour) ? prev.filter(h => h !== hour) : [hour] // Only one open at a time on desktop
        );
    };
    
    const handleToggleHourMobile = (hour: string) => {
        setExpandedHours(prev =>
            prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour] // Allow multiple open on mobile
        );
    };

    const handleTakeAttendance = (eventToAttend: CalendarEvent) => {
        const career = eventToAttend.course?.split(' - ')[0];
        navigate('/tomar-asistencia', { state: { career } });
        setMenuState(null);
    };

    const handleCancelClass = (eventToCancel: CalendarEvent) => {
        setEvents(prev => prev.map(e => e.id === eventToCancel.id ? { ...e, status: ClassStatus.CANCELED } : e));
        setMenuState(null);
    };

    const handleUncancelClass = (eventToRestore: CalendarEvent) => {
        setEvents(prev => prev.map(e => e.id === eventToRestore.id ? { ...e, status: ClassStatus.NORMAL } : e));
        setMenuState(null);
    };
    
    const handleDeleteEvent = (eventToDelete: CalendarEvent) => {
        setEvents(prev => prev.filter(e => e.id !== eventToDelete.id));
        setMenuState(null);
    };

    const handleStartSwap = (eventToSwap: CalendarEvent) => {
        setSwapCandidate(eventToSwap);
        setIsSwapModalOpen(true);
        setMenuState(null);
    };

    const handleConfirmSwap = (event1: CalendarEvent, event2: CalendarEvent) => {
        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            const index1 = newEvents.findIndex(e => e.id === event1.id);
            const index2 = newEvents.findIndex(e => e.id === event2.id);

            if (index1 !== -1 && index2 !== -1) {
                 const original1 = {
                    date: newEvents[index1].date,
                    startTime: newEvents[index1].startTime,
                    endTime: newEvents[index1].endTime,
                };
                const original2 = {
                    date: newEvents[index2].date,
                    startTime: newEvents[index2].startTime,
                    endTime: newEvents[index2].endTime,
                };

                newEvents[index1] = {
                    ...newEvents[index1],
                    date: original2.date,
                    startTime: original2.startTime,
                    endTime: original2.endTime,
                    isSwapped: true,
                    originalDate: original1.date,
                    originalStartTime: original1.startTime,
                    originalEndTime: original1.endTime,
                };

                newEvents[index2] = {
                    ...newEvents[index2],
                    date: original1.date,
                    startTime: original1.startTime,
                    endTime: original1.endTime,
                    isSwapped: true,
                    originalDate: original2.date,
                    originalStartTime: original2.startTime,
                    originalEndTime: original2.endTime,
                };
            }
            return newEvents;
        });
        setIsSwapModalOpen(false);
        setSwapCandidate(null);
    };

    const handleRevertSwap = (eventToRevert: CalendarEvent) => {
        if (!eventToRevert.isSwapped) return;

        const otherSwappedEvent = events.find(e => 
            e.isSwapped &&
            e.date === eventToRevert.originalDate &&
            e.startTime === eventToRevert.originalStartTime &&
            e.originalDate === eventToRevert.date &&
            e.originalStartTime === eventToRevert.startTime
        );

        if (!otherSwappedEvent) {
            alert('No se pudo encontrar la clase correspondiente para revertir el intercambio. Es posible que ya haya sido modificada.');
            setMenuState(null);
            return;
        }

        setEvents(prevEvents => {
            const newEvents = [...prevEvents];
            const index1 = newEvents.findIndex(e => e.id === eventToRevert.id);
            const index2 = newEvents.findIndex(e => e.id === otherSwappedEvent.id);

            if (index1 !== -1 && index2 !== -1) {
                newEvents[index1] = {
                    ...newEvents[index1],
                    date: eventToRevert.originalDate!,
                    startTime: eventToRevert.originalStartTime,
                    endTime: eventToRevert.originalEndTime,
                    isSwapped: undefined,
                    originalDate: undefined,
                    originalStartTime: undefined,
                    originalEndTime: undefined,
                };
                newEvents[index2] = {
                    ...newEvents[index2],
                    date: otherSwappedEvent.originalDate!,
                    startTime: otherSwappedEvent.originalStartTime,
                    endTime: otherSwappedEvent.originalEndTime,
                    isSwapped: undefined,
                    originalDate: undefined,
                    originalStartTime: undefined,
                    originalEndTime: undefined,
                };
            }
            return newEvents;
        });
        setMenuState(null);
    };
    
    // --- Sub-components ---
    const TimetableItem: React.FC<{ event: CalendarEvent }> = ({ event }) => {
        const isCanceled = event.status === ClassStatus.CANCELED;
        const isSwapped = event.isSwapped;

        const originalDateFormatted = event.originalDate 
            ? new Date(event.originalDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
            : '';

        const cardBg = isSwapped ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100';

        return (
            <div className={`w-full text-left ${cardBg} p-3 rounded-lg mb-2 flex items-start justify-between space-x-2 transition-all ${isCanceled ? 'opacity-70' : ''}`}>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-2">
                        {isSwapped && <ArrowsRightLeftIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                        <p className={`font-semibold truncate ${isCanceled ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{event.title}</p>
                    </div>
                    <p className="text-sm text-slate-600 truncate mt-1">{event.course}</p>
                    <p className="text-xs text-slate-500 truncate">{event.professor} - {event.classroom}</p>
                    {isSwapped && (
                        <p className="text-xs text-amber-700 mt-1">
                            Originalmente: {originalDateFormatted} {event.originalStartTime}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    {isCanceled ? (
                        <span className="text-xs h-fit font-semibold text-slate-700 bg-slate-200 px-2 py-1 rounded-full">Cancelada</span>
                    ) : event.attendanceTaken ? (
                        <span className="text-xs h-fit font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">Registrada</span>
                    ) : (
                        <span className="text-xs h-fit font-semibold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">Pendiente</span>
                    )}
                    <div className="relative">
                        <button onClick={(e) => handleOpenMenu(event, e)} className="p-1.5 rounded-full hover:bg-slate-200">
                            <EllipsisVerticalIcon className="w-5 h-5 text-slate-600"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const AddEventModal: React.FC<{ isOpen: boolean; onClose: () => void; onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void; selectedDate: Date; }> = ({ isOpen, onClose, onAddEvent, selectedDate }) => {
        const [type, setType] = useState<CalendarEventType>(CalendarEventType.HOLIDAY);
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');

        if (!isOpen) return null;

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const eventTitle = title.trim() === '' ? addableEventTypes[type as keyof typeof addableEventTypes].split(' (')[0] : title;
            onAddEvent({ date: selectedDate.toISOString().split('T')[0], type, title: eventTitle, description });
            onClose();
            setTitle('');
            setDescription('');
        };
        
        const inputStyle = "w-full p-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:ring-indigo-500 focus:border-indigo-500";
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-bold">Agregar Evento</h3>
                            <p className="text-sm text-slate-500">para el {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="eventType" className="block text-sm font-medium text-slate-700 mb-1">Tipo de Evento</label>
                                <select id="eventType" value={type} onChange={e => setType(e.target.value as CalendarEventType)} className={inputStyle}>
                                    {Object.entries(addableEventTypes).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="eventTitle" className="block text-sm font-medium text-slate-700 mb-1">Nombre (opcional)</label>
                                <input id="eventTitle" type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="eventDesc" className="block text-sm font-medium text-slate-700 mb-1">Descripción (opcional)</label>
                                <textarea id="eventDesc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className={inputStyle}></textarea>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 flex justify-end space-x-2 rounded-b-lg">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const ConfigModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
        const schoolYear = getSchoolYear();
        const [startDate, setStartDate] = useState(schoolYear.startDate || '');
        const [endDate, setEndDate] = useState(schoolYear.endDate || '');
        const [winterStart, setWinterStart] = useState(schoolYear.winterBreakStartDate || '');
        const [winterEnd, setWinterEnd] = useState(schoolYear.winterBreakEndDate || '');

        const startDateRef = useRef<HTMLInputElement>(null);
        const endDateRef = useRef<HTMLInputElement>(null);
        const winterStartRef = useRef<HTMLInputElement>(null);
        const winterEndRef = useRef<HTMLInputElement>(null);

        const handleDateIconClick = (ref: React.RefObject<HTMLInputElement>) => {
            if (ref.current) {
                try {
                    ref.current.showPicker();
                } catch (error) {
                    ref.current.focus();
                }
            }
        };
      
        if (!isOpen) return null;
      
        const handleSave = () => {
          if (startDate && endDate) {
            setSchoolYear(startDate, endDate, winterStart, winterEnd);
            onClose();
            alert('Ciclo lectivo configurado. El total de clases para cada materia ha sido recalculado.');
          } else {
            alert('Por favor, selecciona las fechas de inicio y fin del ciclo.');
          }
        };
      
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex items-center space-x-3">
                    <CalendarDaysIcon className="w-6 h-6 text-indigo-700"/>
                    <div>
                        <h3 className="text-lg font-bold">Configurar Ciclo Lectivo</h3>
                        <p className="text-sm text-slate-500">Define las fechas importantes del año.</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">Inicio del Ciclo</label>
                         <div className="relative">
                            <input ref={startDateRef} type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 pr-10 border border-slate-300 rounded-md bg-white"/>
                            <button type="button" onClick={() => handleDateIconClick(startDateRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de inicio del ciclo">
                                <CalendarDaysIcon className="w-5 h-5" />
                            </button>
                         </div>
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">Fin del Ciclo</label>
                        <div className="relative">
                            <input ref={endDateRef} type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 pr-10 border border-slate-300 rounded-md bg-white"/>
                             <button type="button" onClick={() => handleDateIconClick(endDateRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de fin del ciclo">
                                <CalendarDaysIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <hr className="border-slate-200" />
                    <div>
                        <label htmlFor="winter-start-date" className="block text-sm font-medium text-slate-700 mb-1">Inicio de Receso (Opcional)</label>
                        <div className="relative">
                            <input ref={winterStartRef} type="date" id="winter-start-date" value={winterStart} onChange={e => setWinterStart(e.target.value)} className="w-full p-2 pr-10 border border-slate-300 rounded-md bg-white"/>
                            <button type="button" onClick={() => handleDateIconClick(winterStartRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de inicio de receso">
                                <CalendarDaysIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="winter-end-date" className="block text-sm font-medium text-slate-700 mb-1">Fin de Receso (Opcional)</label>
                        <div className="relative">
                            <input ref={winterEndRef} type="date" id="winter-end-date" value={winterEnd} onChange={e => setWinterEnd(e.target.value)} className="w-full p-2 pr-10 border border-slate-300 rounded-md bg-white"/>
                             <button type="button" onClick={() => handleDateIconClick(winterEndRef)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha de fin de receso">
                                <CalendarDaysIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 flex justify-end space-x-2 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancelar</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold">Guardar Cambios</button>
                </div>
            </div>
          </div>
        );
    };

    const ActionMenuItems: React.FC<{ event: CalendarEvent; itemClassName: string }> = ({ event, itemClassName }) => {
        const isClass = event.type === CalendarEventType.CLASS;
        const isCanceled = isClass && event.status === ClassStatus.CANCELED;
        const isSwapped = event.isSwapped;

        const handleAction = (action: (event: CalendarEvent) => void) => {
            action(event);
        };

        return (
            <div className="divide-y divide-slate-100">
                {isClass && (
                    <>
                        <button onClick={() => handleAction(handleTakeAttendance)} disabled={event.attendanceTaken || isCanceled} className={`${itemClassName} hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed`}><CheckBadgeIcon className="w-5 h-5"/><span>Tomar asistencia</span></button>
                        {isSwapped ? (
                            <button onClick={() => handleAction(handleRevertSwap)} className={`${itemClassName} hover:bg-slate-50`}><ArrowUturnLeftIcon className="w-5 h-5"/><span>Revertir Intercambio</span></button>
                        ) : (
                            <button onClick={() => handleAction(handleStartSwap)} disabled={isCanceled} className={`${itemClassName} hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed`}><ArrowsRightLeftIcon className="w-5 h-5"/><span>Intercambiar clase</span></button>
                        )}
                        {isCanceled ? (
                             <button onClick={() => handleAction(handleUncancelClass)} className={`${itemClassName} text-green-600 hover:bg-green-50`}>
                                <ArrowUturnLeftIcon className="w-5 h-5"/>
                                <span>Descancelar clase</span>
                            </button>
                        ) : (
                            <button onClick={() => handleAction(handleCancelClass)} className={`${itemClassName} text-amber-600 hover:bg-amber-50`}>
                                <XMarkIcon className="w-5 h-5"/>
                                <span>Cancelar clase</span>
                            </button>
                        )}
                    </>
                )}
                {!isClass && (
                    <button onClick={() => handleAction(handleDeleteEvent)} className={`${itemClassName} text-red-600 hover:bg-red-50`}>
                        <TrashIcon className="w-5 h-5"/>
                        <span>Eliminar Evento</span>
                    </button>
                )}
            </div>
        );
    };

    const ActionMenu: React.FC = () => {
        if (!menuState) return null;
        const { event } = menuState;
    
        return (
            <div 
                ref={menuRef} 
                style={{ top: menuState.position?.top, left: menuState.position?.left }} 
                className="fixed bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-56"
            >
                <ActionMenuItems event={event} itemClassName="w-full text-left flex items-center space-x-3 px-4 py-2" />
            </div>
        );
    };

    const SwapClassModal: React.FC<{
        isOpen: boolean; onClose: () => void; onConfirm: (event1: CalendarEvent, event2: CalendarEvent) => void;
        eventToSwap: CalendarEvent | null; allEvents: CalendarEvent[];
    }> = ({ isOpen, onClose, onConfirm, eventToSwap, allEvents }) => {
        const [displayWeek, setDisplayWeek] = useState<Date[]>([]);
        const [targetDate, setTargetDate] = useState<Date | null>(null);
        const [targetEvent, setTargetEvent] = useState<CalendarEvent | null>(null);

        useEffect(() => {
            if (isOpen && eventToSwap) {
                const initialDate = new Date(eventToSwap.date + 'T00:00:00');
                setTargetDate(initialDate);
                setDisplayWeek(getWeekDays(initialDate));
            } else { 
                setTargetDate(null); 
                setTargetEvent(null);
                setDisplayWeek([]); 
            }
        }, [isOpen, eventToSwap]);

        if (!isOpen || !eventToSwap) return null;
        
        const handlePrevWeek = () => {
            const firstDay = displayWeek[0];
            const prevWeekStart = new Date(firstDay.setDate(firstDay.getDate() - 7));
            setDisplayWeek(getWeekDays(prevWeekStart));
            setTargetDate(null);
            setTargetEvent(null);
        };

        const handleNextWeek = () => {
            const firstDay = displayWeek[0];
            const nextWeekStart = new Date(firstDay.setDate(firstDay.getDate() + 7));
            setDisplayWeek(getWeekDays(nextWeekStart));
            setTargetDate(null);
            setTargetEvent(null);
        };

        const potentialSwapTargets = allEvents.filter(e => 
            e.type === CalendarEventType.CLASS && 
            e.status !== ClassStatus.CANCELED && 
            e.date === targetDate?.toISOString().split('T')[0] && 
            e.id !== eventToSwap.id &&
            e.course === eventToSwap.course
        );

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b"><h3 className="text-lg font-bold">Intercambiar Clase</h3></div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Clase de Origen:</h4>
                            <div className="bg-slate-100 p-3 rounded-lg border border-slate-200">
                                <p className="font-bold">{eventToSwap.title}</p>
                                <p className="text-sm">{eventToSwap.course}</p>
                                <p className="text-sm text-slate-500">{new Date(eventToSwap.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })} - {eventToSwap.startTime}</p>
                            </div>
                            <h4 className="font-semibold">Seleccionar Fecha de Destino:</h4>
                            <div className="bg-slate-50 p-2 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <button onClick={handlePrevWeek} className="p-1 hover:bg-slate-200 rounded-full"><ChevronLeftIcon className="w-5 h-5"/></button>
                                    <span className="font-semibold text-sm">
                                        {displayWeek.length > 0 ? `${monthNames[displayWeek[0].getMonth()]} ${displayWeek[0].getFullYear()}` : ''}
                                    </span>
                                    <button onClick={handleNextWeek} className="p-1 hover:bg-slate-200 rounded-full"><ChevronRightIcon className="w-5 h-5"/></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {displayWeek.filter(d => d.getDay() > 0 && d.getDay() < 6).map(day => (
                                        <button key={day.toISOString()} onClick={() => { setTargetDate(day); setTargetEvent(null); }} className={`flex-1 px-3 py-1.5 rounded-md text-sm font-semibold border-2 ${targetDate?.toISOString().split('T')[0] === day.toISOString().split('T')[0] ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'}`}>
                                            {day.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Seleccionar Clase de Destino:</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {potentialSwapTargets.length > 0 ? potentialSwapTargets.map(target => (
                                    <button key={target.id} onClick={() => setTargetEvent(target)} className={`w-full text-left p-3 rounded-lg border-2 ${targetEvent?.id === target.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                        <p className="font-semibold">{target.startTime} - {target.title}</p>
                                        <p className="text-sm text-slate-500">{target.course}</p>
                                    </button>
                                )) : <p className="text-sm text-slate-500 text-center py-4">No hay clases de la misma carrera/año para intercambiar en este día.</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 flex justify-end space-x-2 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancelar</button>
                        <button type="button" onClick={() => onConfirm(eventToSwap, targetEvent!)} disabled={!targetEvent} className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold disabled:bg-slate-400 disabled:cursor-not-allowed">Confirmar Intercambio</button>
                    </div>
                </div>
            </div>
        );
    };
    
    // --- Render Logic ---
    const ColorLegend = () => (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-2 mb-2"><InformationCircleIcon className="w-5 h-5 text-slate-500" /><h3 className="font-semibold text-slate-700">Leyenda</h3></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span>Clase Normal</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Feriado</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span>Clases Suspendidas</span></div>
            </div>
        </div>
    );
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthDays = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const firstDayOfMonth = monthDays.length > 0 ? monthDays[0].getDay() : 0;
    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
    const dotColors: { [key: string]: string } = { 'normal': 'bg-indigo-500', 'holiday': 'bg-red-500', 'canceled': 'bg-slate-400' };

    const CalendarDay: React.FC<{ day: Date, isMini?: boolean }> = ({ day, isMini }) => {
        const dayStr = day.toISOString().split('T')[0];
        const isSelected = dayStr === selectedDate.toISOString().split('T')[0];
        const isToday = dayStr === new Date().toISOString().split('T')[0];
        const status = getDayStatus(eventsByDate[dayStr] || []);
        let cellClass = 'hover:bg-slate-100 text-slate-700';
        if (isSelected) cellClass = 'bg-indigo-700 text-white font-bold shadow';
        else if (isToday) cellClass = 'bg-indigo-100 text-indigo-700 font-bold';
        
        const sizeClass = isMini ? 'w-10 h-10' : 'w-12 h-12';
        const spanSize = isMini ? 'w-8 h-8' : 'w-10 h-10';

        return (
            <button onClick={() => setSelectedDate(day)} className={`${sizeClass} flex flex-col items-center justify-center rounded-full transition-colors text-sm`}>
                <span className={`${spanSize} rounded-full flex items-center justify-center ${cellClass}`}>{day.getDate()}</span>
                 {status !== 'default' && !isSelected && <div className={`-mt-1 w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></div>}
            </button>
        );
    };

    const sortedAgendaHours = Object.keys(agendaByHour).sort();

    return (
        <div className="space-y-6">
            {/* DESKTOP VIEW */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-5 h-5"/></button>
                            <h2 className="text-lg font-bold text-indigo-800 text-center">{viewMode === 'month' ? `${monthNames[month]} ${year}` : `Semana del ${weekDays[0].getDate()}`}</h2>
                            <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-5 h-5"/></button>
                        </div>
                        <div className="flex space-x-1 bg-slate-100 p-1 rounded-full mb-2">
                            <button onClick={() => setViewMode('month')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'month' ? 'bg-white shadow font-semibold' : ''}`}>Mes</button>
                            <button onClick={() => setViewMode('week')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'week' ? 'bg-white shadow font-semibold' : ''}`}>Semana</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">{daysOfWeek.map(day => <div key={day}>{day}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {viewMode === 'month' ? (
                                <>{Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}{monthDays.map(day => <CalendarDay key={day.toISOString()} day={day} isMini />)}</>
                            ) : (
                                weekDays.map(day => <CalendarDay key={day.toISOString()} day={day} isMini />)
                            )}
                        </div>
                    </div>
                    <ColorLegend />
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-3">Eventos del día</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {nonClassEventsForSelectedDay.length > 0 ? nonClassEventsForSelectedDay.map(event => (
                                <div key={event.id} className="bg-slate-100 p-3 rounded-lg text-center">
                                    <p className="font-semibold text-slate-700">{event.title}</p>
                                    {event.description && <p className="text-sm text-slate-500">{event.description}</p>}
                                </div>
                            )) : <p className="text-sm text-center text-slate-500 py-4">No hay eventos para este día.</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setAddEventModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors text-sm">
                            <PlusIcon className="w-4 h-4" /><span>Agregar Evento</span>
                        </button>
                        <button onClick={() => setIsConfigModalOpen(true)} className="w-full flex items-center justify-center space-x-2 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors text-sm">
                            <CalendarDaysIcon className="w-4 h-4" /><span>Ciclo Lectivo</span>
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2">
                     <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                        <div className="pb-4 border-b border-slate-200">
                             <h3 className="text-xl font-bold">Agenda del {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                        </div>
                        <div className="mt-6 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-3">
                           {sortedAgendaHours.length > 0 ? sortedAgendaHours.map(hour => (
                                <div key={hour}>
                                    <button onClick={() => handleToggleHour(hour)} className="w-full flex justify-between items-center text-left p-3 bg-slate-50 rounded-lg">
                                        <h4 className="font-bold text-indigo-700">{hour} hs</h4>
                                        {expandedHours.includes(hour) ? <ChevronUpIcon className="w-5 h-5 text-indigo-700"/> : <ChevronDownIcon className="w-5 h-5 text-indigo-700"/>}
                                    </button>
                                    {expandedHours.includes(hour) && (
                                        <div className="pt-3">
                                            {agendaByHour[hour].map(event => <TimetableItem key={event.id} event={event} />)}
                                        </div>
                                    )}
                                </div>
                           )) : (
                             <div className="flex items-center justify-center h-80 text-center text-slate-500"><p>No hay clases programadas para este día.</p></div>
                           )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden space-y-4">
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-full">
                    <button onClick={() => setMobileView('calendar')} className={`flex-1 py-2 text-sm rounded-full ${mobileView === 'calendar' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Calendario</button>
                    <button onClick={() => setMobileView('agenda')} className={`flex-1 py-2 text-sm rounded-full ${mobileView === 'agenda' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Agenda</button>
                </div>

                {mobileView === 'calendar' && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                             <div className="flex justify-between items-center mb-2">
                                <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-5 h-5"/></button>
                                <h2 className="text-lg font-bold text-indigo-800 text-center">{viewMode === 'month' ? `${monthNames[month]} ${year}` : `Semana del ${weekDays[0].getDate()}`}</h2>
                                <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-5 h-5"/></button>
                            </div>
                            <div className="flex space-x-1 bg-slate-100 p-1 rounded-full mb-2">
                                <button onClick={() => setViewMode('month')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'month' ? 'bg-white shadow font-semibold' : ''}`}>Mes</button>
                                <button onClick={() => setViewMode('week')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'week' ? 'bg-white shadow font-semibold' : ''}`}>Semana</button>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">{daysOfWeek.map(day => <div key={day}>{day}</div>)}</div>
                            <div className="grid grid-cols-7 gap-1 place-items-center">
                                {viewMode === 'month' ? (
                                    <>{Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}{monthDays.map(day => <CalendarDay key={day.toISOString()} day={day} />)}</>
                                ) : (
                                    weekDays.map(day => <CalendarDay key={day.toISOString()} day={day} />)
                                )}
                            </div>
                        </div>
                        <ColorLegend />
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Eventos del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</h3>
                            <div className="space-y-2">
                                {nonClassEventsForSelectedDay.length > 0 ? nonClassEventsForSelectedDay.map(event => (
                                    <div key={event.id} className="bg-slate-100 p-3 rounded-lg text-center">
                                        <p className="font-semibold text-slate-700">{event.title}</p>
                                        {event.description && <p className="text-sm text-slate-500">{event.description}</p>}
                                    </div>
                                )) : <p className="text-sm text-center text-slate-500 py-4">No hay eventos para este día.</p>}
                            </div>
                        </div>
                        <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
                            <button onClick={() => setIsConfigModalOpen(true)} className="bg-slate-800 text-white p-4 rounded-full shadow-lg hover:bg-slate-900">
                                <CalendarDaysIcon className="w-6 h-6"/>
                            </button>
                            <button onClick={() => setAddEventModalOpen(true)} className="bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:bg-indigo-800">
                                <PlusIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
                
                {mobileView === 'agenda' && (
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="pb-4 border-b border-slate-200">
                             <h3 className="text-lg font-bold">Agenda del {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                        </div>
                        <div className="mt-4 space-y-4">
                           {sortedAgendaHours.length > 0 ? sortedAgendaHours.map(hour => (
                                <div key={hour}>
                                    <button onClick={() => handleToggleHourMobile(hour)} className="w-full flex justify-between items-center text-left p-3 bg-slate-50 rounded-lg">
                                        <h4 className="font-bold text-indigo-700">{hour} hs</h4>
                                        {expandedHours.includes(hour) ? <ChevronUpIcon className="w-5 h-5 text-indigo-700"/> : <ChevronDownIcon className="w-5 h-5 text-indigo-700"/>}
                                    </button>
                                    {expandedHours.includes(hour) && (
                                        <div className="pt-3">
                                            {agendaByHour[hour].map(event => <TimetableItem key={event.id} event={event} />)}
                                        </div>
                                    )}
                                </div>
                           )) : (
                             <div className="flex items-center justify-center h-60 text-center text-slate-500"><p>No hay clases programadas.</p></div>
                           )}
                        </div>
                    </div>
                )}
            </div>
            
            <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setAddEventModalOpen(false)} onAddEvent={handleAddEvent} selectedDate={selectedDate} />
            <ConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} />
            <SwapClassModal isOpen={isSwapModalOpen} onClose={() => setIsSwapModalOpen(false)} onConfirm={handleConfirmSwap} eventToSwap={swapCandidate} allEvents={events} />
            <ActionMenu />
        </div>
    );
};

export default SchoolCalendarScreen;
