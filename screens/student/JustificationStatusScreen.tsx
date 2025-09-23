import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AbsenceToJustify, JustificationStatus } from '../../types';
import { ExclamationCircleIconOutline } from '../../components/Icons';

const StatusBadge = ({ status }: { status: JustificationStatus }) => {
    const colorClasses = {
        [JustificationStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [JustificationStatus.APPROVED]: 'bg-green-100 text-green-800',
        [JustificationStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-sm font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const JustificationStatusScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const absence = location.state?.absence as AbsenceToJustify;

    if (!absence) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la justificación.</div>;
    }

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/justificar-ausencia', { replace: true });
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-semibold text-indigo-700">Ausencia</p>
                        <h1 className="text-2xl font-bold text-slate-800 mt-1">{absence.date} - {absence.subject}</h1>
                    </div>
                    <StatusBadge status={absence.status} />
                </div>
            </div>

            {absence.status === JustificationStatus.REJECTED && absence.rejectionReason && (
                 <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <div className="flex items-start space-x-3">
                        <ExclamationCircleIconOutline className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="text-lg font-semibold text-red-800">Motivo del rechazo</h2>
                            <p className="text-red-900 whitespace-pre-wrap mt-2">{absence.rejectionReason}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    onClick={handleBack}
                    className="w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default JustificationStatusScreen;