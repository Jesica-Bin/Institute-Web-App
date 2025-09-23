import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckBadgeIcon } from '../../components/Icons';

const ResetPasswordScreen: React.FC = () => {
    const navigate = useNavigate();
    const [isUpdated, setIsUpdated] = useState(false);

    if (isUpdated) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col">
                <header className="bg-indigo-800 text-white shadow-md sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center">
                        <div className="flex justify-start">
                            {/* No back button on final confirmation */}
                        </div>
                        <h1 className="text-base font-semibold text-center truncate"></h1>
                        <div className="w-10 h-10" />
                    </div>
                </header>
                <div className="flex-grow flex items-center justify-center p-4">
                    <div className="max-w-sm mx-auto text-center">
                        <CheckBadgeIcon className="w-20 h-20 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-slate-800 mt-4">¡Contraseña Actualizada!</h2>
                        <p className="text-slate-500 mt-2">Tu contraseña ha sido modificada correctamente.</p>
                        <button onClick={() => navigate('/login')} className="mt-8 w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors">
                            Volver a Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-indigo-800 text-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        <button onClick={() => navigate('/forgot-password')} className="p-2 rounded-full hover:bg-indigo-700">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <h1 className="text-base font-semibold text-center truncate">Crear nueva contraseña</h1>
                    <div className="w-10 h-10" />
                </div>
            </header>
            <div className="p-4">
                 <div className="max-w-sm mx-auto">
                    <div className="text-left mb-6">
                        <p className="text-slate-500 mt-1 text-sm">Crea una contraseña segura para recuperar el acceso a tu cuenta.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={(e) => {e.preventDefault(); setIsUpdated(true)}} className="space-y-4">
                            <div>
                                <label htmlFor="new-password"className="block text-sm font-medium text-slate-700">Nueva contraseña</label>
                                <input type="password" id="new-password" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"/>
                            </div>
                             <div>
                                <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-700">Confirmar contraseña</label>
                                <input type="password" id="confirm-password" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"/>
                            </div>
                            <div className="flex flex-col space-y-2 pt-2">
                                <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors">
                                    Confirmar cambio
                                </button>
                                <button type="button" onClick={() => navigate('/login')} className="w-full bg-transparent text-slate-600 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;