import * as React from 'react';
import { Link } from 'react-router-dom';
import { fetchTeacherSubjects, fetchForumThreads } from '../../db';
import { mockForumThreads } from '../../data';
import { TeacherSubject } from '../../types';
import { ChevronRightIcon, ChatBubbleLeftRightIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const ForumHubScreen: React.FC = () => {
    const [subjects, setSubjects] = React.useState<TeacherSubject[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchTeacherSubjects().then(data => {
            setSubjects(data);
            setIsLoading(false);
        });
    }, []);

    const getSubjectStats = (subjectId: string) => {
        const threads = mockForumThreads.filter(t => t.subjectId === subjectId);
        const openThreads = threads.filter(t => t.status === 'open').length;
        return { total: threads.length, open: openThreads };
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">Foro de Intercambio</h1>
            <p className="text-slate-500">Selecciona una de tus materias para ver las consultas de los estudiantes.</p>

            <div className="space-y-3 pt-4">
                {subjects.map(subject => {
                    const stats = getSubjectStats(subject.id);
                    return (
                        <Link
                            key={subject.id}
                            to={`/foro/materias/${subject.id}`}
                            className="w-full text-left p-4 bg-white rounded-lg shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex-grow">
                                <h2 className="font-bold text-indigo-800">{subject.name}</h2>
                                <p className="text-sm text-slate-600 mt-1">{subject.course}</p>
                                <div className="flex items-center space-x-4 text-sm text-slate-500 mt-2">
                                    <div className="flex items-center space-x-1">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                        <span>{stats.total} consultas</span>
                                    </div>
                                    {stats.open > 0 && (
                                        <div className="flex items-center space-x-1 font-semibold text-amber-700">
                                            <span>{stats.open} sin responder</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <ChevronRightIcon className="w-6 h-6 text-slate-400" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ForumHubScreen;
