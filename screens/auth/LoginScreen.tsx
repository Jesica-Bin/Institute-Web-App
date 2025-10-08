import * as React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '../../components/Icons';
import { UserRole } from '../../types';

interface LoginScreenProps {
    onLogin: (role: UserRole) => void;
}

const LoginIllustration = () => (
    <div className="relative w-full h-full flex items-center justify-center p-12 bg-indigo-700 overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/50 rounded-full -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-400/50 rounded-full translate-x-1/4 translate-y-1/4"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white text-center">
            <svg className="w-24 h-24 mx-auto mb-6 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h2 className="text-3xl font-bold tracking-tight">Bienvenido a la Plataforma</h2>
            <p className="mt-4 text-lg text-indigo-100 max-w-xs mx-auto">
                Tu portal para la gestión académica y comunicación.
            </p>
        </div>
    </div>
);

// Extracted form content to avoid duplication between mobile and desktop layouts
const LoginFormContent: React.FC<{
    role: UserRole;
    setRole: (role: UserRole) => void;
    onLogin: (role: UserRole) => void;
}> = ({ role, setRole, onLogin }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const roleEmails: Record<UserRole, string> = {
        student: 'juan.perez@instituto.edu.ar',
        preceptor: 'juana.perez@instituto.edu.ar',
        teacher: 'ricardo.molina@instituto.edu.ar',
        director: 'susana.gimenez@instituto.edu.ar',
    };
    
    return (
        <>
            <form onSubmit={(e) => { e.preventDefault(); onLogin(role) }} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email o Usuario</label>
                    <input type="email" id="email" value={roleEmails[role]} readOnly className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                    <div className="relative mt-1">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="password" 
                            defaultValue="Str0ngP@ssw0rd!" 
                            className="block w-full px-3 py-2 pr-10 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="text-right text-sm">
                    <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">¿Olvidaste tu contraseña?</Link>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-700">Ingresar como:</p>
                    <div className="mt-2 grid grid-cols-2 rounded-md shadow-sm">
                        <button type="button" onClick={() => setRole('student')} className={`px-4 py-2 text-sm font-medium rounded-l-md transition ${role === 'student' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}`}>Estudiante</button>
                        <button type="button" onClick={() => setRole('teacher')} className={`-ml-px px-4 py-2 text-sm font-medium transition ${role === 'teacher' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}`}>Docente</button>
                        <button type="button" onClick={() => setRole('preceptor')} className={`-mt-px px-4 py-2 text-sm font-medium rounded-bl-md transition ${role === 'preceptor' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}`}>Preceptor</button>
                        <button type="button" onClick={() => setRole('director')} className={`-ml-px -mt-px px-4 py-2 text-sm font-medium rounded-br-md transition ${role === 'director' ? 'bg-indigo-600 text-white z-10' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}`}>Dirección</button>
                    </div>
                </div>
                <button type="submit" className="w-full bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    Ingresar
                </button>
            </form>

            <div className="mt-6 space-y-4">
                <hr className="border-slate-200" />
                <div className="text-center text-sm text-slate-600">
                    ¿No tienes una cuenta?
                </div>
                <Link
                    to="/register"
                    className="w-full flex justify-center py-3 px-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Crear Cuenta
                </Link>
            </div>
        </>
    );
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [role, setRole] = React.useState<UserRole>('student');

    return (
        <>
            {/* Mobile View */}
            <div className="lg:hidden min-h-screen flex flex-col bg-slate-100">
                <div className="relative h-60 w-full overflow-hidden" style={{backgroundColor: '#4338CA'}}>
                     {/* Decorative shapes inspired by the image */}
                     <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full"></div>
                     <div className="absolute top-8 -right-12 w-40 h-40 bg-white/10 rounded-full"></div>
                     <div className="absolute top-24 right-16 w-24 h-24 bg-white/20 rounded-full"></div>
                </div>
                
                <main className="flex-grow bg-white -mt-24 rounded-t-3xl p-8 z-10 flex flex-col justify-center">
                    <div className="w-full">
                        <div className="text-left mb-8">
                            <h1 className="text-3xl font-bold text-slate-800">Iniciar Sesión</h1>
                            <p className="text-slate-500 mt-2">Bienvenido de nuevo</p>
                        </div>
                        <LoginFormContent role={role} setRole={setRole} onLogin={onLogin} />
                    </div>
                </main>
            </div>

            {/* Desktop View (Original) */}
            <div className="hidden lg:flex min-h-screen bg-slate-100 items-center justify-center p-4 lg:p-8">
                 <div className="w-full max-w-sm lg:max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
                    <div className="hidden lg:block">
                        <LoginIllustration />
                    </div>
                    <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                        <div className="w-full">
                            <div className="text-left mb-8">
                                <h1 className="text-3xl font-bold text-slate-800">Iniciar Sesión</h1>
                                <p className="text-slate-500 mt-2">Bienvenido de nuevo</p>
                            </div>
                            <LoginFormContent role={role} setRole={setRole} onLogin={onLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginScreen;