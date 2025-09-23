import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { ArrowDownTrayIcon, QrCodeIcon } from '../components/Icons';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500">Generando código QR...</p>
    </div>
);

const EventQRCodeScreen: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { event, fromCreation } = location.state as { event: Event, fromCreation?: boolean };
    
    // Only show loading state if the event is being newly created.
    const [isLoading, setIsLoading] = useState(!!fromCreation);

    useEffect(() => {
        // This timer only runs for new events to simulate generation.
        if (fromCreation) {
            const timer = setTimeout(() => setIsLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [fromCreation]);

    if (!event) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró el evento. Vuelve a crearlo.</div>;
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

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/gestion-eventos', { replace: true });
        }
    };

    const handleFinish = () => {
        if (fromCreation) {
            // Pass the newly created event to the management screen
            navigate('/gestion-eventos', { state: { newEvent: event } });
        } else {
            // Just go back to the previous screen (EventDetail)
            handleBack();
        }
    };
    
    return (
        <div className="max-w-md mx-auto text-center space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm min-h-[480px] flex flex-col justify-center">
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <QrCodeIcon className="w-16 h-16 text-indigo-600 mx-auto" />
                        <h1 className="text-2xl font-bold text-slate-800 mt-4">
                            {fromCreation ? '¡Evento Creado!' : 'Código QR del Evento'}
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Este es el código QR para el evento <span className="font-semibold">{event.name}</span>. Los estudiantes lo escanearán para registrar su asistencia.
                        </p>

                        <div className="my-6 p-4 border rounded-lg inline-block">
                            <img src={qrImageUrl} alt={`Código QR para ${event.name}`} width="256" height="256" />
                        </div>
                        
                        <p className="text-xs text-slate-400">Puedes descargar este código para imprimirlo y colocarlo en un lugar visible durante el evento.</p>
                    </>
                )}
            </div>

            <div className="space-y-3 md:flex md:space-y-0 md:space-x-4">
                <button
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="w-full md:flex-1 flex items-center justify-center space-x-2 bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Descargar QR</span>
                </button>
                <button
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="w-full md:flex-1 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {fromCreation ? 'Finalizar' : 'Volver'}
                </button>
            </div>
        </div>
    );
};

export default EventQRCodeScreen;