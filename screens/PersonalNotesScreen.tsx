
import * as React from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/Icons';

// --- Note type ---
interface Note {
    id: number;
    text: string;
    date: string;
}

// --- Note Modal Component ---
const NoteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: { id?: number; text: string }) => void;
    note: Note | null;
}> = ({ isOpen, onClose, onSave, note }) => {
    const [text, setText] = React.useState('');

    React.useEffect(() => {
        if (note) {
            setText(note.text);
        } else {
            setText('');
        }
    }, [note, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (text.trim()) {
            onSave({ id: note?.id, text });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">{note ? 'Editar Nota' : 'Nueva Nota'}</h3>
                </div>
                <div className="p-5">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escribe tu recordatorio aquí..."
                        autoFocus
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Guardar</button>
                </div>
            </div>
        </div>
    );
};

const PersonalNotesScreen: React.FC = () => {
    const [notes, setNotes] = React.useState<Note[]>([
        { id: 1, text: 'Llamar a profe cambio de horario', date: '1/10/2025' }
    ]);
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [editingNote, setEditingNote] = React.useState<Note | null>(null);

    const handleAddNote = () => {
        setEditingNote(null);
        setModalOpen(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setModalOpen(true);
    };

    const handleDeleteNote = (noteId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            setNotes(prev => prev.filter(n => n.id !== noteId));
        }
    };

    const handleSaveNote = (noteData: { id?: number; text: string }) => {
        if (noteData.id) { // Editing existing note
            setNotes(prev => prev.map(n => n.id === noteData.id ? { ...n, text: noteData.text } : n));
        } else { // Adding new note
            const newNote: Note = {
                id: Date.now(),
                text: noteData.text,
                date: new Date().toLocaleDateString('es-ES')
            };
            setNotes(prev => [newNote, ...prev]);
        }
        setModalOpen(false);
    };

    return (
        <>
            <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg shadow-sm relative overflow-hidden min-h-[calc(100vh-150px)]">
                {/* Background pattern */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute top-10 right-10 w-1 h-1 bg-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute bottom-10 left-20 w-1 h-1 bg-indigo-200 rounded-full opacity-50"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-50"></div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-indigo-900">Mis Notas.</h1>
                    <p className="text-base text-indigo-800/80 mb-4">Tu espacio personal para ideas y recordatorios.</p>
                    <button 
                        onClick={handleAddNote}
                        className="w-full bg-indigo-700 text-white my-4 py-3 rounded-xl shadow-md hover:bg-indigo-800 transition-colors flex items-center justify-center"
                    >
                        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                            <PlusIcon className="w-4 h-4" strokeWidth={3} />
                        </div>
                    </button>
                    <div className="space-y-3">
                        {notes.map(note => (
                            <div key={note.id} className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                                <p className="text-slate-800 font-medium">{note.text}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-slate-500">{note.date}</span>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleEditNote(note)} className="text-slate-500 hover:text-slate-800">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteNote(note.id)} className="text-slate-500 hover:text-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {notes.length === 0 && (
                            <div className="text-center py-16 text-indigo-800/60">
                                <p>No tienes notas todavía.</p>
                                <p className="mt-1">¡Usa el botón de arriba para agregar una!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveNote}
                note={editingNote}
            />
        </>
    );
};

export default PersonalNotesScreen;