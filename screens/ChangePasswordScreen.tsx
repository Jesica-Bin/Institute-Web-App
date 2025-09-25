import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, CheckBadgeIcon } from '../components/Icons';

const PasswordInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, label, value, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    id={id}
                    value={value}
                    onChange={onChange}
                    required
                    className="block w-full px-3 py-2 pr-10 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
};

const ChangePasswordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        if (newPassword.length < 8) {
            setError('La nueva contraseña debe tener al menos 8 caracteres.');
            return;
        }
        // Simulation of a successful API call
        console.log('Changing password...');
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-sm">
                <CheckBadgeIcon className="w-20 h-20 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold text-slate-800 mt-4">¡Contraseña Actualizada!</h2>
                <p className="text-slate-500 mt-2">
                    Tu contraseña ha sido modificada correctamente.
                </p>
                <button
                    onClick={() => navigate('/configuracion')}
                    className="mt-8 w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors"
                >
                    Volver a Configuración
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <PasswordInput
                        id="current-password"
                        label="Contraseña Actual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <PasswordInput
                        id="new-password"
                        label="Nueva Contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <PasswordInput
                        id="confirm-password"
                        label="Confirmar Nueva Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/configuracion')}
                            className="mt-3 sm:mt-0 w-full sm:w-auto justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="w-full sm:w-auto justify-center rounded-md border border-transparent bg-indigo-700 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordScreen;