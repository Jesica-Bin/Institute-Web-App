import React, { useState, useMemo } from 'react';
import { mockStudentAttendanceRecords, mockStudentSubjects } from '../../data';
import { StudentAttendanceStatus } from '../../types';
import { DocumentTextIcon } from '../../components/Icons';

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
    const [selectedSubject, setSelectedSubject] = useState('all');

    const subjectsInCourse = useMemo(() => {
        return mockStudentSubjects.filter(s => s.status === 'cursando');
    }, []);

    const filteredRecords = useMemo(() => {
        if (selectedSubject === 'all') {
            return mockStudentAttendanceRecords;
        }
        return mockStudentAttendanceRecords.filter(record => record.subject === selectedSubject);
    }, [selectedSubject]);


    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <label htmlFor="subject-filter" className="block text-sm font-medium text-slate-700 mb-1">
                    Filtrar por materia
                </label>
                <select
                    id="subject-filter"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="all">Todas las materias</option>
                    {subjectsInCourse.map(subject => (
                        <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                </select>
            </div>

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
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map(record => (
                                    <tr key={record.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="text-center p-8 text-slate-500 flex flex-col items-center">
                                            <DocumentTextIcon className="w-12 h-12 text-slate-300 mb-2" />
                                            <p>No hay registros de asistencia para la materia seleccionada.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceRecordScreen;