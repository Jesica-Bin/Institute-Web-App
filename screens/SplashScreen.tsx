import React from 'react';

interface SplashScreenProps {
  isFadingOut: boolean;
}

const BookIcon = () => (
    <svg className="w-12 h-12 mr-4 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
    </svg>
);


const SplashScreen: React.FC<SplashScreenProps> = ({ isFadingOut }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-indigo-800 to-indigo-400 transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
        <div className="flex items-center animate-fade-in-up">
            <BookIcon />
            <h1 className="text-4xl font-bold text-white tracking-wide">
                ISFD App
            </h1>
        </div>
    </div>
  );
};

export default SplashScreen;