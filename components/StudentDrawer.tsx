import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockStudentUser } from '../data';
import { 
    HomeIcon, CheckBadgeIcon, UsersIcon, DocumentTextIcon, UserCircleIcon, 
    ArrowRightOnRectangleIcon, XMarkIcon,
    ChevronDoubleLeftIcon, ChevronDoubleRightIcon, CalendarDaysIcon
} from './Icons';

interface StudentDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

const navLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/mis-materias', text: 'Mis materias', icon: DocumentTextIcon },
    { to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { to: '/calendario-escolar', text: 'Calendario Institucional', icon: CalendarDaysIcon },
    { to: '/certificados', text: 'Certificados y constancias', icon: UsersIcon },
];

const actionLinks: { to: string; text: string; icon: React.ElementType }[] = [];

const StudentDrawer: React.FC<StudentDrawerProps> = ({ isOpen, setIsOpen, onLogout, isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    // FIX: Using React.FC with an interface for props to avoid potential issues with TypeScript's JSX type inference.
    interface NavLinkItemProps {
      to: string;
      text: string;
      icon: React.ElementType;
    }
    const NavLinkItem: React.FC<NavLinkItemProps> = ({ to, text, icon: Icon }) => {
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

     const UserAvatar = () => (
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-slate-200">
            <UserCircleIcon className="w-full h-full text-slate-400" />
        </div>
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />
            <aside
                className={`fixed top-0 left-0 h-full bg-slate-50 shadow-lg z-30 transform transition-all duration-300 ease-in-out -translate-x-full lg:translate-x-0 ${
                    isCollapsed ? 'lg:w-20' : 'lg:w-64'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-200 h-[69px]">
                        <div className={`flex items-center space-x-3 overflow-hidden flex-1 transition-opacity duration-300 ${isCollapsed ? 'lg:opacity-0' : 'lg:opacity-100'}`}>
                            <UserAvatar />
                            <div className="whitespace-nowrap">
                                <h2 className="font-semibold">{mockStudentUser.name}</h2>
                                <p className="text-xs text-slate-500">Estudiante</p>
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
                                {navLinks.map((link) => <NavLinkItem key={link.to} to={link.to} text={link.text} icon={link.icon} />)}
                            </div>
                        </div>
                        <div>
                            <div className="space-y-1">
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

export default StudentDrawer;