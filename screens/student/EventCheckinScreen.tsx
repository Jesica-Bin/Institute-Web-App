import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../../types';
import { QrCodeScanIcon, CheckIcon, ExclamationCircleIconOutline } from '../../components/Icons';

// This is a global variable from the script tag in index.html
declare const Html5Qrcode: any;

type CheckinStep = 'intro' | 'scan' | 'verifying' | 'success' | 'failure';

interface EventCheckinScreenProps {
    event: Event | null;
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    attemptCount: number;
}

const VerificationStep = ({ text, status }: { text: string; status: 'done' | 'pending' | 'inprogress' }) => (
    <div className="flex items-center space-x-4">
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
            {status === 'done' && <CheckIcon className="w-6 h-6 text-indigo-600" />}
            {status === 'pending' && <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />}
            {status === 'inprogress' && <div className="w-5 h-5 border-t-2 border-indigo-600 rounded-full animate-spin" />}
        </div>
        <span className={`text-lg transition-colors ${status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{text}</span>
    </div>
);

const EventCheckinScreen: React.FC<EventCheckinScreenProps> = ({ event, isOpen, onClose, attemptCount }) => {
    const [step, setStep] = useState<CheckinStep>('intro');
    const [verificationStatus, setVerificationStatus] = useState({
        qr: 'pending',
        location: 'pending',
        registration: 'pending',
    });
    const [failureReason, setFailureReason] = useState('No se pudo registrar la asistencia. Por favor verifica el QR y tu ubicación e intenta de nuevo.');

    const runSimulatedVerificationProcess = () => {
        setStep('verifying');
        const isSuccessAttempt = attemptCount >= 2;

        setTimeout(() => {
            setVerificationStatus(s => ({ ...s, qr: 'inprogress' }));
            setTimeout(() => {
                setVerificationStatus(s => ({ ...s, qr: 'done', location: 'inprogress' }));
                setTimeout(() => {
                    if (isSuccessAttempt) {
                        setVerificationStatus(s => ({ ...s, location: 'done', registration: 'inprogress' }));
                        setTimeout(() => {
                            setVerificationStatus(s => ({ ...s, registration: 'done' }));
                            setStep('success');
                        }, 1200);
                    } else {
                        setVerificationStatus(s => ({ ...s, location: 'done' }));
                        setFailureReason('No te encuentras en la ubicación del evento. Inténtalo de nuevo.');
                        setTimeout(() => setStep('failure'), 500);
                    }
                }, 1500);
            }, 1000);
        });
    };
    
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('intro');
                setFailureReason('No se pudo registrar la asistencia. Por favor verifica el QR y tu ubicación e intenta de nuevo.');
                setVerificationStatus({ qr: 'pending', location: 'pending', registration: 'pending' });
            }, 300);
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (step === 'success' || step === 'failure') {
            const wasSuccessful = step === 'success';
            const timer = setTimeout(() => onClose(wasSuccessful), 2500);
            return () => clearTimeout(timer);
        }
    }, [step, onClose]);


    const renderContent = () => {
        switch (step) {
            case 'intro':
                return (
                    <div className="flex flex-col text-center px-4 w-full max-w-md items-center justify-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">Registro de Asistencia</h2>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                Para confirmar tu asistencia, escanea el código QR del evento y permite el acceso a tu ubicación.
                            </p>
                        </div>
                        <button onClick={() => setStep('scan')} className="w-full bg-indigo-700 text-white font-bold py-3.5 rounded-lg mt-8 text-base shadow-lg hover:bg-indigo-800 transition-colors">
                            Comenzar
                        </button>
                    </div>
                );
            case 'scan':
                return (
                     <div className="flex flex-col text-center items-center w-full max-w-md justify-center">
                        <div className="space-y-4 flex flex-col items-center justify-center w-full">
                            <h2 className="text-2xl font-bold">Apunta la cámara al código QR</h2>
                            <QrCodeScanIcon className="w-56 h-56 my-6 text-indigo-600" />
                        </div>
                        <button 
                          onClick={runSimulatedVerificationProcess} 
                          className="w-full bg-indigo-700 text-white font-semibold py-3.5 rounded-lg shadow-lg hover:bg-indigo-800 transition-colors"
                        >
                            Escanear
                        </button>
                    </div>
                );
            case 'verifying':
                 return (
                    <div className="flex flex-col h-full w-full max-w-md items-center justify-center">
                        <h2 className="text-3xl font-bold text-center mb-12">Verificando...</h2>
                        <div className="inline-flex flex-col items-start space-y-8">
                            <VerificationStep text="Código QR válido" status={verificationStatus.qr as any} />
                            <VerificationStep text="Ubicación correcta" status={verificationStatus.location as any} />
                            <VerificationStep text="Registrando asistencia" status={verificationStatus.registration as any} />
                        </div>
                    </div>
                );
            case 'success':
                return (
                    <div className="flex flex-col text-center h-full items-center justify-center">
                        <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-24 h-24 text-indigo-700" strokeWidth={2} />
                        </div>
                        <h2 className="text-3xl font-bold mt-6">¡Asistencia Registrada!</h2>
                        <p className="text-slate-500 mt-2 text-lg">Tu asistencia se ha registrado correctamente.</p>
                    </div>
                );
             case 'failure':
                return (
                    <div className="flex flex-col text-center h-full items-center justify-center">
                        <div className="w-32 h-32 border-4 border-red-500 rounded-full flex items-center justify-center">
                            <ExclamationCircleIconOutline className="w-24 h-24 text-red-500" strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-bold mt-6">Registro fallido</h2>
                        <p className="text-slate-500 mt-4 text-lg text-center max-w-md">{failureReason}</p>
                    </div>
                );
            default:
                return null;
        }
    };
    
    if (!event) return null;

    return (
        <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} onClick={() => onClose()}>
            <div 
                className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div 
                    className="w-full bg-white text-slate-800 rounded-t-2xl p-6 flex flex-col items-center justify-center min-h-[60vh]"
                >
                     {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EventCheckinScreen;