import React from 'react';
import { useParams } from 'react-router-dom';
import { mockSuggestions } from '../../data';
import { Suggestion, SuggestionStatus } from '../../types';

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

const SuggestionDetailScreen: React.FC = () => {
    const { suggestionId } = useParams<{ suggestionId: string }>();
    const suggestion = mockSuggestions.find(s => s.id.toString() === suggestionId);

    if (!suggestion) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró el envío.</div>;
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-indigo-700">{suggestion.type}</p>
                        <h1 className="text-2xl font-bold text-slate-800 mt-1">{suggestion.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Enviado el {new Date(suggestion.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <StatusBadge status={suggestion.status} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">Tu Mensaje</h2>
                 <p className="text-slate-600 whitespace-pre-wrap">{suggestion.message}</p>
            </div>

             {suggestion.response ? (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h2 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-3 mb-4">Respuesta del Centro de Estudiantes</h2>
                    <p className="text-green-900 whitespace-pre-wrap">{suggestion.response}</p>
                </div>
             ) : (
                <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 text-center">
                    <p className="text-indigo-800 font-medium">El centro de estudiantes aún no ha respondido a tu envío.</p>
                    <p className="text-sm text-indigo-700 mt-1">Recibirás una notificación cuando haya una respuesta.</p>
                </div>
             )}
        </div>
    );
};

export default SuggestionDetailScreen;