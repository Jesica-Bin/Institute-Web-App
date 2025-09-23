import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCertificateTypes } from '../../data';

const NewCertificateRequestScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would typically handle form submission, e.g., send to an API.
        // For this mock, we'll just show an alert and navigate back.
        alert('Tu solicitud ha sido enviada con éxito. Recibirás una notificación cuando esté lista.');
        navigate('/certificados');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="certificate-type" className="block text-sm font-medium text-slate-700 mb-1">
                            Tipo de certificado
                        </label>
                        <select
                            id="certificate-type"
                            name="certificate-type"
                            className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Selecciona una opción...</option>
                            {mockCertificateTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-slate-700 mb-1">
                            Comentarios adicionales (opcional)
                        </label>
                        <textarea
                            id="comments"
                            name="comments"
                            rows={4}
                            className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: Para presentar en mi trabajo..."
                        ></textarea>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                         <button
                            type="button"
                            onClick={() => navigate('/certificados')}
                            className="mt-3 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCertificateRequestScreen;