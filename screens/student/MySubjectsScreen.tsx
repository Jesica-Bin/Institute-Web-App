import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudentSubjects } from '../../data';
import { ChevronRightIcon, SearchIcon, DocumentTextIcon } from '../../components/Icons';
import SubjectDetailScreen from './SubjectDetailScreen';

type Tab = 'cursando' | 'terminadas' | 'todas';

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => {
    const baseClasses = "py-2 px-4 font-semibold text-sm rounded-full transition-colors flex-1";
    const activeClasses = active ? "bg-indigo-700 text-white" : "bg-white text-slate-700 hover:bg-slate-100";
    return <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>{label}</button>;
};

const DetailPlaceholder = () => (
    <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center">
        <DocumentTextIcon className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Selecciona una materia</h3>
        <p className="text-slate-500 mt-2">Elige una materia de la lista para ver todos sus detalles, notas y asistencia.</p>
    </div>
);

const MySubjectsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('cursando');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredSubjects = useMemo(() => {
        return mockStudentSubjects.filter(subject => {
            const matchesTab = activeTab === 'todas' || subject.status === activeTab;
            const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchTerm]);
    
    // On desktop, manage the selected subject based on the filtered list
    useEffect(() => {
        if (isDesktop) {
            const isSelectionValid = filteredSubjects.some(s => s.id === selectedSubjectId);
            // If the list has items but the selection is invalid (or doesn't exist), select the first item.
            if (filteredSubjects.length > 0 && !isSelectionValid) {
                setSelectedSubjectId(filteredSubjects[0].id);
            } 
            // If the list is empty, clear the selection.
            else if (filteredSubjects.length === 0) {
                setSelectedSubjectId(null);
            }
        }
    }, [isDesktop, filteredSubjects]);


    const handleSubjectClick = (subjectId: string) => {
        if (isDesktop) {
            setSelectedSubjectId(subjectId);
        } else {
            navigate(`/materia-detalle/${subjectId}`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            {/* Left Column: List */}
            <div className="lg:col-span-1 space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Busca una materia..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400" />
                    </div>
                </div>

                <div className="bg-slate-200 p-1 rounded-full flex space-x-1">
                    <TabButton label="Todas" active={activeTab === 'todas'} onClick={() => setActiveTab('todas')} />
                    <TabButton label="Cursando" active={activeTab === 'cursando'} onClick={() => setActiveTab('cursando')} />
                    <TabButton label="Terminadas" active={activeTab === 'terminadas'} onClick={() => setActiveTab('terminadas')} />
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {filteredSubjects.length > 0 ? filteredSubjects.map(subject => (
                            <li key={subject.id}>
                                <button
                                    onClick={() => handleSubjectClick(subject.id)}
                                    className={`w-full text-left p-4 transition-colors ${
                                        selectedSubjectId === subject.id && isDesktop ? 'bg-indigo-50' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`font-semibold ${selectedSubjectId === subject.id && isDesktop ? 'text-indigo-800' : ''}`}>
                                                {subject.name}
                                            </p>
                                            <p className="text-sm text-slate-500">{subject.professor}</p>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-slate-400 lg:hidden" />
                                    </div>
                                </button>
                            </li>
                        )) : (
                            <li className="p-8 text-center text-slate-500">
                                <p>No se encontraron materias que coincidan con tu búsqueda.</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Right Column: Detail */}
            <div className="hidden lg:block lg:col-span-2">
                 {selectedSubjectId ? (
                    <SubjectDetailScreen subjectId={selectedSubjectId} />
                ) : (
                    <DetailPlaceholder />
                )}
            </div>
        </div>
    );
};

export default MySubjectsScreen;