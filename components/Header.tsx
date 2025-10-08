

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
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, isDashboard, backPath, onProfileClick }) => {
    const navigate = useNavigate();
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        setHasUnread(hasUnreadNotifications());
    }, []);

    const handleBackClick = () => {
        // Navigate to a specific, deterministic path instead of relying on browser history.
        navigate(backPath || '/');
    };

    const headerBaseClasses = "sticky top-0 z-10";
    const headerStyleClasses = isDashboard 
        ? "bg-slate-100 text-slate-800"
        : "bg-indigo-800 text-white shadow-md";
    
    const iconButtonClasses = isDashboard
        ? "p-2 rounded-full hover:bg-slate-200"
        : "p-2 rounded-full hover:bg-indigo-700";
    
    return (
        <header className={`${headerBaseClasses} ${headerStyleClasses}`}>
            <div className="container mx-auto px-4 md:px-6 py-3 grid grid-cols-3 items-center">
                {/* Left side: button */}
                <div className="flex justify-start">
                    {showBackButton ? (
                        <button onClick={handleBackClick} className={iconButtonClasses}>
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <div className="w-10 h-10" /> // Placeholder for alignment
                    )}
                </div>

                {/* Center: title */}
                <h1 className="text-base font-semibold text-center truncate">
                    {title}
                </h1>

                {/* Right side: icon/avatar or placeholder */}
                <div className="flex justify-end items-center">
                    {isDashboard ? (
                         <div className="flex items-center space-x-1">
                            <Link to="/notificaciones" className={`relative ${iconButtonClasses}`}>
                                <BellIcon className="w-6 h-6 md:w-7 md:h-7" />
                                {hasUnread && <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-red-500 rounded-full" />}
                            </Link>
                            <button onClick={onProfileClick} className={iconButtonClasses}>
                                <UserCircleIcon className="w-7 h-7" />
                            </button>
                         </div>
                    ) : (
                        <div className="w-10 h-10" /> // Placeholder to keep title centered
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
