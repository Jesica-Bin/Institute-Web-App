import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStudentSubjects } from '../../data';

const NewThreadScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const subject = mockStudentSubjects.find(s => s.id === subjectId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        alert('Tu pregunta ha sido publicada en el foro.');
        navigate(`/materias/${subjectId}/foro`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Nueva Pregunta</h1>
                <p className="text-slate-500 mt-1">Tu pregunta será visible para tus compañeros y el docente de <strong>{subject?.name}</strong>.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Título de la pregunta</label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ej: Duda sobre el ciclo de vida de un Activity"
                        />
                    </div>
                    <div>
                         <label htmlFor="question" className="block text-sm font-medium text-slate-700 mb-1">Detalla tu pregunta</label>
                         <textarea
                            id="question"
                            rows={8}
                            required
                            className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Explica tu duda lo más claro posible..."
                         />
                    </div>
                     <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-800"
                        >
                            Publicar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewThreadScreen;
