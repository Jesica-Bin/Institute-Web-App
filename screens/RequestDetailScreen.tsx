
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { RequestStatus, StudentRequest } from '../types';

interface RequestDetailScreenProps {
    request?: StudentRequest;
}

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <div className="md:grid md:grid-cols-3 md:gap-4 py-2">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 md:mt-0 md:col-span-2">{value}</dd>
    </div>
);

const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({ request: propRequest }) => {
    const location = useLocation();
    const initialRequest = propRequest || location.state?.request as StudentRequest;

    const [request, setRequest] = React.useState<StudentRequest | null>(initialRequest);
    const [status, setStatus] = React.useState<RequestStatus | undefined>(initialRequest?.status);

    React.useEffect(() => {
        if (initialRequest) {
            setRequest(initialRequest);
            setStatus(initialRequest.status);
        }
    }, [initialRequest]);

    if (!request) {
        return <div className="text-center p-8">No se encontró la solicitud.</div>;
    }

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value as RequestStatus);
    };

    const handleFileUploadClick = () => {
        document.getElementById('file-upload')?.click();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <dl className="divide-y divide-slate-200">
                    <DetailItem label="Estudiante" value={request.studentName} />
                    <DetailItem label="Solicitud" value={request.title} />
                    <DetailItem label="Fecha" value={request.date} />
                    <div className="md:grid md:grid-cols-3 md:gap-4 py-3 items-center">
                        <dt>
                            <label htmlFor="status" className="text-sm font-medium text-slate-500">Estado</label>
                        </dt>
                        <dd className="mt-1 md:mt-0 md:col-span-2">
                             <select 
                                id="status" 
                                value={status} 
                                onChange={handleStatusChange} 
                                className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </dd>
                    </div>
                </dl>
            </div>

            <div className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-3 space-y-3 space-y-reverse md:space-y-0">
                 <button
                    onClick={handleFileUploadClick}
                    className="w-full md:w-auto md:px-6 bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Subir PDF
                </button>
                <input type="file" id="file-upload" className="hidden" accept=".pdf" onChange={() => alert('Archivo seleccionado (simulado)')} />
                 <button onClick={() => alert('Estado de la solicitud actualizado')} className="w-full md:w-auto md:px-6 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                    Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default RequestDetailScreen;