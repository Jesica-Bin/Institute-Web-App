import * as React from 'react';
import { courseData as initialCourseData, mockCareers as initialCareers, mockProfessors } from '../../data';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, XMarkIcon, PencilIcon } from '../../components/Icons';

// In-memory representation for the screen state
interface Subject {
    name: string;
    professor: string;
    program?: File | null;
    schedule: string;
}

interface Year {
    name: string;
    subjects: Subject[];
}

interface Career {
    name: string;
    duration: number; // in years
    resolution?: string;
    years: Year[];
}


const AcademicManagementScreen: React.FC = () => {
    // Initialize state from mock data
    const [careers, setCareers] = React.useState<Career[]>(() => {
        return initialCareers.map(careerName => {
            const duration = Object.keys(initialCourseData[careerName] || {}).length;
            return {
                name: careerName,
                duration: duration,
                resolution: 'Res. 123/20',
                years: Object.entries(initialCourseData[careerName] || {}).map(([yearName, subjects]) => ({
                    name: yearName,
                    subjects: subjects.map(subjectName => ({
                        name: subjectName,
                        professor: mockProfessors[Math.floor(Math.random() * mockProfessors.length)].name, 
                        schedule: 'A definir',
                    }))
                }))
            };
        });
    });

    const [expandedCareers, setExpandedCareers] = React.useState<string[]>([]);
    const [expandedYears, setExpandedYears] = React.useState<string[]>([]); // key: `careerName-yearName`

    const [isCareerModalOpen, setCareerModalOpen] = React.useState(false);
    const [isSubjectModalOpen, setSubjectModalOpen] = React.useState(false);
    const [subjectModalContext, setSubjectModalContext] = React.useState<{ careerIndex: number; yearIndex: number } | null>(null);

    // --- State for New Career Modal ---
    const [newCareerName, setNewCareerName] = React.useState('');
    const [newCareerDuration, setNewCareerDuration] = React.useState(1);
    const [newCareerResolution, setNewCareerResolution] = React.useState('');

    // --- State for New Subject Modal ---
    const [newSubjectName, setNewSubjectName] = React.useState('');
    const [newSubjectProfessor, setNewSubjectProfessor] = React.useState(mockProfessors[0]?.name || '');
    const [newSubjectProgram, setNewSubjectProgram] = React.useState<File | null>(null);
    const [newSubjectSchedule, setNewSubjectSchedule] = React.useState('');


    const toggleCareer = (careerName: string) => {
        setExpandedCareers(prev => prev.includes(careerName) ? prev.filter(c => c !== careerName) : [...prev, careerName]);
    };

    const toggleYear = (careerName: string, yearName: string) => {
        const key = `${careerName}-${yearName}`;
        setExpandedYears(prev => prev.includes(key) ? prev.filter(y => y !== key) : [...prev, key]);
    };

    const handleAddCareer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCareerName.trim() === '' || newCareerDuration < 1) return;

        const newCareer: Career = {
            name: newCareerName,
            duration: newCareerDuration,
            resolution: newCareerResolution,
            years: Array.from({ length: newCareerDuration }, (_, i) => ({
                name: `${i + 1}º Año`,
                subjects: [],
            })),
        };

        setCareers(prev => [...prev, newCareer]);
        setCareerModalOpen(false);
        setNewCareerName('');
        setNewCareerDuration(1);
        setNewCareerResolution('');
    };

    const handleOpenSubjectModal = (careerIndex: number, yearIndex: number) => {
        setSubjectModalContext({ careerIndex, yearIndex });
        setSubjectModalOpen(true);
    };

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subjectModalContext || newSubjectName.trim() === '') return;

        const { careerIndex, yearIndex } = subjectModalContext;
        const newSubject: Subject = {
            name: newSubjectName,
            professor: newSubjectProfessor,
            program: newSubjectProgram,
            schedule: newSubjectSchedule,
        };

        setCareers(prev => {
            const newCareers = [...prev];
            newCareers[careerIndex].years[yearIndex].subjects.push(newSubject);
            return newCareers;
        });

        setSubjectModalOpen(false);
        setNewSubjectName('');
        setNewSubjectProfessor(mockProfessors[0]?.name || '');
        setNewSubjectProgram(null);
        setNewSubjectSchedule('');
        setSubjectModalContext(null);
    };

    const inputStyle = "w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500";
    
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión Académica</h1>
                        <p className="text-slate-500 mt-1">Administra carreras, materias y planes de estudio.</p>
                    </div>
                    <button
                        onClick={() => setCareerModalOpen(true)}
                        className="flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Nueva Carrera</span>
                    </button>
                </div>

                <div className="space-y-3">
                    {careers.map((career, careerIndex) => (
                        <div key={career.name} className="bg-white rounded-lg shadow-sm">
                            <button onClick={() => toggleCareer(career.name)} className="w-full flex justify-between items-center p-4 text-left">
                                <h2 className="text-lg font-bold text-indigo-800">{career.name}</h2>
                                {expandedCareers.includes(career.name) ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                            </button>

                            {expandedCareers.includes(career.name) && (
                                <div className="px-4 pb-4 space-y-2">
                                    {career.years.map((year, yearIndex) => (
                                        <div key={year.name} className="bg-slate-50 rounded-md">
                                            <button onClick={() => toggleYear(career.name, year.name)} className="w-full flex justify-between items-center p-3 text-left">
                                                <h3 className="font-semibold">{year.name}</h3>
                                                {expandedYears.includes(`${career.name}-${year.name}`) ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                                            </button>

                                            {expandedYears.includes(`${career.name}-${year.name}`) && (
                                                <div className="px-3 pb-3 space-y-2">
                                                    {year.subjects.length > 0 ? (
                                                        year.subjects.map(subject => (
                                                            <div key={subject.name} className="bg-white p-2 rounded border flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-medium text-sm">{subject.name}</p>
                                                                    <p className="text-xs text-slate-500">{subject.professor}</p>
                                                                </div>
                                                                <button className="p-1 text-slate-400 hover:text-indigo-600"><PencilIcon className="w-4 h-4" /></button>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-slate-500 text-center py-2">No hay materias cargadas.</p>
                                                    )}
                                                    <button
                                                        onClick={() => handleOpenSubjectModal(careerIndex, yearIndex)}
                                                        className="w-full text-sm text-indigo-600 font-semibold p-2 rounded-md hover:bg-indigo-50 flex items-center justify-center space-x-1"
                                                    >
                                                        <PlusIcon className="w-4 h-4" />
                                                        <span>Agregar Materia</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* New Career Modal */}
            {isCareerModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setCareerModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleAddCareer}>
                            <div className="p-6 border-b"><h3 className="text-lg font-bold">Agregar Nueva Carrera</h3></div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="careerName" className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Carrera</label>
                                    <input id="careerName" type="text" value={newCareerName} onChange={e => setNewCareerName(e.target.value)} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="careerDuration" className="block text-sm font-medium text-slate-700 mb-1">Duración (en años)</label>
                                    <input id="careerDuration" type="number" min="1" max="10" value={newCareerDuration} onChange={e => setNewCareerDuration(parseInt(e.target.value))} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="careerResolution" className="block text-sm font-medium text-slate-700 mb-1">Resolución (opcional)</label>
                                    <input id="careerResolution" type="text" value={newCareerResolution} onChange={e => setNewCareerResolution(e.target.value)} className={inputStyle} />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end space-x-2 rounded-b-lg">
                                <button type="button" onClick={() => setCareerModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* New Subject Modal */}
            {isSubjectModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSubjectModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleAddSubject}>
                            <div className="p-6 border-b"><h3 className="text-lg font-bold">Agregar Nueva Materia</h3></div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="subjectName" className="block text-sm font-medium text-slate-700 mb-1">Nombre de la Materia</label>
                                    <input id="subjectName" type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} required className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="subjectProfessor" className="block text-sm font-medium text-slate-700 mb-1">Profesor/a a cargo</label>
                                    <select id="subjectProfessor" value={newSubjectProfessor} onChange={e => setNewSubjectProfessor(e.target.value)} required className={inputStyle}>
                                        {mockProfessors.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="subjectProgram" className="block text-sm font-medium text-slate-700 mb-1">Programa académico (PDF)</label>
                                    <input id="subjectProgram" type="file" accept=".pdf" onChange={e => setNewSubjectProgram(e.target.files ? e.target.files[0] : null)} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                                </div>
                                 <div>
                                    <label htmlFor="subjectSchedule" className="block text-sm font-medium text-slate-700 mb-1">Horario y aula</label>
                                    <input id="subjectSchedule" type="text" value={newSubjectSchedule} onChange={e => setNewSubjectSchedule(e.target.value)} required className={inputStyle} placeholder="Ej: Lunes 08:00 - Aula 10" />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 flex justify-end space-x-2 rounded-b-lg">
                                <button type="button" onClick={() => setSubjectModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded-md font-semibold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-700 text-white rounded-md font-semibold">Guardar Materia</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AcademicManagementScreen;