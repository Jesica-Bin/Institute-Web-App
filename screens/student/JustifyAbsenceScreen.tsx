import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAbsencesToJustify } from '../../data';
import { AbsenceToJustify, JustificationStatus } from '../../types';
import { ChevronRightIcon } from '../../components/Icons';

const StatusBadge = ({ status }: { status: JustificationStatus }) => {
    const colorClasses = {
        [JustificationStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [JustificationStatus.APPROVED]: 'bg-green-100 text-green-800',
        [JustificationStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};


const JustifyAbsenceScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleAbsenceClick = (absence: AbsenceToJustify) => {
        if (absence.status === JustificationStatus.REJECTED) {
            navigate('/justificacion-estado', { state: { absence } });
        } else {
            // For PENDING or any other state, go to the justification upload screen.
            navigate('/justificar-ausencia-detalle', { state: { absence } });
        }
    };

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <div className="space-y-3">
                {mockAbsencesToJustify.map((absence: AbsenceToJustify) => (
                    <button
                        key={absence.id}
                        className="w-full flex justify-between items-center p-4 bg-white rounded-lg shadow-sm text-left hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => handleAbsenceClick(absence)}
                    >
                        <div>
                            <p className="font-semibold text-slate-800">{absence.date} - {absence.subject}</p>
                            <div className="mt-2">
                                <StatusBadge status={absence.status} />
                            </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </button>
                ))}
            </div>
            <p className="text-center text-slate-500 pt-4">
                No hay mas ausencias para justificar
            </p>
        </div>
    );
};

export default JustifyAbsenceScreen;