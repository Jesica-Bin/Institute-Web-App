import React from 'react';
import { useParams } from 'react-router-dom';
import { mockAllNotifications } from '../data';
import { Notification, NotificationType } from '../types';
import { MegaphoneIcon, WrenchScrewdriverIcon } from '../components/Icons';

interface NotificationDetailScreenProps {
    notification?: Notification | null;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconProps = { className: "w-8 h-8" };
    switch (type) {
        case NotificationType.SYSTEM:
            return <div className="p-4 bg-indigo-100 text-indigo-700 rounded-full"><WrenchScrewdriverIcon {...iconProps} /></div>;
        case NotificationType.OFFICIAL:
            return <div className="p-4 bg-purple-100 text-purple-700 rounded-full"><MegaphoneIcon {...iconProps} /></div>;
        default:
            return null;
    }
};

const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({ notification: propNotification }) => {
    const { notificationId } = useParams<{ notificationId: string }>();
    
    // Use the notification from props if available (for desktop view), otherwise find it by ID from the URL (for mobile view).
    const notification = propNotification || mockAllNotifications.find(n => n.id.toString() === notificationId);

    if (!notification) {
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm">No se encontró la notificación.</div>;
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <div className="flex items-start space-x-4">
                <NotificationIcon type={notification.type} />
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-slate-800">{notification.title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{notification.time}</p>
                </div>
            </div>
            <div className="border-t border-slate-100 pt-6">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {notification.description}
                </p>
                {notification.imageUrl && (
                    <div className="mt-6">
                        <img 
                            src={notification.imageUrl} 
                            alt="Imagen adjunta al comunicado" 
                            className="w-full h-auto max-h-96 rounded-lg object-contain bg-slate-100" 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationDetailScreen;