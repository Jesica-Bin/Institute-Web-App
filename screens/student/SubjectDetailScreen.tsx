import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { mockSubjectDetails } from '../../data';
import { ChevronRightIcon } from '../../components/Icons';

interface SubjectDetailScreenProps {
    subjectId?: string;
}

const SubjectDetailScreen: React.FC<SubjectDetailScreenProps> = ({ subjectId: propSubjectId }) => {
    const navigate = useNavigate();
    const { subjectId: paramSubjectId } = useParams<{ subjectId: string }>();
    
    const subjectId = propSubjectId || paramSubjectId;
    const subject = subjectId ? mockSubjectDetails[subjectId] : null;

    if (!subject) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la materia.</div>;
    }

    const handleViewAttendance = (id: string) => {
        navigate('/asistencia', { state: { subjectId: id, from: '/materia-detalle' } });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{subject.name}</h1>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{subject.description}</p>
            </div>
            
            <button 
                onClick={() => alert('Descargando contenido...')}
                className="w-full bg-amber-400 text-amber-900 font-bold py-3 rounded-lg hover:bg-amber-500 transition-colors"
            >
                Descargar contenido
            </button>

            <div>
                 <h2 className="text-base font-bold text-slate-800 mb-2">Horarios</h2>
                 <p className="text-slate-600 whitespace-pre-wrap">{subject.schedule}</p>
            </div>

            {subject.status === 'cursando' && (
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Asistencia</h2>
                    <p className="text-sm text-slate-500 mb-4">Consulta el estado detallado de tus presentes, ausentes y el límite de faltas permitidas.</p>
                    <button
                        onClick={() => handleViewAttendance(subject.id)}
                        className="w-full flex justify-between items-center bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <span>Ir al Resumen de Asistencia</span>
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Foro de la Materia</h2>
                <p className="text-sm text-slate-500 mb-4">¿Tienes una duda? Consulta el foro o haz una nueva pregunta.</p>
                <button
                    onClick={() => navigate(`/materias/${subject.id}/foro`)}
                    className="w-full flex justify-between items-center bg-slate-100 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <span>Ir al Foro</span>
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
            
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">Notas y Promedios</h2>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="space-y-4 p-2">
                        {subject.grades && subject.grades.length > 0 && subject.grades.some(g => g.score !== null) ? (
                            subject.grades.map(grade => (
                                <div key={grade.type} className="flex justify-between items-center text-slate-800">
                                    <span className="font-medium">{grade.type}</span>
                                    <span className={`font-bold text-lg ${grade.score !== null && grade.score < 4 ? 'text-red-600' : 'text-slate-800'}`}>
                                        {grade.score !== null ? grade.score : '-'}
                                    </span>
                                </div>
                            ))
                        ) : (
                           <div className="text-center py-6 text-slate-500">
                                <p>Las notas no han sido cargadas aún.</p>
                           </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectDetailScreen;