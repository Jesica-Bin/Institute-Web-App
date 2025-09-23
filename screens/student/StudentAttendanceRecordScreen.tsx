import React from 'react';
import { mockStudentAttendanceRecords } from '../../data';
import { StudentAttendanceStatus } from '../../types';

const StatusBadge = ({ status }: { status: StudentAttendanceStatus }) => {
    // Fix: Replaced incorrect `StudentAttendanceStatus.LATE` with `StudentAttendanceStatus.JUSTIFIED` and updated color classes to correctly handle all possible statuses from the data source (`PRESENT`, `ABSENT`, `JUSTIFIED`).
    const colorClasses = {
        [StudentAttendanceStatus.PRESENT]: 'bg-green-100 text-green-800',
        [StudentAttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
        [StudentAttendanceStatus.JUSTIFIED]: 'bg-indigo-100 text-indigo-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const StudentAttendanceRecordScreen: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Materia
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockStudentAttendanceRecords.map(record => (
                                <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {new Date(record.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {record.subject}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={record.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceRecordScreen;