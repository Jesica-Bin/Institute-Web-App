
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockStudents, mockCareers, mockYears } from '../data';
import { Student } from '../types';
import { SearchIcon, FunnelIcon, UsersIcon } from '../components/Icons';
import StudentProfileScreen from './StudentProfileScreen';

const getYearFromLegajo = (legajo: string): string => {
    const yearDigit = legajo.split('-')[1]?.[0];
    if (yearDigit === '1') return '1º Año';
    if (yearDigit === '2') return '2º Año';
    if (yearDigit === '3') return '3º Año';
    return ''; // Default case if year can't be determined
};

const DetailPlaceholder: React.FC<{ icon: React.ElementType; message: string; }> = ({ icon: Icon, message }) => (
    <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center min-h-[60vh]">
        <Icon className="w-16 h-16 text-slate-300 mb-4" />
        <h3 className="text-xl font-bold text-slate-700">Selecciona un elemento</h3>
        <p className="text-slate-500 mt-2">{message}</p>
    </div>
);


const StudentManagementScreen: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCareer, setSelectedCareer] = React.useState('');
    const [selectedYear, setSelectedYear] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);
    const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null);
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredStudents = React.useMemo(() => {
        return mockStudents.filter(student => {
            const nameMatches = `${student.name} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
            const careerMatches = selectedCareer ? student.carrera === selectedCareer : true;
            const yearMatches = selectedYear ? getYearFromLegajo(student.legajo) === selectedYear : true;
            return nameMatches && careerMatches && yearMatches;
        });
    }, [searchTerm, selectedCareer, selectedYear]);
    
    React.useEffect(() => {
        if (isDesktop) {
            const selectionInList = filteredStudents.some(s => s.id === selectedStudent?.id);
            if (filteredStudents.length > 0 && !selectionInList) {
                setSelectedStudent(filteredStudents[0]);
            } else if (filteredStudents.length === 0) {
                setSelectedStudent(null);
            }
        }
    }, [isDesktop, filteredStudents]);

    const handleViewProfile = (student: Student) => {
        if (isDesktop) {
            setSelectedStudent(student);
        } else {
            navigate('/estudiante-perfil', { state: { student } });
        }
    };

    const selectStyle = "w-full p-3 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-grow">
                            <input 
                                type="text"
                                placeholder="Busca un estudiante por nombre..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-3 rounded-lg shadow-sm transition-colors ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-500 hover:bg-slate-100'}`}
                            aria-label="Mostrar filtros"
                            aria-expanded={showFilters}
                        >
                            <FunnelIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label htmlFor="career-filter" className="sr-only">Filtrar por carrera</label>
                                <select id="career-filter" value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)} className={selectStyle}>
                                    <option value="">Todas las carreras</option>
                                    {mockCareers.map(career => <option key={career} value={career}>{career}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="year-filter" className="sr-only">Filtrar por año</label>
                                <select id="year-filter" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className={selectStyle}>
                                    <option value="">Todos los años</option>
                                    {mockYears.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <ul className="divide-y divide-slate-100">
                        {filteredStudents.length > 0 ? filteredStudents.map(student => (
                            <li key={student.id}>
                                <button onClick={() => handleViewProfile(student)} className={`w-full text-left p-4 transition-colors ${selectedStudent?.id === student.id && isDesktop ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}>
                                    <div>
                                        <p className={`font-medium ${selectedStudent?.id === student.id && isDesktop ? 'text-indigo-800' : ''}`}>{student.name} {student.lastName}</p>
                                        <p className="text-sm text-slate-500">{student.carrera} - {getYearFromLegajo(student.legajo)}</p>
                                    </div>
                                </button>
                            </li>
                        )) : (
                            <li className="p-8 text-center text-slate-500">
                                <p>No se encontraron estudiantes con los filtros aplicados.</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="hidden lg:block lg:col-span-2">
                 {selectedStudent ? (
                    <StudentProfileScreen student={selectedStudent} />
                ) : (
                    <DetailPlaceholder icon={UsersIcon} message="Selecciona un estudiante para ver su perfil detallado, historial de solicitudes y asistencia." />
                )}
            </div>
        </div>
    );
};

export default StudentManagementScreen;