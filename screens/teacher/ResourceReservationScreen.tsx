import React, { useState, useMemo, useEffect } from 'react';
import { fetchResources, fetchReservations, fetchTeacherSubjects } from '../../db';
import { mockTeacherUser } from '../../data';
import { Resource, ResourceType, Reservation, TeacherSubject } from '../../types';
import { TrashIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

type Tab = 'new' | 'mine';

const timeSlots = Array.from({ length: 14 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`); // 08:00 to 21:00

const ResourceReservationScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('new');
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [teacherSubjects, setTeacherSubjects] = useState<TeacherSubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | ''>('');
    const [selectedResourceId, setSelectedResourceId] = useState('');
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    useEffect(() => {
        Promise.all([
            fetchReservations(),
            fetchResources(),
            fetchTeacherSubjects(),
        ]).then(([resData, rscData, subData]) => {
            setReservations(resData);
            setResources(rscData);
            setTeacherSubjects(subData);
            setIsLoading(false);
        });
    }, []);

    const availableResources = useMemo(() => {
        if (!selectedResourceType) return [];
        return resources.filter(r => r.type === selectedResourceType);
    }, [selectedResourceType, resources]);

    const bookedSlots = useMemo(() => {
        if (!selectedResourceId || !selectedDate) return [];
        const slots = new Set<string>();
        reservations
            .filter(r => r.resourceId === selectedResourceId && r.date === selectedDate)
            .forEach(r => {
                const start = timeSlots.indexOf(r.startTime);
                const end = timeSlots.indexOf(r.endTime);
                if (start !== -1 && end !== -1) {
                    for (let i = start; i < end; i++) {
                        slots.add(timeSlots[i]);
                    }
                }
            });
        return slots;
    }, [selectedResourceId, selectedDate, reservations]);

    const handleSlotClick = (slot: string) => {
        setSelectedSlots(prev => {
            if (prev.includes(slot)) {
                return prev.filter(s => s !== slot);
            }
            const newSelection = [...prev, slot].sort();
            // Check for consecutiveness
            for (let i = 0; i < newSelection.length - 1; i++) {
                const currentIndex = timeSlots.indexOf(newSelection[i]);
                const nextIndex = timeSlots.indexOf(newSelection[i+1]);
                if (nextIndex !== currentIndex + 1) {
                    return [slot];
                }
            }
            return newSelection;
        });
    };

    const handleReservation = () => {
        if (!selectedResourceId || selectedSlots.length === 0 || !selectedSubject) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const sortedSlots = selectedSlots.sort();
        const startTime = sortedSlots[0];
        const lastSlotIndex = timeSlots.indexOf(sortedSlots[sortedSlots.length - 1]);
        const endTime = timeSlots[lastSlotIndex + 1] || '22:00';

        const newReservation: Reservation = {
            id: `res-${Date.now()}`,
            resourceId: selectedResourceId,
            teacherId: mockTeacherUser.legajo,
            teacherName: mockTeacherUser.name,
            subject: selectedSubject,
            date: selectedDate,
            startTime,
            endTime,
        };

        setReservations(prev => [...prev, newReservation]);
        alert('Reserva confirmada con éxito.');
        setSelectedSlots([]);
        setSelectedSubject('');
    };
    
    const handleCancelReservation = (reservationId: string) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            setReservations(prev => prev.filter(r => r.id !== reservationId));
        }
    };

    const myReservations = useMemo(() => {
        return reservations
            .filter(r => r.teacherId === mockTeacherUser.legajo)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [reservations]);
    
    const inputStyle = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500";
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Reserva de Recursos</h1>
                <p className="text-slate-500 mt-1">Reserva proyectores o salas de computadoras para tus clases.</p>
            </div>

            <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setActiveTab('new')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'new' ? 'bg-white shadow' : ''}`}>Nueva Reserva</button>
                <button onClick={() => setActiveTab('mine')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'mine' ? 'bg-white shadow' : ''}`}>Mis Reservas</button>
            </div>

            {activeTab === 'new' && (
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="res-type" className="text-sm font-medium">1. Tipo de Recurso</label>
                            <select id="res-type" value={selectedResourceType} onChange={e => { setSelectedResourceType(e.target.value as ResourceType); setSelectedResourceId(''); }} className={inputStyle}>
                                <option value="">Seleccionar tipo...</option>
                                <option value={ResourceType.PROJECTOR}>Proyectores</option>
                                <option value={ResourceType.COMPUTER_LAB}>Salas de Computadoras</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="res-id" className="text-sm font-medium">2. Recurso Específico</label>
                            <select id="res-id" value={selectedResourceId} onChange={e => setSelectedResourceId(e.target.value)} className={inputStyle} disabled={!selectedResourceType}>
                                <option value="">Seleccionar recurso...</option>
                                {availableResources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="res-date" className="text-sm font-medium">3. Fecha</label>
                            <input type="date" id="res-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={inputStyle} />
                        </div>
                    </div>

                    {selectedResourceId && selectedDate && (
                        <div className="pt-4 border-t">
                             <h3 className="text-lg font-semibold mb-3">4. Seleccionar Horario</h3>
                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {timeSlots.map(slot => {
                                    const isBooked = bookedSlots.has(slot);
                                    const isSelected = selectedSlots.includes(slot);
                                    let statusClasses = 'bg-green-50 text-green-800 hover:bg-green-100';
                                    if (isBooked) statusClasses = 'bg-slate-200 text-slate-500 cursor-not-allowed';
                                    if (isSelected) statusClasses = 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400';
                                    
                                    return <button key={slot} disabled={isBooked} onClick={() => handleSlotClick(slot)} className={`p-2 text-sm rounded-md transition-colors text-center ${statusClasses}`}>{slot}</button>
                                })}
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                    <label htmlFor="res-subject" className="text-sm font-medium">5. Materia</label>
                                    <select id="res-subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className={inputStyle} disabled={selectedSlots.length === 0}>
                                        <option value="">Seleccionar materia...</option>
                                        {teacherSubjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="self-end">
                                    <button onClick={handleReservation} className="w-full bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 disabled:bg-slate-400" disabled={!selectedSubject || selectedSlots.length === 0}>
                                        Confirmar Reserva
                                    </button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'mine' && (
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                    {myReservations.length > 0 ? myReservations.map(res => {
                        const resource = resources.find(r => r.id === res.resourceId);
                        return (
                            <div key={res.id} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{resource?.name}</p>
                                    <p className="text-sm text-slate-600">{res.subject}</p>
                                    <p className="text-xs text-slate-500">{new Date(res.date + 'T00:00:00').toLocaleDateString('es-ES', {weekday: 'long', day: 'numeric', month: 'long'})} de {res.startTime} a {res.endTime}</p>
                                </div>
                                <button onClick={() => handleCancelReservation(res.id)} className="p-2 text-slate-500 hover:text-red-600"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        )
                    }) : (
                        <p className="text-center text-slate-500 py-8">No tienes reservas activas.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResourceReservationScreen;
