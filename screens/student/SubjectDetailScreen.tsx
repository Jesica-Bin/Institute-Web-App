import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { mockSubjectDetails } from '../../data';
import { TermGrades } from '../../types';
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from '../../components/Icons';

const AccordionItem: React.FC<{ term: TermGrades }> = ({ term }) => {
    const [isOpen, setIsOpen] = useState(
        () => term.isCollapsible && term.grades.length > 0 && term.termName === 'Primer cuatrimestre'
    );
    const hasSubItems = term.grades && term.grades.length > 0;

    if (!term.isCollapsible) {
        return (
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                <p className="font-medium text-slate-800">{term.termName}</p>
                <span className="font-bold text-lg text-slate-800">
                    {term.mainScore !== null ? term.mainScore : '-'}
                </span>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-100 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
            >
                <p className="font-medium text-slate-800">{term.termName}</p>
                <div className="flex items-center space-x-3 text-slate-600">
                    <span className="font-bold text-lg text-slate-800">
                        {term.mainScore !== null ? term.mainScore : '-'}
                    </span>
                    {isOpen 
                        ? <ChevronUpIcon className="w-5 h-5" /> 
                        : <ChevronDownIcon className="w-5 h-5" />
                    }
                </div>
            </button>
            {isOpen && hasSubItems && (
                <div className="px-4 pb-4">
                    <div className="border-t border-slate-200 pt-3 space-y-3">
                        {term.grades.map(grade => (
                            <div key={grade.name} className="flex justify-between items-center text-sm">
                                <p className="text-slate-600">{grade.name}</p>
                                <p className="font-semibold text-slate-800">{grade.score}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

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
            
            <div>
                <h2 className="text-lg font-bold text-slate-800 mb-3">Notas y Promedios</h2>
                <div className="space-y-2">
                   {subject.detailedGrades && subject.detailedGrades.length > 0 ? subject.detailedGrades.map(term => (
                       <AccordionItem key={term.termName} term={term} />
                   )) : (
                     <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-lg">
                        <p>Las notas no han sido cargadas aún.</p>
                     </div>
                   )}
                </div>
            </div>
        </div>
    );
};

export default SubjectDetailScreen;
