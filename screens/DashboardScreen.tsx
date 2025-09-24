import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockUser, mockAgenda, mockAllNotifications } from '../data';
import { NotificationType } from '../types';
import { 
    ChevronRightIcon, UsersIcon, DocumentTextIcon, DocumentChartBarIcon, PlusIcon,
    MegaphoneIcon, WrenchScrewdriverIcon, XMarkIcon, CheckIcon, PencilIcon,
    CheckBadgeIcon, CalendarIcon
} from '../components/Icons';


// --- Shortcut Management ---
interface Shortcut {
    key: string;
    to: string;
    text: string;
    icon: React.ElementType;
}

const ALL_PRECEPTOR_SHORTCUTS: Shortcut[] = [
    { key: 'estudiantes', to: '/gestion-estudiantes', text: 'Estudiantes', icon: UsersIcon },
    { key: 'solicitudes', to: '/solicitudes', text: 'Solicitudes', icon: DocumentTextIcon },
    { key: 'reportes', to: '/reportes', text: 'Reportes', icon: DocumentChartBarIcon },
    { key: 'asistencia', to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { key: 'eventos', to: '/gestion-eventos', text: 'Eventos', icon: CalendarIcon }
];
const MAX_SHORTCUTS = 4;

// --- Modal Component for Managing Shortcuts ---
const ManageShortcutsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedKeys: string[]) => void;
    currentShortcutKeys: string[];
}> = ({ isOpen, onClose, onSave, currentShortcutKeys }) => {
    const [selectedKeys, setSelectedKeys] = useState(currentShortcutKeys);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedKeys(currentShortcutKeys);
        }
    }, [isOpen, currentShortcutKeys]);
    
    const handleToggle = (key: string) => {
        setSelectedKeys(prev => 
            prev.includes(key) 
                ? prev.filter(k => k !== key) 
                : [...prev, key]
        );
    };

    const handleSave = () => {
        onSave(selectedKeys);
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800">Editar Atajos</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <XMarkIcon className="w-5 h-5 text-slate-600" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-sm text-slate-500 mb-4">Selecciona los atajos que quieres ver en tu panel de inicio (máx. {MAX_SHORTCUTS}).</p>
                    <div className="space-y-3">
                        {ALL_PRECEPTOR_SHORTCUTS.map(shortcut => {
                            const isSelected = selectedKeys.includes(shortcut.key);
                            const isDisabled = !isSelected && selectedKeys.length >= MAX_SHORTCUTS;
                            return (
                                <label 
                                    key={shortcut.key} 
                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                                        isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() => handleToggle(shortcut.key)}
                                        className="sr-only peer"
                                    />
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                        <CheckIcon className={`w-3 h-3 text-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                    <shortcut.icon className={`w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                                    <span className={`font-medium ${isSelected ? 'text-indigo-800' : 'text-slate-700'}`}>{shortcut.text}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-4 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Guardar</button>
                </div>
            </div>
        </div>
    );
};


const ShortcutButton = ({ to, text, icon: Icon }: { to: string, text: string, icon: React.ElementType }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
        <Icon className="w-8 h-8 text-indigo-700 mb-2" />
        <span className="text-sm font-semibold text-slate-800 text-center">{text}</span>
    </Link>
);

const NotificationIcon = ({ type }: { type: NotificationType }) => {
    const iconProps = { className: "w-5 h-5 text-slate-500" };
    switch (type) {
        case NotificationType.SYSTEM:
            return <WrenchScrewdriverIcon {...iconProps} />;
        case NotificationType.OFFICIAL:
            return <MegaphoneIcon {...iconProps} />;
        default:
            return <div className="w-3 h-3 bg-slate-400 rounded-full"></div>;
    }
};

const DashboardScreen: React.FC = () => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([
        ALL_PRECEPTOR_SHORTCUTS.find(s => s.key === 'estudiantes')!,
        ALL_PRECEPTOR_SHORTCUTS.find(s => s.key === 'solicitudes')!,
        ALL_PRECEPTOR_SHORTCUTS.find(s => s.key === 'reportes')!,
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveShortcuts = (newKeys: string[]) => {
        const newShortcutList = ALL_PRECEPTOR_SHORTCUTS.filter(s => newKeys.includes(s.key));
        setShortcuts(newShortcutList);
        setIsModalOpen(false);
    };

    const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const recentNotifications = [...mockAllNotifications]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);

    return (
        <>
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Bienvenida, {mockUser.name.split(' ')[0]}</h1>
                <p className="text-slate-500 capitalize">{today}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Agenda Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Agenda de hoy</h2>
                            <Link 
                                to="/calendario" 
                                className="text-sm font-medium text-indigo-600 hover:underline"
                            >
                                Ir a calendario
                            </Link>
                        </div>
                        <div className="space-y-3 flex-grow">
                            {mockAgenda.slice(0, 5).map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                                        <div>
                                            <p className="font-semibold">{item.subject}</p>
                                            <p className="text-sm text-slate-500">{item.course}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">{item.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link to="/tomar-asistencia" className="flex items-center justify-center w-full bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                                <span>Ir a tomar asistencia</span>
                                <ChevronRightIcon className="w-5 h-5 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Notifications Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Notificaciones recientes</h2>
                            <Link to="/notificaciones" className="text-sm font-medium text-indigo-600 hover:underline">
                                Ver todas
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentNotifications.map(notif => (
                                 <div key={notif.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <NotificationIcon type={notif.type} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{notif.title}</p>
                                        <p className="text-xs text-slate-500">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                     {/* Shortcuts Card */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Atajos</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Fix: Destructured shortcut to pass props explicitly and avoid spreading an unwanted 'key' prop. */}
                            {shortcuts.map(({ key, to, text, icon }) => (
                                <ShortcutButton key={key} to={to} text={text} icon={icon} />
                            ))}
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex flex-col items-center justify-center p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-200 hover:border-slate-400 transition-colors"
                            >
                                {shortcuts.length > 0 ? (
                                    <>
                                        <PencilIcon className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-semibold text-slate-500 text-center">Editar atajos</span>
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="w-8 h-8 text-slate-400 mb-2" />
                                        <span className="text-sm font-semibold text-slate-500 text-center">Agregar atajo</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ManageShortcutsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveShortcuts}
            currentShortcutKeys={shortcuts.map(s => s.key)}
        />
        </>
    );
};

export default DashboardScreen;