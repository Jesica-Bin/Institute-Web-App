import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockSuggestions } from '../../data';
import { Suggestion, SuggestionStatus } from '../../types';
import { ChevronRightIcon, MegaphoneIcon } from '../../components/Icons';

const StatusBadge = ({ status }: { status: SuggestionStatus }) => {
    const colorClasses = {
        [SuggestionStatus.SENT]: 'bg-slate-200 text-slate-800',
        [SuggestionStatus.IN_REVIEW]: 'bg-indigo-100 text-indigo-800',
        [SuggestionStatus.ANSWERED]: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const SuggestionsScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleSuggestionClick = (suggestion: Suggestion) => {
        navigate(`/sugerencia-detalle/${suggestion.id}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">Canal de comunicación</h2>
                <p className="text-sm text-slate-500 mt-1">Envía tus sugerencias o reclamos al centro de estudiantes. Tu opinión es importante.</p>
                <button
                    onClick={() => navigate('/nueva-sugerencia')}
                    className="mt-4 block w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors text-center"
                >
                    Realizar un nuevo envío
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                 <h2 className="text-lg font-bold text-slate-800 p-4 border-b border-slate-100">Mis Envíos</h2>
                 {mockSuggestions.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                        {mockSuggestions.map(sug => (
                            <li key={sug.id} onClick={() => handleSuggestionClick(sug)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                                <div>
                                    <p className="font-semibold">{sug.title}</p>
                                    <p className="text-sm text-slate-500">
                                        {sug.type} - {new Date(sug.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <StatusBadge status={sug.status} />
                                    <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                                </div>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <MegaphoneIcon className="w-12 h-12 text-slate-300 mb-2" />
                        <p>Aún no has realizado ningún envío.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default SuggestionsScreen;