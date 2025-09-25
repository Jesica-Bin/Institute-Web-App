import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventStatus, Event } from '../types';
import { MapPinIcon, XMarkIcon, CrosshairsIcon, CalendarDaysIcon } from '../components/Icons';

// --- Sub-component for the Map Modal ---
interface MapPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

const MapPickerModal: React.FC<MapPickerModalProps> = ({ isOpen, onClose, onLocationSelect }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        // In a real app, you'd get the current map center's coordinates and reverse-geocode them.
        // For this mock, we'll use static data.
        const mockLocation = {
            lat: -34.6083,
            lng: -58.3712,
            address: 'Av. de Mayo 525, C1083 CABA',
        };
        onLocationSelect(mockLocation);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">Seleccionar Ubicación</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="p-4 relative h-96 bg-slate-200">
                    {/* Fake Map Image */}
                    <img 
                        src="https://placehold.co/800x600/e2e8f0/475569?text=Mapa+(Simulado)"
                        alt="Mapa simulado"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Center Marker */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <CrosshairsIcon className="w-10 h-10 text-indigo-600 drop-shadow-lg" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-b-xl text-center">
                    <p className="text-sm text-slate-600 mb-4">Mueve el mapa para centrar el marcador en la ubicación del evento.</p>
                    <button
                        onClick={handleConfirm}
                        className="w-full sm:w-auto px-8 py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        Confirmar Ubicación
                    </button>
                </div>
            </div>
        </div>
    );
};


const CreateEventScreen: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const dateRef = useRef<HTMLInputElement>(null);

    const handleDateIconClick = () => {
        if (dateRef.current) {
            try {
                dateRef.current.showPicker();
            } catch (error) {
                // For browsers that don't support showPicker(), focus the input.
                dateRef.current.focus();
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: Event = {
            id: `evt${Date.now()}`,
            name,
            description,
            date,
            location,
            status: EventStatus.INACTIVE,
            qrCodeData: `EVENT-${name.replace(/\s+/g, '_').toUpperCase()}-${Date.now()}`,
            latitude: latitude || -34.6037, // Default mock coordinates if none selected
            longitude: longitude || -58.3816,
        };

        navigate('/evento-qr', { state: { event: newEvent, fromCreation: true } });
    };

    const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
        setLatitude(loc.lat);
        setLongitude(loc.lng);
        setLocation(loc.address);
        setMapModalOpen(false);
    };

    const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre del evento</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className={inputStyle} placeholder="Ej: Charla de IA" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className={inputStyle} placeholder="Una charla sobre..." />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                             <div className="relative">
                                <input
                                    ref={dateRef}
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    required
                                    className={`${inputStyle} pr-10`}
                                />
                                <button type="button" onClick={handleDateIconClick} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600" aria-label="Seleccionar fecha">
                                    <CalendarDaysIcon className="w-5 h-5" />
                                </button>
                             </div>
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
                             <div className="flex items-center space-x-2">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        readOnly
                                        onClick={() => setMapModalOpen(true)}
                                        placeholder="Seleccionar en el mapa..."
                                        required
                                        className={`${inputStyle} pl-10 cursor-pointer`}
                                    />
                                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMapModalOpen(true)}
                                    className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-semibold py-3 px-4 rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    Abrir Mapa
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="w-full md:w-auto md:px-8 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                                Generar QR y Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <MapPickerModal
                isOpen={isMapModalOpen}
                onClose={() => setMapModalOpen(false)}
                onLocationSelect={handleLocationSelect}
            />
        </>
    );
};

export default CreateEventScreen;