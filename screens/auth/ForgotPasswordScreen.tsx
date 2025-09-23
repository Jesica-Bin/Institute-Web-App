import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../../components/Icons';

const ForgotPasswordScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-indigo-800 text-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        <button onClick={() => navigate('/login')} className="p-2 rounded-full hover:bg-indigo-700">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <h1 className="text-base font-semibold text-center truncate">¿Olvidaste tu contraseña?</h1>
                    <div className="w-10 h-10" />
                </div>
            </header>
            <div className="p-4">
                 <div className="max-w-sm mx-auto">
                    <div className="text-left mb-6">
                        <p className="text-slate-500 mt-1 text-sm">Por favor ingresa tu dirección de email, te enviaremos un link para reestablecer tu contraseña.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={(e) => {e.preventDefault(); navigate('/reset-password')}} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 sr-only">Email</label>
                                <input type="email" id="email" placeholder="tucorreo@gmail.com" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm"/>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors">
                                    Enviar correo
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

export default ForgotPasswordScreen;