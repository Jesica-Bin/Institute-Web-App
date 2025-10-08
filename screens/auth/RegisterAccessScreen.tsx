
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../../components/Icons';

const AuthIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center p-12 bg-indigo-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/50 rounded-full -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/50 rounded-full translate-x-1/4 translate-y-1/4"></div>
        <div className="relative z-10 text-white text-center">
             <svg className="w-24 h-24 mx-auto mb-6 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            <h2 className="text-3xl font-bold tracking-tight">Crea tu cuenta</h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-xs mx-auto">
                Solo te tomará unos minutos.
            </p>
        </div>
    </div>
);

const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
     <div className="flex items-center">
        <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                        index < currentStep ? 'bg-slate-800' : 'border-2 border-slate-300'
                    }`}
                />
            ))}
        </div>
        <span className="text-sm text-slate-500 ml-3">Paso {currentStep} de {totalSteps}</span>
    </div>
);

const PasswordInput = ({ id, label, placeholder }: { id: string, label: string, placeholder: string }) => {
    const [isVisible, setIsVisible] = React.useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={isVisible ? 'text' : 'password'}
                    id={id}
                    placeholder={placeholder}
                    className="block w-full px-3 py-2 pr-10 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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

const RegisterAccessFormContent: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="text-left mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Crea tu acceso</h1>
                <p className="text-slate-500 mt-2">Define tu usuario y contraseña para finalizar el registro.</p>
                <div className="mt-4">
                    <ProgressIndicator currentStep={2} totalSteps={2} />
                </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("¡Cuenta creada con éxito!"); navigate('/login'); }} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Nombre de usuario</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Ingresa tu nombre de usuario"
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>
                
                <PasswordInput
                    id="password"
                    label="Contraseña"
                    placeholder="··········"
                />

                <PasswordInput
                    id="confirm-password"
                    label="Confirma tu contraseña"
                    placeholder="Ingresa tu contraseña"
                />

                <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 transition-colors mt-4">
                    Crear cuenta
                </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-600">
                ¿Ya tienes una cuenta? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Inicia sesión</Link>
            </div>
        </>
    );
};

const RegisterAccessScreen: React.FC = () => {
    return (
        <>
            {/* Mobile View */}
            <div className="lg:hidden min-h-screen flex flex-col bg-slate-100">
                <div className="relative h-32 w-full overflow-hidden" style={{backgroundColor: '#4338CA'}}>
                     <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full"></div>
                     <div className="absolute top-8 -right-12 w-40 h-40 bg-white/10 rounded-full"></div>
                </div>
                
                <main className="flex-grow bg-white -mt-24 rounded-t-3xl p-8 z-10 flex flex-col justify-center">
                    <div className="w-full">
                        <RegisterAccessFormContent />
                    </div>
                </main>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex min-h-screen bg-slate-100 items-center justify-center p-4 lg:p-8">
                 <div className="w-full max-w-sm lg:max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
                    <div className="hidden lg:block">
                        <AuthIllustration />
                    </div>
                    <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                        <div className="w-full">
                            <RegisterAccessFormContent />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterAccessScreen;