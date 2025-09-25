import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, TrashIcon } from '../components/Icons';

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: () => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex justify-between items-center">
        <span className="text-slate-700">{label}</span>
        <button
            onClick={setEnabled}
            className={`${enabled ? 'bg-indigo-600' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
            <span className="sr-only">Enable notifications</span>
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
    </div>
);


const SettingsScreen: React.FC = () => {
    const [systemNotifs, setSystemNotifs] = useState(true);
    const [officialComms, setOfficialComms] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SettingsSection title="Notificaciones">
                <ToggleSwitch label="Notificaciones del sistema" enabled={systemNotifs} setEnabled={() => setSystemNotifs(prev => !prev)} />
                <ToggleSwitch label="Comunicados oficiales" enabled={officialComms} setEnabled={() => setOfficialComms(prev => !prev)} />
            </SettingsSection>

            <SettingsSection title="Apariencia">
                <div className="flex justify-between items-center">
                    <span className="text-slate-700">Modo Oscuro</span>
                    <div className="flex items-center space-x-2 p-1 bg-slate-200 rounded-full">
                         <button aria-pressed={!darkMode} onClick={() => setDarkMode(false)} className={`p-1.5 rounded-full ${!darkMode ? 'bg-white shadow' : 'hover:bg-slate-300'}`}><SunIcon className="w-5 h-5 text-slate-700"/></button>
                         <button aria-pressed={darkMode} onClick={() => setDarkMode(true)} className={`p-1.5 rounded-full ${darkMode ? 'bg-white shadow' : 'hover:bg-slate-300'}`}><MoonIcon className="w-5 h-5 text-slate-700"/></button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Cuenta">
                <Link to="/cambiar-contrasena" className="w-full text-left p-3 hover:bg-slate-50 rounded-md text-slate-700 transition-colors block">
                    Cambiar contraseña
                </Link>
                 <button className="w-full text-left p-3 flex items-center space-x-2 hover:bg-red-50 rounded-md text-red-600 font-semibold transition-colors">
                    <TrashIcon className="w-5 h-5" />
                    <span>Eliminar cuenta</span>
                </button>
            </SettingsSection>
        </div>
    );
};

export default SettingsScreen;