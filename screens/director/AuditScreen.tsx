import * as React from 'react';
import { mockAuditLogs } from '../../data';
import { AuditLog, UserRole } from '../../types';
import { ShieldCheckIcon, CircleStackIcon, ArrowDownTrayIcon } from '../../components/Icons';

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const styles: Record<UserRole, string> = {
        student: 'bg-blue-100 text-blue-800',
        teacher: 'bg-green-100 text-green-800',
        preceptor: 'bg-indigo-100 text-indigo-800',
        director: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[role]}`}>{role}</span>;
};

const AuditScreen: React.FC = () => {
    
    const handleGenerateBackup = () => {
        alert('Simulando generación de backup de la base de datos... El archivo se enviará a su correo.');
    };

    const handleDownloadLogs = () => {
        alert('Simulando descarga de logs de auditoría en formato CSV.');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Auditoría y Backups</h1>
                <p className="text-slate-500 mt-1">Supervisa la actividad del sistema y gestiona las copias de seguridad.</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Acciones del Sistema</h2>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={handleGenerateBackup}
                        className="flex-1 flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        <CircleStackIcon className="w-5 h-5" />
                        <span>Generar Backup</span>
                    </button>
                    <button
                        onClick={handleDownloadLogs}
                        className="flex-1 flex items-center justify-center space-x-2 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        <span>Descargar Logs</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                        <ShieldCheckIcon className="w-6 h-6 text-indigo-700" />
                        <span>Registro de Auditoría Reciente</span>
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuario</th>
                                <th scope="col" className="px-6 py-3">Acción</th>
                                <th scope="col" className="px-6 py-3">Fecha y Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAuditLogs.map(log => (
                                <tr key={log.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-slate-900">{log.user}</p>
                                        <RoleBadge role={log.role} />
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{log.action}</td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString('es-ES')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditScreen;