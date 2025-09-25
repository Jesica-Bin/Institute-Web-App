import React from 'react';
import { useParams } from 'react-router-dom';
import { mockCertificateRequests } from '../../data';
import { CertificateStatus } from '../../types';
import { DocumentTextIcon, CheckBadgeIcon, ArrowDownTrayIcon } from '../../components/Icons';

const StatusBadge: React.FC<{ status: CertificateStatus }> = ({ status }) => {
    const colorClasses = {
        [CertificateStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [CertificateStatus.READY]: 'bg-indigo-100 text-indigo-800',
        [CertificateStatus.DELIVERED]: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-base text-slate-900">{value}</dd>
    </div>
);

const CertificateDetailScreen: React.FC = () => {
    const { requestId } = useParams<{ requestId: string }>();
    const request = mockCertificateRequests.find(r => r.id.toString() === requestId);

    if (!request) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la solicitud.</div>;
    }

    const canDownload = request.status === CertificateStatus.READY || request.status === CertificateStatus.DELIVERED;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-start border-b border-slate-200 pb-4 mb-6">
                    <div className="flex items-start space-x-4">
                        <DocumentTextIcon className="w-10 h-10 text-indigo-500 flex-shrink-0" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">{request.type}</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Solicitado el {new Date(request.requestDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <StatusBadge status={request.status} />
                    </div>
                </div>
                
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <DetailItem label="ID de Solicitud" value={`#${request.id.toString().padStart(6, '0')}`} />
                    {request.expiryDate && <DetailItem label="Fecha de Vencimiento" value={new Date(request.expiryDate).toLocaleDateString('es-ES')} />}
                </dl>
            </div>

            {canDownload && request.pdfUrl ? (
                <a
                    href={request.pdfUrl}
                    download={`certificado-${request.id}.pdf`}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors text-center"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Descargar PDF</span>
                </a>
            ) : (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
                    <p className="text-amber-800 font-medium">Tu certificado aún está en proceso.</p>
                    <p className="text-sm text-amber-700 mt-1">Recibirás una notificación cuando esté listo para retirar o descargar.</p>
                </div>
            )}
        </div>
    );
};

export default CertificateDetailScreen;