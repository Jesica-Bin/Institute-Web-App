import * as React from 'react';
import { fetchSuggestions } from '../../db';
import { Suggestion, SuggestionStatus } from '../../types';
import { ChevronRightIcon, ChatBubbleLeftRightIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const StatusBadge: React.FC<{ status: SuggestionStatus }> = ({ status }) => {
    const colorClasses = {
        [SuggestionStatus.SENT]: 'bg-slate-200 text-slate-800',
        [SuggestionStatus.IN_REVIEW]: 'bg-indigo-100 text-indigo-800',
        [SuggestionStatus.ANSWERED]: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>{status}</span>;
};

const ClaimDetailView: React.FC<{ claim: Suggestion | null }> = ({ claim }) => {
    if (!claim) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">Selecciona un reclamo</h3>
                <p className="text-slate-500 mt-2">Elige un elemento de la lista para ver sus detalles y responder.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-indigo-700">{claim.type}</p>
                        <h1 className="text-xl font-bold text-slate-800 mt-1">{claim.title}</h1>
                        <p className="text-sm text-slate-500 mt-1">Enviado el {new Date(claim.date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <StatusBadge status={claim.status} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">Mensaje del Estudiante</h2>
                 <p className="text-slate-600 whitespace-pre-wrap">{claim.message}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Responder o Asignar</h2>
                <textarea rows={4} className="w-full p-2 border border-slate-300 rounded-md" placeholder="Escribe una respuesta..."></textarea>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                    <button className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Asignar a Preceptor/a</button>
                    <button className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold">Enviar Respuesta</button>
                </div>
            </div>
        </div>
    );
};


const ClaimsManagementScreen: React.FC = () => {
    const [claims, setClaims] = React.useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedClaim, setSelectedClaim] = React.useState<Suggestion | null>(null);
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

    React.useEffect(() => {
        fetchSuggestions().then(data => {
            setClaims(data);
            if (window.innerWidth >= 1024 && data.length > 0) {
                setSelectedClaim(data[0]);
            }
            setIsLoading(false);
        });
    }, []);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gestión de Reclamos y Sugerencias</h1>
                <p className="text-slate-500 mt-1">Revisa y responde a las comunicaciones de los estudiantes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                <div className="lg:col-span-1 bg-white rounded-lg shadow-sm min-h-[300px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {claims.map(claim => (
                                <li key={claim.id}>
                                    <button
                                        onClick={() => setSelectedClaim(claim)}
                                        className={`w-full text-left p-4 transition-colors ${selectedClaim?.id === claim.id && isDesktop ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`font-semibold ${selectedClaim?.id === claim.id && isDesktop ? 'text-indigo-800' : ''}`}>{claim.title}</p>
                                                <p className="text-sm text-slate-500">{claim.type}</p>
                                            </div>
                                            <StatusBadge status={claim.status} />
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="lg:col-span-2">
                    {isLoading && isDesktop ? <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm"><Spinner /></div> : <ClaimDetailView claim={selectedClaim} />}
                </div>
            </div>
        </div>
    );
};

export default ClaimsManagementScreen;
