import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, DocumentTextIcon, CalendarIcon, ChevronLeftIcon } from '../../components/Icons';
import { mockSubjectDetails } from '../../data';
import { SubjectDetail } from '../../types';
import { getSchoolYear, calculateTotalClassesForSubject } from '../../store';

const SchoolYearPieChart = ({ present, absent, justified, totalClasses }: { present: number, absent: number, justified: number, totalClasses: number }) => {
    const attended = present + absent + justified;
    if (totalClasses === 0) {
        return <div className="w-[180px] h-[180px] lg:w-[280px] lg:h-[280px] bg-slate-200 rounded-full flex items-center justify-center"><span className="text-sm text-slate-500">N/A</span></div>;
    }

    const circumference = 2 * Math.PI * 45; // radius = 45px for a 100x100 viewBox

    const presentStroke = (present / totalClasses) * circumference;
    const absentStroke = (absent / totalClasses) * circumference;
    const justifiedStroke = (justified / totalClasses) * circumference;

    return (
        <div className="relative flex items-center justify-center flex-shrink-0 w-[180px] h-[180px] lg:w-[280px] lg:h-[280px]">
             <svg width="100%" height="100%" viewBox="0 0 100 100" className="-rotate-90">
                {/* Track */}
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" className="stroke-slate-200" />
                
                {/* Present */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-green-500"
                    strokeDasharray={`${presentStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={0}
                />
                 {/* Absent */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-red-500"
                    strokeDasharray={`${absentStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={-presentStroke}
                />
                {/* Justified */}
                <circle 
                    cx="50" cy="50" r="45" fill="none" strokeWidth="10" 
                    className="stroke-indigo-500"
                    strokeDasharray={`${justifiedStroke} ${circumference}`}
                    strokeLinecap="round"
                    strokeDashoffset={-(presentStroke + absentStroke)}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl lg:text-6xl font-bold text-slate-800">{attended}</span>
                <span className="text-sm lg:text-base text-slate-500">de {totalClasses}</span>
                 <span className="text-sm lg:text-base text-slate-500">clases</span>
            </div>
        </div>
    );
};

const AbsenceRiskBar = ({ absences, maxAbsences }: { absences: number, maxAbsences: number }) => {
    if (maxAbsences === 0) return null;

    const percentage = (absences / maxAbsences) * 100;
    const isRisk = percentage >= 75;
    const isDanger = percentage >= 100;

    let barColor = 'bg-green-500';
    if (isDanger) barColor = 'bg-red-500';
    else if (isRisk) barColor = 'bg-yellow-400';

    const remaining = maxAbsences - absences;
    let statusMessage = '';
    if (remaining > 2) statusMessage = `Te quedan ${remaining} faltas para alcanzar el límite.`;
    else if (remaining > 0) statusMessage = `¡Cuidado! Te quedan solo ${remaining} faltas.`;
    else if (remaining === 0) statusMessage = `Alcanzaste el límite de ${maxAbsences} faltas.`;
    else statusMessage = `Superaste el límite por ${Math.abs(remaining)} falta(s).`;

    return (
        <div className="space-y-2 w-full px-4">
            <div className="w-full bg-slate-200 rounded-full h-4">
                <div
                    className={`${barColor} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-500">
                <span>{absences}</span>
                <span>Límite: {maxAbsences}</span>
            </div>
            <p className={`text-base font-semibold text-center pt-2 ${isDanger ? 'text-red-600' : isRisk ? 'text-yellow-600' : 'text-slate-600'}`}>{statusMessage}</p>
        </div>
    );
};


const SubjectCarousel: React.FC<{ 
    subjects: SubjectDetail[];
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}> = ({ subjects, currentIndex, setCurrentIndex }) => {

    const handlePrev = () => {
        setCurrentIndex(currentIndex === 0 ? subjects.length - 1 : currentIndex - 1);
    };

    const handleNext = () => {
        setCurrentIndex(currentIndex === subjects.length - 1 ? 0 : currentIndex + 1);
    };

    if (subjects.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center text-slate-500">
                No hay materias en curso para mostrar.
            </div>
        );
    }
    
    const currentSubject = subjects[currentIndex];
    const { presents = 0, absences = 0, justified = 0, maxAbsences = 1, totalClasses = 1 } = currentSubject;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center px-2">
                <button 
                    onClick={handlePrev} 
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Materia anterior"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-slate-500" />
                </button>
                <h3 className="font-bold text-slate-800 text-center text-lg">{currentSubject.name}</h3>
                <button 
                    onClick={handleNext} 
                    className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    aria-label="Siguiente materia"
                >
                    <ChevronRightIcon className="w-6 h-6 text-slate-500" />
                </button>
            </div>
            
            <div className="flex flex-row items-center justify-center gap-6 lg:gap-12 py-4 lg:py-6">
                <SchoolYearPieChart 
                    present={presents}
                    absent={absences}
                    justified={justified}
                    totalClasses={totalClasses}
                />
                <div className="flex flex-col space-y-2 lg:space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>
                        <span className="text-sm lg:text-lg">Presentes ({presents})</span>
                    </div>
                     <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm lg:text-lg">Ausentes ({absences})</span>
                    </div>
                     <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 lg:w-4 lg:h-4 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm lg:text-lg">Justificadas ({justified})</span>
                    </div>
                </div>
            </div>
            
            <hr className="border-slate-100"/>

            <div className="pt-6 flex flex-col items-center">
                 <h4 className="text-base font-semibold text-slate-700 mb-4">Límite de Inasistencias</h4>
                 <AbsenceRiskBar absences={absences} maxAbsences={maxAbsences} />
            </div>

            <div className="flex justify-center items-center space-x-2 pt-4">
                {subjects.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            currentIndex === index ? 'bg-indigo-600' : 'bg-slate-300'
                        }`}
                    ></div>
                ))}
            </div>

        </div>
    );
};

const StudentAttendanceScreen: React.FC = () => {
    const subjectsInCourse = useMemo(() => Object.values(mockSubjectDetails).filter(s => s.status === 'cursando'), []);
    const [recalculatedSubjects, setRecalculatedSubjects] = useState<SubjectDetail[]>(subjectsInCourse);
    const location = useLocation();
    const { subjectId } = location.state || {};
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const { startDate, endDate } = getSchoolYear();
        if (startDate && endDate) {
            const updatedSubjects = subjectsInCourse.map(subject => {
                const { totalClasses, maxAbsences } = calculateTotalClassesForSubject(subject, startDate, endDate);
                return { ...subject, totalClasses, maxAbsences };
            });
            setRecalculatedSubjects(updatedSubjects);
        } else {
            setRecalculatedSubjects(subjectsInCourse);
        }
    }, [subjectsInCourse]);

    useEffect(() => {
        if (subjectId && subjectsInCourse.length > 0) {
            const initialIndex = subjectsInCourse.findIndex(s => s.id === subjectId);
            if (initialIndex !== -1) {
                setCurrentIndex(initialIndex);
            }
        }
    }, [subjectId, subjectsInCourse]);
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                 <h2 className="text-xl lg:text-3xl font-bold text-slate-800">Resumen de Asistencia</h2>
                 <p className="text-sm text-slate-500 mt-1">Visualiza el resumen de tu asistencia por materia y gestiona tus inasistencias.</p>
            </div>
            
            <SubjectCarousel 
                subjects={recalculatedSubjects} 
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />

            <Link
                to="/asistencia-registro"
                className="w-full flex items-center justify-between px-6 py-4 bg-amber-400 text-amber-900 font-bold rounded-lg hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
                <span>Ver registro de asistencia</span>
                <ChevronRightIcon className="w-5 h-5" />
            </Link>

            <div className="grid grid-cols-2 gap-6 pt-2">
                <Link to="/justificar-ausencia" className="flex flex-col items-center justify-center p-6 bg-indigo-800 text-white rounded-xl h-40 hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <DocumentTextIcon className="w-10 h-10 mb-2" />
                    <span className="font-semibold text-center">Justificar Ausencia</span>
                </Link>
                <Link to="/eventos-qr" className="flex flex-col items-center justify-center p-6 bg-indigo-800 text-white rounded-xl h-40 hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <CalendarIcon className="w-10 h-10 mb-2" />
                    <span className="font-semibold text-center">Asistencia a Eventos</span>
                </Link>
            </div>
        </div>
    );
};

export default StudentAttendanceScreen;