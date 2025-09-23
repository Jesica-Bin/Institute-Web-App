import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Student, StudentAttendanceStatus, RequestStatus, SubjectDetail } from '../types';
import { UserCircleIcon } from '../components/Icons';
import { mockStudentAttendanceRecords, mockRequests, mockSubjectDetails } from '../data';

interface StudentProfileScreenProps {
    student?: Student;
}

const ProfileInfoItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-base text-slate-900">{value}</dd>
    </div>
);

const AttendanceStatusBadge = ({ status }: { status: StudentAttendanceStatus }) => {
    const colorClasses = {
        [StudentAttendanceStatus.PRESENT]: 'bg-green-100 text-green-800',
        [StudentAttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
        [StudentAttendanceStatus.JUSTIFIED]: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const RequestStatusBadge = ({ status }: { status: RequestStatus }) => {
    const colorClasses = {
        [RequestStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [RequestStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
        [RequestStatus.COMPLETED]: 'bg-green-100 text-green-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ student: propStudent }) => {
    const location = useLocation();
    const student = propStudent || location.state?.student as Student;
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedSubjectDetails, setSelectedSubjectDetails] = useState<SubjectDetail | null>(null);

    const subjectsInCourse = useMemo(() => {
        return Object.values(mockSubjectDetails).filter(s => s.status === 'cursando');
    }, []);

    const filteredAttendance = useMemo(() => {
        if (selectedSubject === 'all') {
            return mockStudentAttendanceRecords;
        }
        return mockStudentAttendanceRecords.filter(record => record.subject === selectedSubject);
    }, [selectedSubject]);

    const studentRequests = useMemo(() => {
        if (!student) return [];
        const studentFullName = `${student.name} ${student.lastName}`;
        return mockRequests.filter(req => req.studentName === studentFullName);
    }, [student]);

    const attendanceSummary = useMemo(() => {
        if (selectedSubject === 'all' || !selectedSubjectDetails) {
            return null;
        }
        
        const subjectRecords = mockStudentAttendanceRecords.filter(r => r.subject === selectedSubjectDetails.name);
        const absences = subjectRecords.filter(r => r.status === StudentAttendanceStatus.ABSENT).length;

        return {
            absences,
            maxAbsences: selectedSubjectDetails.maxAbsences || 1,
        };
    }, [selectedSubjectDetails]);


    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subjectName = e.target.value;
        setSelectedSubject(subjectName);
        if (subjectName === 'all') {
            setSelectedSubjectDetails(null);
        } else {
            const subject = subjectsInCourse.find(s => s.name === subjectName);
            setSelectedSubjectDetails(subject || null);
        }
    };


    if (!student) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-bold">Estudiante no encontrado</h2>
                <p className="text-slate-500 mt-2">Por favor, vuelve a la lista y selecciona un estudiante.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <UserCircleIcon className="w-24 h-24 text-slate-300" />
                <div>
                    <h1 className="text-2xl font-bold text-center">{student.name} {student.lastName}</h1>
                    <p className="text-slate-500 text-center">Estudiante</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Información Personal</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ProfileInfoItem label="Nombre Completo" value={`${student.name} ${student.lastName}`} />
                    <ProfileInfoItem label="Legajo" value={student.legajo} />
                    <ProfileInfoItem label="Carrera" value={student.carrera} />
                </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Información de Contacto</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ProfileInfoItem label="Email" value={student.email} />
                    <ProfileInfoItem label="Teléfono" value={student.phone} />
                </dl>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold">Historial de Solicitudes</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                    {studentRequests.length > 0 ? studentRequests.map(request => (
                        <li key={request.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <p className="font-semibold">{request.title}</p>
                                <p className="text-sm text-slate-500">
                                    {new Date(request.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <RequestStatusBadge status={request.status} />
                        </li>
                    )) : (
                        <li className="p-6 text-center text-slate-500">
                            Este estudiante no tiene solicitudes registradas.
                        </li>
                    )}
                </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Historial y Resumen de Asistencia</h2>
                    <div>
                        <label htmlFor="subject-filter" className="block text-sm font-medium text-slate-700 mb-1">Filtrar por materia</label>
                        <select
                            id="subject-filter"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">Todas las materias</option>
                            {subjectsInCourse.map(subject => (
                                <option key={subject.id} value={subject.name}>{subject.name}</option>
                            ))}
                        </select>
                    </div>

                    {attendanceSummary && (
                        <div className="pt-6 mt-6 border-t border-slate-200">
                             {(() => {
                                const { absences, maxAbsences } = attendanceSummary;
                                if (maxAbsences === 0) return null;
                                
                                const percentage = (absences / maxAbsences) * 100;
                                const isFree = percentage >= 100;

                                let barColor = 'bg-green-500';
                                if (isFree) barColor = 'bg-red-500';
                                else if (percentage >= 75) barColor = 'bg-yellow-400';

                                return (
                                    <div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-base font-semibold text-slate-700">Resumen de la materia</h3>
                                             <div className="flex items-baseline space-x-2">
                                                {isFree && (
                                                    <span className="px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">LIBRE</span>
                                                )}
                                                <span className="text-sm font-semibold text-slate-600">{absences}/{maxAbsences} ausencias</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                                            <div
                                                className={`${barColor} h-2 rounded-full transition-all duration-500`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Materia</th>
                                <th scope="col" className="px-6 py-3 text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.length > 0 ? filteredAttendance.map(record => (
                                <tr key={record.id} className="bg-white border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {new Date(record.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">{record.subject}</td>
                                    <td className="px-6 py-4 text-center">
                                        <AttendanceStatusBadge status={record.status} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-6 text-slate-500">
                                        No hay registros de asistencia para la materia seleccionada.
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

export default StudentProfileScreen;