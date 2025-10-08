
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BellIcon, UserCircleIcon } from './Icons';
import { hasUnreadNotifications } from '../store';

interface HeaderProps {
    title: string;
    showBackButton: boolean;
    isDashboard?: boolean;
    backPath?: string;
    onProfileClick?: () => void;
    notificationsPath?: string;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, isDashboard, backPath, onProfileClick, notificationsPath }) => {
    const navigate = useNavigate();
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        setHasUnread(hasUnreadNotifications());
    }, []);

    const handleBack = () => {
        if (backPath) {
            navigate(backPath);
        } else {
            navigate(-1);
        }
    };

    const finalNotificationsPath = notificationsPath || '/notificaciones';

    return (
        <header className="bg-indigo-800 text-white shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center h-[69px]">
                <div className="flex justify-start">
                    {showBackButton && (
                        <button onClick={handleBack} className="p-2 rounded-full hover:bg-indigo-700">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>
                
                <h1 className="text-base font-semibold text-center truncate">
                    {isDashboard ? '' : title}
                </h1>

                <div className="flex justify-end items-center space-x-2">
                    {isDashboard ? (
                        <>
                            <Link to={finalNotificationsPath} className="relative p-2 rounded-full hover:bg-indigo-700">
                                <BellIcon className="w-6 h-6" />
                                {hasUnread && <span className="absolute top-1.5 right-1.5 block w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-indigo-800" />}
                            </Link>
                            <button onClick={onProfileClick} className="p-2 rounded-full hover:bg-indigo-700">
                                <UserCircleIcon className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <div className="w-10 h-10" />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
