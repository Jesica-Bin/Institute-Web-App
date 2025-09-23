import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewSuggestionScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert('Tu envío ha sido registrado. El centro de estudiantes lo revisará a la brevedad.');
        navigate('/sugerencias');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Tipo de envío
                        </label>
                        <fieldset className="grid grid-cols-2 gap-2">
                            <div>
                                <input type="radio" name="type" id="sugerencia" value="Sugerencia" className="sr-only peer" defaultChecked />
                                <label htmlFor="sugerencia" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600">Sugerencia</label>
                            </div>
                             <div>
                                <input type="radio" name="type" id="reclamo" value="Reclamo" className="sr-only peer" />
                                <label htmlFor="reclamo" className="block w-full text-center p-3 border rounded-lg cursor-pointer peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600">Reclamo</label>
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                            Asunto
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: Mejoras para la cafetería"
                            required
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe tu sugerencia o reclamo detalladamente..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                         <button
                            type="button"
                            onClick={() => navigate('/sugerencias')}
                            className="mt-3 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-700 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewSuggestionScreen;