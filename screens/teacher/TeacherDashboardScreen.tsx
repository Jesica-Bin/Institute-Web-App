import * as React from 'react';
import { Link } from 'react-router-dom';
import { mockTeacherUser, mockTeacherSubjects, mockOfficialCommunications } from '../../data';
import { ChevronRightIcon, CalendarIcon, MegaphoneIcon } from '../../components/Icons';

const TeacherDashboardScreen: React.FC = () => {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const recentNotifications = mockOfficialCommunications.slice(0, 3);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Bienvenido, {mockTeacherUser.name.split(' ')[0]}</h1>
                <p className="text-slate-500 capitalize">{today}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Próximas Clases Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Próximas Clases</h2>
                            <Link to="/calendario" className="text-sm font-medium text-indigo-600 hover:underline">
                                Ir a calendario
                            </Link>
                        </div>
                        <div className="space-y-3 flex-grow">
                            {mockTeacherSubjects.map(subject => (
                                <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                                        <div>
                                            <p className="font-semibold">{subject.name}</p>
                                            <p className="text-sm text-slate-500">{subject.course}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">{subject.nextClass}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Tareas Pendientes Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Tareas Pendientes</h2>
                        <div className="space-y-3">
                             <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-md border border-amber-200">
                                <div className="w-10 h-10 bg-amber-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                    <CalendarIcon className="w-5 h-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-amber-900">Cargar notas del Parcial 1</p>
                                    <p className="text-xs text-amber-700">Vence en 3 días</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notificaciones Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Últimas Notificaciones</h2>
                            <Link to="/notificaciones" className="text-sm font-medium text-indigo-600 hover:underline">
                                Ver todos
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentNotifications.map(comm => (
                                <div key={comm.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-md">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <MegaphoneIcon className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{comm.title}</p>
                                        <p className="text-xs text-slate-500">{comm.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardScreen;