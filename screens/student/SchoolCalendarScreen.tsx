import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockCalendarEvents, mockStudentWeeklySchedule, mockStudentSubjects } from '../../data';
import { CalendarEvent, ClassStatus, CalendarEventType } from '../../types';
import { 
    ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon,
} from '../../components/Icons';

// --- Helper Functions & Constants ---
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dayMapForSchedule = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

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
    date.setHours(0, 0, 0, 0); // Normalize time
    const day = date.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const startOfWeek = new Date(date.setDate(diff));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        weekDays.push(new Date(startOfWeek));
        startOfWeek.setDate(startOfWeek.getDate() + 1);
    }
    return weekDays;
};

const getDayStatus = (day: Date, nonClassEventsForDay: CalendarEvent[]) => {
    if (nonClassEventsForDay.some(e => e.type === CalendarEventType.HOLIDAY)) return 'holiday';
    if (nonClassEventsForDay.some(e => e.type === CalendarEventType.INSTITUTIONAL)) return 'canceled';

    const dayOfWeek = day.getDay(); // 0-6 (Sun-Sat)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const dayName = dayMapForSchedule[dayOfWeek - 1];
        if (mockStudentWeeklySchedule[dayName]?.length > 0) {
            return 'normal';
        }
    }
    
    return 'default';
};


// --- Sub-components ---

const subjectColors: { [key: string]: { bg: string; accent: string } } = {
    'Programación I': { bg: 'bg-red-50', accent: 'bg-red-500' },
    'Álgebra Lineal': { bg: 'bg-green-50', accent: 'bg-green-500' },
    'Inglés Técnico I': { bg: 'bg-yellow-50', accent: 'bg-yellow-500' },
    'Análisis Matemático': { bg: 'bg-indigo-50', accent: 'bg-indigo-500' },
    'Análisis Matemático II': { bg: 'bg-indigo-50', accent: 'bg-indigo-500' },
    'Diseño Web': { bg: 'bg-purple-50', accent: 'bg-purple-500' },
    'Sistemas Operativos': { bg: 'bg-orange-50', accent: 'bg-orange-500' },
    'Bases de Datos': { bg: 'bg-pink-50', accent: 'bg-pink-500' },
    'Práctica Profesional': { bg: 'bg-cyan-50', accent: 'bg-cyan-500' },
    'Programación Web Avanzada': { bg: 'bg-purple-50', accent: 'bg-purple-500' },
    'Seguridad Informática': { bg: 'bg-rose-50', accent: 'bg-rose-500' },
    'Laboratorio de Hardware': { bg: 'bg-lime-50', accent: 'bg-lime-500' },
    'Redes de Computadoras': { bg: 'bg-teal-50', accent: 'bg-teal-500' },
    'Ética y Deontología Profesional': { bg: 'bg-gray-50', accent: 'bg-gray-400' },
    'default': { bg: 'bg-slate-100', accent: 'bg-slate-400' }
};

const ClassItem: React.FC<{ item: { id: number; subject: string; time: string }, isCanceled?: boolean }> = ({ item, isCanceled }) => {
    const colors = subjectColors[item.subject] || subjectColors['default'];
    const subjectData = mockStudentSubjects.find(s => s.name === item.subject);
    
    return (
        <Link 
            to={subjectData ? `/materia-detalle/${subjectData.id}` : '#'}
            className={`flex items-center space-x-3 p-3 ${colors.bg} rounded-lg hover:shadow-md hover:scale-[1.02] transition-all ${isCanceled ? 'opacity-60' : ''}`}
        >
            <div className={`w-1.5 h-10 ${colors.accent} rounded-full`}></div>
            <div className="flex-grow min-w-0">
                <p className={`font-semibold text-sm text-slate-800 truncate ${isCanceled ? 'line-through' : ''}`}>{item.subject}</p>
                <p className="text-xs text-slate-500">{item.time}</p>
            </div>
            {isCanceled && <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-2 py-1 rounded-full flex-shrink-0">Cancelada</span>}
        </Link>
    );
};

const ColorLegend = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 mb-2">
            <InformationCircleIcon className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-slate-700">Leyenda</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div><span>Día con Clases</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Feriado</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div><span>Sin Actividad</span></div>
        </div>
    </div>
);

// --- Main Screen ---
const StudentSchoolCalendarScreen: React.FC = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [nonClassEvents, setNonClassEvents] = useState<CalendarEvent[]>([]);
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        // Only keep non-class events for the calendar display (holidays, etc.)
        const filtered = mockCalendarEvents.filter(event => event.type !== CalendarEventType.CLASS);
        setNonClassEvents(filtered);
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthDays = useMemo(() => getDaysInMonth(year, month), [year, month]);
    const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
    const firstDayOfMonth = monthDays.length > 0 ? monthDays[0].getDay() : 0;

    const eventsByDate = useMemo(() => {
        const grouped: { [key: string]: CalendarEvent[] } = {};
        nonClassEvents.forEach(event => {
            const dateKey = event.date;
            if (!grouped[dateKey]) { grouped[dateKey] = []; }
            grouped[dateKey].push(event);
        });
        return grouped;
    }, [nonClassEvents]);
    
    const handlePrev = () => {
        if (viewMode === 'month') setCurrentDate(new Date(year, month - 1, 1));
        else { const d = new Date(currentDate); d.setDate(currentDate.getDate() - 7); setCurrentDate(d); }
    };
    const handleNext = () => {
        if (viewMode === 'month') setCurrentDate(new Date(year, month + 1, 1));
        else { const d = new Date(currentDate); d.setDate(currentDate.getDate() + 7); setCurrentDate(d); }
    };
    const handleDateClick = (day: Date) => setSelectedDate(day);
    
    const dotColors: { [key: string]: string } = {
        'normal': 'bg-indigo-500',
        'holiday': 'bg-red-500',
        'canceled': 'bg-slate-400',
    };

    const DayCell: React.FC<{ day: Date; isMini?: boolean; }> = ({ day, isMini }) => {
        const dayStr = day.toISOString().split('T')[0];
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = dayStr === todayStr;
        const isSelected = selectedDate && dayStr === selectedDate.toISOString().split('T')[0];
        const dayEvents = eventsByDate[dayStr] || [];
        const status = getDayStatus(day, dayEvents);
        const baseClass = `w-full flex flex-col items-center justify-center rounded-lg transition-colors text-sm cursor-pointer ${isMini ? 'h-10' : 'h-12'}`;
        let cellClass = 'text-slate-800 hover:bg-slate-100';
        if (isSelected) cellClass = 'bg-indigo-700 text-white font-bold shadow-md';
        else if (isToday) cellClass = 'text-indigo-700 font-bold bg-indigo-50';
        return (
            <button onClick={() => handleDateClick(day)} className={`${baseClass} ${cellClass}`}>
                <span>{day.getDate()}</span>
                {status !== 'default' && !isSelected && <div className={`mt-1 w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></div>}
            </button>
        );
    };
    
    const DailyAgenda: React.FC = () => {
        if (!selectedDate) return null;

        const dayStr = selectedDate.toISOString().split('T')[0];
        const otherEvents = eventsByDate[dayStr] || [];
        const isHolidayOrCanceled = otherEvents.some(e => e.type === CalendarEventType.HOLIDAY || e.type === CalendarEventType.INSTITUTIONAL);

        const dayMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayOfWeekName = dayMap[selectedDate.getDay()];
        const classEvents = mockStudentWeeklySchedule[dayOfWeekName] || [];

        return (
            <>
                {otherEvents.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Eventos del Día</h3>
                        <div className="space-y-2">
                            {otherEvents.map(event => (
                                <div key={event.id} className="bg-slate-100 p-3 rounded-lg text-center">
                                    <p className="font-semibold text-slate-700">{event.title}</p>
                                    {event.description && <p className="text-sm text-slate-500">{event.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">
                           Horario del día
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {classEvents.map(item => <div key={item.id}><ClassItem item={item} isCanceled={isHolidayOrCanceled} /></div>)}
                    </div>
                    
                    {classEvents.length === 0 && (
                        <p className="text-center text-slate-500 py-8">No hay clases programadas para este día.</p>
                    )}
                </div>
            </>
        );
    };

    const MobileLayout = () => (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <h2 className="text-xl font-bold text-indigo-800">{viewMode === 'month' ? `${monthNames[month]} ${year}` : `Semana del ${weekDays[0].getDate()}`}</h2>
                    <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-6 h-6"/></button>
                </div>
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-full mb-4">
                    <button onClick={() => setViewMode('month')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'month' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Mes</button>
                    <button onClick={() => setViewMode('week')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'week' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Semana</button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">{daysOfWeek.map(day => <div key={day}>{day}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">
                    {viewMode === 'month' ? (
                        <>{Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}{monthDays.map(day => <div key={day.toString()}><DayCell day={day} /></div>)}</>
                    ) : (
                        weekDays.map(day => <div key={day.toString()}><DayCell day={day} /></div>)
                    )}
                </div>
            </div>
            <ColorLegend />
            {selectedDate && <DailyAgenda />}
        </div>
    );
    
    const DesktopLayout = () => {
        const dayStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
        const otherEvents = eventsByDate[dayStr] || [];

        const dayMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayOfWeekName = selectedDate ? dayMap[selectedDate.getDay()] : '';
        const classEvents = mockStudentWeeklySchedule[dayOfWeekName] || [];
        const isHolidayOrCanceled = otherEvents.some(e => e.type === CalendarEventType.HOLIDAY || e.type === CalendarEventType.INSTITUTIONAL);

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><ChevronLeftIcon className="w-5 h-5"/></button>
                            <h2 className="text-lg font-bold text-indigo-800 text-center">{viewMode === 'month' ? `${monthNames[month]} ${year}` : `Semana del ${weekDays[0].getDate()} de ${monthNames[weekDays[0].getMonth()]}`}</h2>
                            <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><ChevronRightIcon className="w-5 h-5"/></button>
                        </div>
                         <div className="flex space-x-1 bg-slate-100 p-1 rounded-full mb-4">
                            <button onClick={() => setViewMode('month')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'month' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Mes</button>
                            <button onClick={() => setViewMode('week')} className={`flex-1 py-1 text-sm rounded-full ${viewMode === 'week' ? 'bg-white shadow font-semibold' : 'hover:bg-slate-200'}`}>Semana</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 mb-2">{daysOfWeek.map(day => <div key={day}>{day}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1">
                            {viewMode === 'month' ? (<>{Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}{monthDays.map(day => <div key={day.toString()}><DayCell day={day} isMini /></div>)}</>) : (weekDays.map(day => <div key={day.toString()}><DayCell day={day} isMini /></div>))}
                        </div>
                    </div>
                    <ColorLegend />
                    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-700">Eventos del día</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {otherEvents.length > 0 ? (
                                otherEvents.map(event => (
                                    <div key={event.id} className="bg-slate-100 p-3 rounded-lg text-center">
                                        <p className="font-semibold text-slate-700">{event.title}</p>
                                        {event.description && <p className="text-sm text-slate-500">{event.description}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-center text-slate-500 py-4">No hay otros eventos para este día.</p>
                            )}
                        </div>
                    </div>

                </div>
                <div className="lg:col-span-2">
                    {selectedDate && (
                        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
                            <div className="pb-4 border-b border-slate-200">
                                 <h3 className="text-xl font-bold">Agenda del {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                            </div>
                            <div className="mt-6 space-y-3">
                                {classEvents.map(item => <div key={item.id}><ClassItem item={item} isCanceled={isHolidayOrCanceled} /></div>)}
                            </div>
                            {classEvents.length === 0 && (<div className="flex items-center justify-center h-80 text-center text-slate-500"><p>No hay clases programadas para este día.</p></div>)}
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <div className="lg:hidden"><MobileLayout /></div>
            <div className="hidden lg:block"><DesktopLayout /></div>
        </div>
    );
};

export default StudentSchoolCalendarScreen;