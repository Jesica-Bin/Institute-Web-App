import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockUser } from '../data';
import { 
    HomeIcon, CheckBadgeIcon, UsersIcon, DocumentTextIcon, UserCircleIcon, 
    Cog6ToothIcon, QuestionMarkCircleIcon, ArrowRightOnRectangleIcon, XMarkIcon,
    CalendarDaysIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, QrCodeIcon
} from './Icons';

interface DrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const navLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { to: '/gestion-estudiantes', text: 'Gestión de estudiantes', icon: UsersIcon },
    { to: '/solicitudes', text: 'Gestión de solicitudes', icon: DocumentTextIcon },
    { to: '/calendario', text: 'Calendario Institucional', icon: CalendarDaysIcon },
    { to: '/gestion-eventos', text: 'Eventos (QR)', icon: QrCodeIcon },
    { to: '/perfil', text: 'Mi perfil', icon: UserCircleIcon },
];

const actionLinks = [
    { to: '/configuracion', text: 'Configuración', icon: Cog6ToothIcon },
    { to: '/ayuda', text: 'Ayuda', icon: QuestionMarkCircleIcon },
];

const Drawer: React.FC<DrawerProps> = ({ isOpen, setIsOpen, onLogout, isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    const NavLinkItem = ({ to, text, icon: Icon }: { to: string, text: string, icon: React.ElementType }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive ? 'bg-indigo-800 text-white' : 'hover:bg-slate-200'
                } ${isCollapsed ? 'lg:justify-center' : ''}`}
            >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{text}</span>
            </Link>
        );
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />
            <aside
                className={`fixed top-0 left-0 h-full bg-slate-50 shadow-lg z-30 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 h-[69px]">
                        <div className={`flex items-center space-x-3 overflow-hidden flex-1 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0' : 'lg:opacity-100'}`}>
                            <UserCircleIcon className="w-10 h-10 text-slate-400 flex-shrink-0" />
                            <div className="whitespace-nowrap">
                                <h2 className="font-semibold">{mockUser.name}</h2>
                                <p className="text-xs text-slate-500">Preceptora</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:block p-2 rounded-full text-slate-600 hover:bg-slate-200"
                            aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'}
                        >
                            {isCollapsed ? <ChevronDoubleRightIcon className="w-5 h-5" /> : <ChevronDoubleLeftIcon className="w-5 h-5" />}
                        </button>
                        
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-200 lg:hidden">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-grow flex flex-col justify-between p-4">
                        <div>
                            <h3 className={`px-4 text-xs font-bold uppercase text-slate-400 mb-2 whitespace-nowrap transition-opacity ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Menú</h3>
                            <div className="space-y-1">
                                {/* Fix: Explicitly pass props to NavLinkItem instead of spreading to avoid TypeScript errors. */}
                                {navLinks.map((link) => <NavLinkItem key={link.to} to={link.to} text={link.text} icon={link.icon} />)}
                            </div>
                        </div>
                        <div>
                            <div className="space-y-1">
                                {/* Fix: Explicitly pass props to NavLinkItem instead of spreading to avoid TypeScript errors. */}
                                {actionLinks.map((link) => <NavLinkItem key={link.to} to={link.to} text={link.text} icon={link.icon} />)}
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); onLogout(); }}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50 ${isCollapsed ? 'lg:justify-center' : ''}`}
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
                                    <span className={`whitespace-nowrap transition-opacity ${isCollapsed ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Cerrar sesión</span>
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Drawer;