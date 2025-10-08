import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockTeacherSubjectDetails } from '../../data';
import { Grade } from '../../types';

const ManageGradesScreen: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const subject = subjectId ? mockTeacherSubjectDetails[subjectId] : null;

    const [evaluationType, setEvaluationType] = React.useState<Grade['type']>('Parcial 1');
    const [grades, setGrades] = React.useState<{ [studentId: number]: string }>({});

    // Effect to load current grades for the selected evaluation type
    React.useEffect(() => {
        if (subject) {
            const initialGrades: { [studentId: number]: string } = {};
            subject.enrolledStudents.forEach(student => {
                // In a real app, you'd fetch student grades for this subject
                // Here, we'll just initialize them as empty
                initialGrades[student.id] = '';
            });
            setGrades(initialGrades);
        }
    }, [subject, evaluationType]);


    if (!subject) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">Materia no encontrada.</div>;
    }

    const handleGradeChange = (studentId: number, value: string) => {
        const numericValue = parseInt(value, 10);
        if (value === '' || (numericValue >= 1 && numericValue <= 10)) {
            setGrades(prev => ({ ...prev, [studentId]: value }));
        }
    };
    
    const handleSaveGrades = () => {
        // In a real application, you would send this data to your backend API.
        // You would also trigger notifications from the backend.
        // For this simulation, we just show an alert.
        console.log('Saving grades for', evaluationType, grades);
        alert('Notas guardadas y notificaciones enviadas a los estudiantes.');
        navigate(`/materias/detalle/${subjectId}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Cargar Notas</h1>
                <p className="text-slate-500 mt-1">{subject.name} - {subject.course}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                 <label htmlFor="evaluation-type" className="block text-sm font-medium text-slate-700 mb-1">
                    Seleccionar Evaluación
                </label>
                <select
                    id="evaluation-type"
                    value={evaluationType}
                    onChange={(e) => setEvaluationType(e.target.value as Grade['type'])}
                    className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="Parcial 1">Parcial 1</option>
                    <option value="Parcial 2">Parcial 2</option>
                    <option value="Final">Final</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <ul className="divide-y divide-slate-100">
                    {subject.enrolledStudents.map(student => (
                        <li key={student.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <p className="font-medium mb-2 sm:mb-0">{student.lastName}, {student.name}</p>
                            <div className="flex items-center space-x-2">
                                <label htmlFor={`grade-${student.id}`} className="text-sm text-slate-500">Nota:</label>
                                <input
                                    id={`grade-${student.id}`}
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={grades[student.id] || ''}
                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                    className="w-24 p-2 text-center bg-white border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="-"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="flex justify-end">
                <button
                    onClick={handleSaveGrades}
                    className="bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                    Guardar Notas
                </button>
            </div>
        </div>
    );
};

export default ManageGradesScreen;
