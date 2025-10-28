import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCertificateRequests } from '../../db';
import { CertificateRequest, CertificateStatus } from '../../types';
import { DocumentTextIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const StatusBadge = ({ status }: { status: CertificateStatus }) => {
    const colorClasses = {
        [CertificateStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [CertificateStatus.READY]: 'bg-indigo-100 text-indigo-800',
        [CertificateStatus.DELIVERED]: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const CertificatesScreen: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<CertificateRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCertificateRequests().then(data => {
            setRequests(data);
            setIsLoading(false);
        });
    }, []);

    const isExpired = (expiryDate: string | undefined): boolean => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const handleRequestClick = (requestId: number) => {
        navigate(`/certificados/${requestId}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800">Gestiona tus constancias</h2>
                <p className="text-sm text-slate-500 mt-1">Solicita un nuevo certificado o revisa el estado de tus solicitudes anteriores.</p>
                <Link
                    to="/solicitar-certificado"
                    className="mt-4 block w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors text-center"
                >
                    Solicitar Nuevo
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm min-h-[200px]">
                 <h2 className="text-lg font-bold text-slate-800 p-4 border-b border-slate-100">Mis Solicitudes</h2>
                 {isLoading ? (
                     <div className="flex justify-center items-center p-8">
                         <Spinner />
                     </div>
                 ) : requests.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                        {requests.map(req => (
                            <li key={req.id}>
                                <button onClick={() => handleRequestClick(req.id)} className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div>
                                        <p className="font-semibold">{req.type}</p>
                                        <p className="text-sm text-slate-500">
                                            Solicitado el: {new Date(req.requestDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                        </p>
                                        {isExpired(req.expiryDate) && (
                                             <p className="text-xs text-red-600 mt-1 font-semibold">
                                                Vencido - Solicitar nuevamente
                                            </p>
                                        )}
                                    </div>
                                    <StatusBadge status={req.status} />
                                </button>
                            </li>
                        ))}
                    </ul>
                 ) : (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <DocumentTextIcon className="w-12 h-12 text-slate-300 mb-2" />
                        <p>Aún no has solicitado ningún certificado.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default CertificatesScreen;
