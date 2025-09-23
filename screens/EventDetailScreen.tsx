import React from 'react';
import { useLocation } from 'react-router-dom';
import { Event, EventStatus } from '../types';
import { CalendarIcon, MapPinIcon, ArrowDownTrayIcon } from '../components/Icons';

interface EventDetailScreenProps {
    event?: Event;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4">
        <Icon className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
        <div>
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-base text-slate-900">{value}</dd>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
    const isActive = status === EventStatus.ACTIVE;
    const colorClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800';
    return (
        <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${colorClasses}`}>
            {isActive ? 'Activo' : 'Inactivo'}
        </span>
    );
};

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ event: propEvent }) => {
    const location = useLocation();
    const event = propEvent || location.state?.event as Event;

    if (!event) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-bold">Evento no encontrado</h2>
                <p className="text-slate-500 mt-2">Por favor, vuelve a la lista y selecciona un evento.</p>
            </div>
        );
    }

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(event.qrCodeData)}`;

    const handleDownload = async () => {
        try {
            const response = await fetch(qrImageUrl);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `qr-evento-${event.name.replace(/\s+/g, '-')}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('No se pudo descargar el código QR. Por favor, intenta de nuevo.');
        }
    };


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-start border-b border-slate-200 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2 md:mb-0">{event.name}</h1>
                    <StatusBadge status={event.status} />
                </div>
                
                <dl className="space-y-6">
                    <DetailItem
                        icon={CalendarIcon}
                        label="Fecha"
                        value={new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    />
                    <DetailItem
                        icon={MapPinIcon}
                        label="Ubicación"
                        value={
                            <button
                                onClick={() => alert(`Simulando apertura de mapa para: ${event.location}`)}
                                className="text-indigo-600 hover:underline text-left font-semibold"
                            >
                                {event.location}
                            </button>
                        }
                    />
                    <div>
                        <dt className="text-sm font-medium text-slate-500 mb-2">Descripción</dt>
                        <dd className="text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md">
                            {event.description}
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Código QR del Evento</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Los estudiantes escanearán este código para registrar su asistencia. Puedes descargarlo para imprimirlo.
                </p>
                <div className="my-4 p-4 border rounded-lg inline-block bg-white">
                    <img src={qrImageUrl} alt={`Código QR para ${event.name}`} width="256" height="256" />
                </div>
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleDownload}
                        className="w-full md:w-auto flex items-center justify-center space-x-2 bg-slate-200 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Descargar QR</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailScreen;