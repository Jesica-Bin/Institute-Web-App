import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCareers } from '../data';
import { Notification, NotificationType } from '../types';
import { PaperAirplaneIcon, CloudArrowUpIcon, TrashIcon } from '../components/Icons';

const CreateCommunicationScreen: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recipientType, setRecipientType] = useState('all'); // 'all' or 'specific'
    const [selectedCareer, setSelectedCareer] = useState(mockCareers[0]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const canSubmit = title.trim() !== '' && description.trim() !== '';
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImageFile(null);
        setImagePreviewUrl(null);
        const input = document.getElementById('image-upload') as HTMLInputElement;
        if (input) {
            input.value = '';
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        const target = recipientType === 'all' ? 'Todas las carreras' : selectedCareer;

        const newCommunication: Notification = {
            id: Date.now(),
            title: title,
            description: `Destinatarios: ${target}. \n\n${description}`,
            time: 'Ahora mismo',
            read: true, // It's "read" for the preceptor who sent it
            type: NotificationType.OFFICIAL,
            imageUrl: imagePreviewUrl || undefined,
        };
        
        // In a real app, the object URL should not be passed directly.
        // You would upload the file and get a permanent URL.
        // For this mock, we pass it so the next screen can display it.
        navigate('/notificaciones', { state: { newCommunication } });
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/notificaciones', { replace: true });
        }
    };
    
    const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} placeholder="Ej: Fechas de inscripción a finales" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={6} required className={inputStyle} placeholder="Escribe aquí el cuerpo del comunicado..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Adjuntar imagen (opcional)</label>
                        <input type="file" id="image-upload" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />

                        {imagePreviewUrl ? (
                            <div className="relative mt-2">
                                <img src={imagePreviewUrl} alt="Previsualización" className="w-full h-auto max-h-60 rounded-md object-contain border bg-slate-50 border-slate-300" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                                    aria-label="Eliminar imagen"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="image-upload"
                                className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors"
                            >
                                <div className="space-y-1 text-center">
                                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <span className="relative font-semibold text-indigo-600">Sube un archivo</span>
                                    </div>
                                    <p className="text-xs text-slate-500">PNG, JPG, GIF hasta 10MB</p>
                                </div>
                            </label>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Destinatarios</label>
                        <fieldset className="grid grid-cols-2 gap-2">
                             <div>
                                <input type="radio" name="recipientType" id="all" value="all" className="sr-only peer" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} />
                                <label htmlFor="all" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-colors">Todas las carreras</label>
                            </div>
                             <div>
                                <input type="radio" name="recipientType" id="specific" value="specific" className="sr-only peer" checked={recipientType === 'specific'} onChange={() => setRecipientType('specific')} />
                                <label htmlFor="specific" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-colors">Carrera específica</label>
                            </div>
                        </fieldset>
                    </div>

                    {recipientType === 'specific' && (
                        <div>
                            <label htmlFor="career" className="block text-sm font-medium text-slate-700 mb-1">Seleccionar carrera</label>
                            <select id="career" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className={inputStyle}>
                                {mockCareers.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="mt-3 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            <span>Enviar Comunicado</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCommunicationScreen;