import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockSystemNotifications } from '../data';
import { getOfficialCommunications } from '../store';
import { Notification, NotificationType } from '../types';
import { MegaphoneIcon, WrenchScrewdriverIcon, PlusIcon, ChevronRightIcon } from '../components/Icons';
import NotificationDetailScreen from './NotificationDetailScreen';

type Tab = 'system' | 'official';

interface NotificationsScreenProps {
    userRole: 'preceptor' | 'student';
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
    const iconProps = { className: "w-6 h-6" };
    switch (type) {
        case NotificationType.SYSTEM:
            return <div className="p-3 bg-indigo-100 text-indigo-700 rounded-full"><WrenchScrewdriverIcon {...iconProps} /></div>;
        case NotificationType.OFFICIAL:
            return <div className="p-3 bg-purple-100 text-purple-700 rounded-full"><MegaphoneIcon {...iconProps} /></div>;
        default:
            return null;
    }
};

const TabButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => {
    const baseClasses = "py-2 px-4 font-semibold text-sm rounded-md transition-colors flex-1";
    const activeClasses = active ? "bg-indigo-700 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300";
    return <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>{label}</button>;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ userRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('system');
    const officialCommunications = getOfficialCommunications();
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const navigate = useNavigate();

    const notificationsToShow = activeTab === 'system' ? mockSystemNotifications : officialCommunications;

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        if (isDesktop && notificationsToShow.length > 0) {
            // Check if the current selection is still in the list, otherwise select the first one.
            const selectionIsValid = notificationsToShow.some(n => n.id === selectedNotification?.id);
            if (!selectionIsValid) {
                setSelectedNotification(notificationsToShow[0]);
            }
        } else if (isDesktop && notificationsToShow.length === 0) {
            setSelectedNotification(null);
        }
    }, [isDesktop, notificationsToShow, selectedNotification, activeTab]);

    const handleNotificationClick = (notification: Notification) => {
        if (isDesktop) {
            setSelectedNotification(notification);
        } else {
            navigate(`/notificacion-detalle/${notification.id}`);
        }
    };

    // Fix: Refactor NotificationItem to avoid passing the 'key' prop directly to a custom component, which was causing TypeScript errors.
    const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
        <button
            onClick={() => handleNotificationClick(notification)}
            className={`w-full text-left p-4 flex items-start space-x-4 transition-colors ${
                isDesktop && selectedNotification?.id === notification.id ? 'bg-indigo-50' : 'hover:bg-slate-50'
            }`}
        >
            <NotificationIcon type={notification.type} />
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className={`font-semibold ${isDesktop && selectedNotification?.id === notification.id ? 'text-indigo-800' : 'text-slate-800'}`}>
                        {notification.title}
                    </h3>
                    {!notification.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></div>}
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{notification.description}</p>
                <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
            </div>
            {!isDesktop && <ChevronRightIcon className="w-5 h-5 text-slate-400 self-center" />}
        </button>
    );

    const NotificationList = () => (
        <div className="lg:col-span-1 space-y-4">
             {userRole === 'preceptor' && (
                <div className="hidden lg:block">
                    <Link
                        to="/crear-comunicado"
                        className="w-full flex items-center justify-center space-x-2 bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Crear Comunicado</span>
                    </Link>
                </div>
            )}
            <div className="bg-slate-100 p-1 rounded-lg flex space-x-2">
                <TabButton label="Sistema" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
                <TabButton label="Oficiales" active={activeTab === 'official'} onClick={() => setActiveTab('official')} />
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {notificationsToShow.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                        {notificationsToShow.map(notif => <li key={notif.id}><NotificationItem notification={notif} /></li>)}
                    </ul>
                ) : (
                    <div className="p-8 text-center text-slate-500">
                        <p>No hay {activeTab === 'system' ? 'notificaciones' : 'comunicados'} por ahora.</p>
                    </div>
                )}
            </div>
            {userRole === 'preceptor' && (
                <button
                    onClick={() => navigate('/crear-comunicado')}
                    className="fixed bottom-6 right-6 lg:hidden bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:bg-indigo-800 transition-transform duration-200 ease-in-out hover:scale-105"
                    aria-label="Crear nuevo comunicado"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            )}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
            <NotificationList />
            <div className="hidden lg:block lg:col-span-2">
                {selectedNotification ? (
                    <NotificationDetailScreen notification={selectedNotification} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-8 text-center">
                        <MegaphoneIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">Selecciona una notificación</h3>
                        <p className="text-slate-500 mt-2">Elige una notificación de la lista para ver su contenido completo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsScreen;