import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTeacherSubjectDetails } from '../../data';
import { DocumentTextIcon, UsersIcon, BookOpenIcon, ClipboardDocumentListIcon, ChevronDownIcon, ChevronUpIcon } from '../../components/Icons';
import { getClassLogs, getCalendarEvents } from '../../store';

const TeacherSubjectDetailScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const subject = subjectId ? mockTeacherSubjectDetails[subjectId] : null;
    const [expandedLogId, setExpandedLogId] = React.useState<string | null>(null);

    const subjectLogs = React.useMemo(() => {
        if (!subject) return [];
        const allLogs = getClassLogs();
        const allEvents = getCalendarEvents();
    
        return allLogs
            .filter(log => {
                const event = allEvents.find(e => e.id === log.eventId);
                return event?.title === subject?.name;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [subject?.name]);

    if (!subject) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la materia.</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{subject.name}</h1>
                <p className="text-slate-500 mt-1">{subject.course}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4 flex items-center space-x-2">
                    <BookOpenIcon className="w-5 h-5 text-indigo-700" />
                    <span>Descripción</span>
                </h2>
                <p className="text-slate-600 leading-relaxed">{subject.description}</p>
            </div>
            
            <a 
                href={subject.programUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-amber-400 text-amber-900 font-bold py-3 rounded-lg hover:bg-amber-500 transition-colors"
            >
                Descargar programa de la materia
            </a>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Acciones Docentes</h2>
                <div className="space-y-3">
                    <button
                        onClick={() => navigate(`/materias/detalle/${subject.id}/calificaciones`)}
                        className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 rounded-lg font-medium text-slate-800 transition-colors"
                    >
                        Cargar Notas de Evaluaciones
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4 flex items-center space-x-2">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-700" />
                    <span>Historial del Libro de Temas</span>
                </h2>
                <div className="space-y-2">
                    {subjectLogs.length > 0 ? (
                        subjectLogs.map(log => (
                            <div key={log.id} className="border border-slate-200 rounded-lg">
                                <button
                                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                                    className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-50"
                                >
                                    <div>
                                        <p className="font-semibold">{new Date(log.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                        <p className="text-sm text-slate-600 truncate">{log.topic}</p>
                                    </div>
                                    {expandedLogId === log.id ? <ChevronUpIcon className="w-5 h-5 text-slate-500" /> : <ChevronDownIcon className="w-5 h-5 text-slate-500" />}
                                </button>
                                {expandedLogId === log.id && (
                                    <div className="px-4 pb-4 border-t border-slate-200">
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold text-slate-800">Actividades:</h4>
                                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{log.activities}</p>
                                        </div>
                                        {log.observations && (
                                             <div className="mt-3">
                                                <h4 className="text-sm font-semibold text-slate-800">Observaciones:</h4>
                                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{log.observations}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-slate-500 py-4">No hay entradas en el libro de temas para esta materia.</p>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                 <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold flex items-center space-x-2">
                        <UsersIcon className="w-5 h-5 text-indigo-700" />
                        <span>Estudiantes Inscriptos ({subject.enrolledStudents.length})</span>
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nombre</th>
                                <th scope="col" className="px-6 py-3">Legajo</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subject.enrolledStudents.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{student.lastName}, {student.name}</td>
                                    <td className="px-6 py-4 text-slate-500">{student.legajo}</td>
                                    <td className="px-6 py-4 text-slate-500">{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherSubjectDetailScreen;