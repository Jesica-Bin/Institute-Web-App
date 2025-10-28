import * as React from 'react';
import { fetchManagedUsers } from '../../db';
import { ManagedUser, UserRole } from '../../types';
import { SearchIcon, FunnelIcon, PlusIcon, PencilIcon, TrashIcon } from '../../components/Icons';
import Spinner from '../../components/Spinner';

const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
    const styles: Record<UserRole, string> = {
        student: 'bg-blue-100 text-blue-800',
        teacher: 'bg-green-100 text-green-800',
        preceptor: 'bg-indigo-100 text-indigo-800',
        director: 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[role]}`}>{role}</span>;
};

const StatusBadge: React.FC<{ status: 'activo' | 'inactivo' }> = ({ status }) => {
    const styles = status === 'activo'
        ? 'bg-green-100 text-green-800'
        : 'bg-slate-100 text-slate-600';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles}`}>{status}</span>;
};


const UserManagementScreen: React.FC = () => {
    const [users, setUsers] = React.useState<ManagedUser[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState<UserRole | 'all'>('all');

    React.useEffect(() => {
        fetchManagedUsers().then(data => {
            setUsers(data);
            setIsLoading(false);
        });
    }, []);

    const filteredUsers = React.useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800">Usuarios y Roles</h1>
                    <p className="text-slate-500 mt-1">Gestiona el acceso y los permisos de los usuarios.</p>
                </div>
                <button className="flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Agregar Usuario</span>
                </button>
            </div>
           
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div className="relative flex-grow w-full">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 bg-white border border-slate-300 rounded-lg"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                    <div className="relative w-full md:w-auto">
                         <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value as any)}
                            className="w-full p-2 pl-9 bg-white border border-slate-300 rounded-lg appearance-none"
                         >
                            <option value="all">Todos los roles</option>
                            <option value="student">Estudiante</option>
                            <option value="teacher">Docente</option>
                            <option value="preceptor">Preceptor</option>
                            <option value="director">Dirección</option>
                         </select>
                         <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

             <div className="bg-white rounded-lg shadow-sm overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nombre</th>
                                    <th scope="col" className="px-6 py-3">Rol</th>
                                    <th scope="col" className="px-6 py-3">Estado</th>
                                    <th scope="col" className="px-6 py-3">Último Ingreso</th>
                                    <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {user.name}
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                                        <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                        <td className="px-6 py-4 text-slate-500">{user.lastLogin}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"><PencilIcon className="w-4 h-4"/></button>
                                                <button className="p-2 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-50"><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
             </div>
        </div>
    );
};

export default UserManagementScreen;
