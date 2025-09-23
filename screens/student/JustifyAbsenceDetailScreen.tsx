import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AbsenceToJustify } from '../../types';
import { CloudArrowUpIcon, CheckBadgeIcon } from '../../components/Icons';

const JustifyAbsenceDetailScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const absence = location.state?.absence as AbsenceToJustify;

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!absence) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la ausencia a justificar.</div>;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        document.getElementById('certificate-upload')?.click();
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Por favor, selecciona un certificado para subir.');
            return;
        }
        setIsSubmitted(true);
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/justificar-ausencia', { replace: true });
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm">
                <CheckBadgeIcon className="w-20 h-20 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800 mt-4">Justificación Enviada</h2>
                <p className="text-slate-500 mt-2">
                    Tu justificativo ha sido enviado. Recibirás una notificación cuando la preceptora lo revise.
                </p>
                <button 
                    onClick={() => navigate('/justificar-ausencia', { replace: true })}
                    className="mt-8 w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    Entendido
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="border-b border-slate-200 pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Justificar Ausencia</h2>
                    <p className="text-slate-600 mt-1">{absence.date} - {absence.subject}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                            Adjunta un certificado (PDF, JPG, PNG).
                        </p>
                        <input
                            type="file"
                            id="certificate-upload"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <CloudArrowUpIcon className="w-10 h-10 mb-2" />
                            <span className="font-semibold">{selectedFile ? selectedFile.name : 'Seleccionar archivo'}</span>
                            {selectedFile && (
                                <span className="text-xs mt-1">
                                    Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                         <button
                            type="button"
                            onClick={handleBack}
                            className="mt-3 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedFile}
                            className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-blue-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Enviar Justificación
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JustifyAbsenceDetailScreen;