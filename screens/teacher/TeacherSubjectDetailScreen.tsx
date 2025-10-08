import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTeacherSubjectDetails } from '../../data';
import { DocumentTextIcon, UsersIcon, BookOpenIcon } from '../../components/Icons';

const TeacherSubjectDetailScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const subject = subjectId ? mockTeacherSubjectDetails[subjectId] : null;

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