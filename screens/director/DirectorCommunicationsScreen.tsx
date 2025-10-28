import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOfficialCommunications, addOfficialCommunication } from '../../store';
import { Notification, NotificationType } from '../../types';
import { mockCareers } from '../../data';
import { PaperAirplaneIcon, CloudArrowUpIcon, TrashIcon, MegaphoneIcon, WrenchScrewdriverIcon, AcademicCapIcon } from '../../components/Icons';

const CreateCommunicationForm: React.FC<{ onFormSubmit: () => void }> = ({ onFormSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recipientType, setRecipientType] = useState('all');
    const [selectedCareer, setSelectedCareer] = useState(mockCareers[0]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const canSubmit = title.trim() !== '' && description.trim() !== '';
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImageFile(null);
        setImagePreviewUrl(null);
        const input = document.getElementById('image-upload-director') as HTMLInputElement;
        if (input) input.value = '';
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
            read: false, 
            type: NotificationType.OFFICIAL,
            imageUrl: imagePreviewUrl || undefined,
        };
        addOfficialCommunication(newCommunication);
        alert('Comunicado enviado con éxito.');
        onFormSubmit();
        // Reset form
        setTitle('');
        setDescription('');
        setRecipientType('all');
        handleRemoveImage();
    };
    
    const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800">Redactar Nuevo Comunicado</h2>
            <div>
                <label htmlFor="title-director" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                <input type="text" id="title-director" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} placeholder="Ej: Fechas de inscripción a finales" />
            </div>
            <div>
                <label htmlFor="description-director" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                <textarea id="description-director" value={description} onChange={e => setDescription(e.target.value)} rows={6} required className={inputStyle} placeholder="Escribe aquí el cuerpo del comunicado..." />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adjuntar imagen (opcional)</label>
                <input type="file" id="image-upload-director" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                {imagePreviewUrl ? (
                    <div className="relative mt-2">
                        <img src={imagePreviewUrl} alt="Previsualización" className="w-full h-auto max-h-60 rounded-md object-contain border bg-slate-50 border-slate-300" />
                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors" aria-label="Eliminar imagen"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                ) : (
                    <label htmlFor="image-upload-director" className="mt-2 flex justify-center w-full px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors">
                        <div className="space-y-1 text-center"><CloudArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" /><div className="flex text-sm text-slate-600"><span className="relative font-semibold text-indigo-600">Sube un archivo</span></div><p className="text-xs text-slate-500">PNG, JPG, GIF hasta 10MB</p></div>
                    </label>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Destinatarios</label>
                <fieldset className="grid grid-cols-2 gap-2">
                    <div><input type="radio" name="recipientType-director" id="all-director" value="all" className="sr-only peer" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} /><label htmlFor="all-director" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-colors">Todas las carreras</label></div>
                    <div><input type="radio" name="recipientType-director" id="specific-director" value="specific" className="sr-only peer" checked={recipientType === 'specific'} onChange={() => setRecipientType('specific')} /><label htmlFor="specific-director" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-colors">Carrera específica</label></div>
                </fieldset>
            </div>
            {recipientType === 'specific' && (
                <div>
                    <label htmlFor="career-director" className="block text-sm font-medium text-slate-700 mb-1">Seleccionar carrera</label>
                    <select id="career-director" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className={inputStyle}>{mockCareers.map(c => <option key={c} value={c}>{c}</option>)}</select>
                </div>
            )}
            <div className="flex justify-end pt-4">
                <button type="submit" disabled={!canSubmit} className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-md border border-transparent bg-indigo-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800 disabled:bg-slate-400 disabled:cursor-not-allowed"><PaperAirplaneIcon className="w-5 h-5" /><span>Enviar Comunicado</span></button>
            </div>
        </form>
    );
};

const SentCommunicationsList: React.FC = () => {
    // Fix: Use state and effect to handle asynchronous data fetching.
    const [communications, setCommunications] = React.useState<Notification[]>([]);
    
    React.useEffect(() => {
        getOfficialCommunications().then(data => {
            setCommunications(data);
        });
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Historial de Comunicados</h2>
            <div className="bg-white rounded-lg shadow-sm">
                <ul className="divide-y divide-slate-100">
                    {communications.map(comm => (
                        <li key={comm.id} className="p-4 flex items-start space-x-4">
                            <div className="p-3 bg-purple-100 text-purple-700 rounded-full"><MegaphoneIcon className="w-6 h-6" /></div>
                            <div className="flex-1"><h3 className="font-semibold text-slate-800">{comm.title}</h3><p className="text-sm text-slate-600 mt-1 line-clamp-2">{comm.description}</p><p className="text-xs text-slate-400 mt-2">{comm.time}</p></div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const DirectorCommunicationsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('create');
    
    const handleFormSubmit = () => {
        setActiveTab('history');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Centro de Comunicaciones</h1>
                <p className="text-slate-500 mt-1">Envía y gestiona los comunicados oficiales del instituto.</p>
            </div>
            <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg">
                <button onClick={() => setActiveTab('create')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'create' ? 'bg-white shadow' : 'hover:bg-slate-300'}`}>Redactar</button>
                <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors ${activeTab === 'history' ? 'bg-white shadow' : 'hover:bg-slate-300'}`}>Historial</button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                {activeTab === 'create' ? <CreateCommunicationForm onFormSubmit={handleFormSubmit} /> : <SentCommunicationsList />}
            </div>
        </div>
    );
};

export default DirectorCommunicationsScreen;
