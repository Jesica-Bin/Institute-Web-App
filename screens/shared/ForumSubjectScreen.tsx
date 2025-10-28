import * as React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchForumThreads, fetchTeacherSubjects, fetchStudentSubjects } from '../../db';
import { UserRole, ForumThread, TeacherSubject, StudentSubject } from '../../types';
import { PlusIcon, ChatBubbleLeftRightIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

interface ForumSubjectScreenProps {
    userRole: UserRole;
}

const ThreadStatusBadge: React.FC<{ status: 'open' | 'answered' }> = ({ status }) => {
    const styles = {
        open: 'bg-amber-100 text-amber-800',
        answered: 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status === 'open' ? 'Abierta' : 'Respondida'}</span>;
};

const ForumSubjectScreen: React.FC<ForumSubjectScreenProps> = ({ userRole }) => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    
    const [subject, setSubject] = React.useState<TeacherSubject | StudentSubject | null>(null);
    const [threads, setThreads] = React.useState<ForumThread[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (!subjectId) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            const allThreads = await fetchForumThreads();
            const [teacherSubjects, studentSubjects] = await Promise.all([
                fetchTeacherSubjects(),
                fetchStudentSubjects()
            ]);
            
            const currentSubject = [...teacherSubjects, ...studentSubjects].find(s => s.id === subjectId) || null;
            
            const subjectThreads = allThreads
                .filter(t => t.subjectId === subjectId)
                .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
            
            setSubject(currentSubject);
            setThreads(subjectThreads);
            setIsLoading(false);
        };

        fetchData();
    }, [subjectId]);

    const handleThreadClick = (threadId: number) => {
        if (userRole === 'teacher') {
            navigate(`/foro/materias/${subjectId}/thread/${threadId}`);
        } else {
            navigate(`/materias/${subjectId}/foro/thread/${threadId}`);
        }
    };
    
    const newThreadPath = userRole === 'teacher' ? '#' : `/materias/${subjectId}/foro/nueva-pregunta`;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800">Foro: {subject?.name}</h1>
                    <p className="text-slate-500 mt-1">Consulta las dudas de tus compañeros o haz una nueva pregunta.</p>
                </div>
                {userRole === 'student' && (
                    <Link
                        to={newThreadPath}
                        className="flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nueva Pregunta</span>
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <ul className="divide-y divide-slate-100">
                    {threads.length > 0 ? threads.map(thread => (
                        <li key={thread.id}>
                            <button onClick={() => handleThreadClick(thread.id)} className="w-full text-left p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <p className="font-semibold text-slate-800">{thread.title}</p>
                                    <ThreadStatusBadge status={thread.status} />
                                </div>
                                <div className="text-sm text-slate-500 mt-2">
                                    <span>Por: {thread.authorName}</span>
                                    <span className="mx-2">•</span>
                                    <span>{thread.replies.length} respuestas</span>
                                    <span className="mx-2">•</span>
                                    <span>{new Date(thread.createdAt).toLocaleDateString('es-ES')}</span>
                                </div>
                            </button>
                        </li>
                    )) : (
                        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                            <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-300 mb-2" />
                            <p>Aún no hay preguntas en este foro.</p>
                            {userRole === 'student' && <p className="mt-1">¡Sé el primero en hacer una!</p>}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ForumSubjectScreen;
