import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockRequests } from '../data';
import { RequestStatus, StudentRequest } from '../types';
import { ChevronRightIcon, DocumentTextIcon } from '../components/Icons';
import RequestDetailScreen from './RequestDetailScreen';

const StatusBadge = ({ status }: { status: RequestStatus }) => {
    const colorClasses = {
        [RequestStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [RequestStatus.IN_PROGRESS]: 'bg-indigo-100 text-indigo-800',
        [RequestStatus.COMPLETED]: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const DetailPlaceholder: React.FC<{ icon: React.ElementType; message: string; }> = ({ icon: Icon, message }) => (
    <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center min-h-[60vh]">
        <Icon className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Selecciona un elemento</h3>
        <p className="text-slate-500 mt-2">{message}</p>
    </div>
);

const RequestsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isDesktop && mockRequests.length > 0 && !selectedRequest) {
            setSelectedRequest(mockRequests[0]);
        }
    }, [isDesktop]);

    const handleRequestClick = (request: StudentRequest) => {
        if (isDesktop) {
            setSelectedRequest(request);
        } else {
            navigate('/solicitud-detalle', { state: { request } });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-lg shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {mockRequests.map(request => (
                            <li key={request.id}>
                                <button
                                    onClick={() => handleRequestClick(request)}
                                    className={`w-full text-left p-4 transition-colors ${selectedRequest?.id === request.id && isDesktop ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-semibold ${selectedRequest?.id === request.id && isDesktop ? 'text-indigo-800' : ''}`}>{request.title}</p>
                                            <p className="text-sm text-slate-500">{request.studentName}</p>
                                            <div className="mt-2">
                                                <StatusBadge status={request.status} />
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 lg:hidden" />
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
             <div className="hidden lg:block lg:col-span-2">
                {selectedRequest ? (
                    <RequestDetailScreen request={selectedRequest} />
                ) : (
                    <DetailPlaceholder icon={DocumentTextIcon} message="Selecciona una solicitud para ver sus detalles y cambiar su estado." />
                )}
            </div>
        </div>
    );
};

export default RequestsScreen;