import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTeacherSubjects } from '../../data';
import { ChevronRightIcon, UsersIcon } from '../../components/Icons';

const TeacherSubjectsScreen: React.FC = () => {
    const navigate = useNavigate();

    const handleSubjectClick = (subjectId: string) => {
        navigate(`/materias/detalle/${subjectId}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">Mis Materias</h1>
            <div className="space-y-3">
                {mockTeacherSubjects.map(subject => (
                    <button
                        key={subject.id}
                        onClick={() => handleSubjectClick(subject.id)}
                        className="w-full text-left p-4 bg-white rounded-lg shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex-grow">
                            <h2 className="font-bold text-indigo-800">{subject.name}</h2>
                            <p className="text-sm text-slate-600 mt-1">{subject.course}</p>
                            <div className="flex items-center space-x-2 text-sm text-slate-500 mt-2">
                                <UsersIcon className="w-4 h-4" />
                                <span>{subject.studentCount} alumnos</span>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TeacherSubjectsScreen;