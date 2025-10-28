import * as React from 'react';
import { useParams } from 'react-router-dom';
import { fetchForumThreads } from '../../db';
import { ForumPost, UserRole, ForumThread } from '../../types';
import { UserCircleIcon, CheckBadgeIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

interface ForumThreadScreenProps {
    userRole: UserRole;
}

const PostCard: React.FC<{ post: ForumPost | { content: string, authorName: string, createdAt: string, authorRole: 'student' | 'teacher' }, isQuestion?: boolean }> = ({ post, isQuestion }) => {
    const isTeacher = post.authorRole === 'teacher';
    return (
        <div className={`p-4 rounded-lg flex space-x-4 ${isQuestion ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
            <UserCircleIcon className={`w-10 h-10 text-slate-400 flex-shrink-0 mt-1 ${isTeacher ? 'text-indigo-600' : ''}`} />
            <div className="flex-grow">
                <div className="flex items-baseline space-x-2">
                    <p className={`font-semibold ${isTeacher ? 'text-indigo-800' : 'text-slate-800'}`}>{post.authorName}</p>
                    {isTeacher && <CheckBadgeIcon className="w-5 h-5 text-indigo-600" />}
                    <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleString('es-ES')}</p>
                </div>
                <p className="text-slate-700 mt-2 whitespace-pre-wrap">{post.content}</p>
            </div>
        </div>
    );
};


const ForumThreadScreen: React.FC<ForumThreadScreenProps> = ({ userRole }) => {
    const { threadId } = useParams<{ threadId: string }>();
    const [reply, setReply] = React.useState('');
    const [thread, setThread] = React.useState<ForumThread | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
        if (threadId) {
            setIsLoading(true);
            fetchForumThreads().then(allThreads => {
                const currentThread = allThreads.find(t => t.id.toString() === threadId);
                setThread(currentThread || null);
                setIsLoading(false);
            });
        }
    }, [threadId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner />
            </div>
        );
    }

    if (!thread) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la consulta.</div>;
    }

    const questionPost = {
        content: thread.question,
        authorName: thread.authorName,
        createdAt: thread.createdAt,
        authorRole: 'student' as 'student'
    };

    const handlePostReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (reply.trim()) {
            // This is just a mock update, it won't persist.
            alert(`Respuesta enviada:\n"${reply}"`);
            setReply('');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{thread.title}</h1>
            </div>
            
            <div className="space-y-4">
                <PostCard post={questionPost} isQuestion />
                {thread.replies.map(reply => (
                    <PostCard key={reply.id} post={reply} />
                ))}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="font-semibold mb-2">Escribe una respuesta</h2>
                <form onSubmit={handlePostReply}>
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={4}
                        className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Aporta a la conversación..."
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!reply.trim()}
                            className="bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-indigo-800 disabled:bg-slate-300"
                        >
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForumThreadScreen;
