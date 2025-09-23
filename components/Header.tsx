import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, ArrowLeftIcon, BellIcon } from './Icons';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
    showBackButton: boolean;
    showAvatar: boolean;
    isDashboard?: boolean;
    backPath?: string;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, showBackButton, showAvatar, isDashboard, backPath }) => {
    const navigate = useNavigate();

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
                        <button onClick={onMenuClick} className={`${iconButtonClasses} lg:hidden`}>
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Center: title */}
                <h1 className="text-base font-semibold text-center truncate">
                    {title}
                </h1>

                {/* Right side: icon/avatar or placeholder */}
                <div className="flex justify-end">
                    {isDashboard ? (
                         <Link to="/notificaciones" className={iconButtonClasses}>
                            <BellIcon className="w-6 h-6 md:w-7 md:h-7" />
                         </Link>
                    ) : showAvatar ? (
                        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center font-bold text-indigo-900">J</div>
                    ) : (
                        <div className="w-10 h-10" /> // Placeholder to keep title centered
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;