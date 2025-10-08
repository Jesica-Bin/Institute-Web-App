import * as React from 'react';
import { Link } from 'react-router-dom';
import { mockDirectorUser, mockStudentStatsByCareer, mockDropoutData, mockSuggestions } from '../../data';
import { UsersIcon, DocumentChartBarIcon, BriefcaseIcon, MegaphoneIcon } from '../../components/Icons';
import { SuggestionStatus } from '../../types';

const KPICard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-indigo-100 rounded-full">
            <Icon className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-sm text-slate-500">{title}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ title: string; data: { name: string; value: number; color: string }[], unit?: string }> = ({ title, data, unit = '' }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.name} className="flex items-center">
                        <span className="text-xs font-semibold text-slate-500 w-16 text-right pr-3">{item.name}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-6">
                            <div
                                className={`${item.color} h-6 rounded-full flex items-center justify-end px-2`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                                <span className="text-xs font-bold text-white">{item.value}{unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DirectorDashboardScreen: React.FC = () => {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const pendingClaims = mockSuggestions.filter(s => s.status === SuggestionStatus.IN_REVIEW || s.status === SuggestionStatus.SENT).length;
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Panel de Dirección</h1>
                <p className="text-slate-500 capitalize">Bienvenida, {mockDirectorUser.name.split(' ')[0]}</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Alumnos Activos" value="853" icon={UsersIcon} />
                <KPICard title="Docentes" value="42" icon={UsersIcon} />
                <KPICard title="Carreras" value="4" icon={BriefcaseIcon} />
                <KPICard title="Reclamos Pendientes" value={pendingClaims.toString()} icon={MegaphoneIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Main content */}
                <div className="lg:col-span-3 space-y-6">
                    <BarChart title="Alumnos por Carrera" data={mockStudentStatsByCareer} />
                    <BarChart title="Tasa de Deserción (Anual)" data={mockDropoutData.map(d => ({ name: d.year.toString(), value: d.rate, color: 'bg-red-500' }))} unit="%" />
                </div>
                {/* Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-slate-700 mb-3">Accesos Rápidos</h3>
                        <div className="space-y-2">
                             <Link to="/usuarios" className="block w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md font-medium text-slate-700">Gestionar Usuarios</Link>
                             <Link to="/gestion-academica" className="block w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md font-medium text-slate-700">Gestionar Carreras</Link>
                             <Link to="/comunicados-director" className="block w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md font-medium text-slate-700">Enviar Comunicado</Link>
                             <Link to="/gestion-reclamos" className="block w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-md font-medium text-slate-700">Ver Reclamos</Link>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default DirectorDashboardScreen;