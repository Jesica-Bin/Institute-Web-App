import * as React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };
    return (
        <div className={`rounded-full animate-spin ${sizeClasses[size]} border-slate-200 border-t-indigo-600 ${className}`}></div>
    );
};

export default Spinner;
