import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, useMatch, Link } from 'react-router-dom';
import { mockSubjectDetails } from './data';
import { BellIcon } from './components/Icons';

// Layout Components
import Header from './components/Header';
import Drawer from './components/Drawer';
import StudentDrawer from './components/StudentDrawer';

// Preceptor Screens
import DashboardScreen from './screens/DashboardScreen';
import AttendanceSummaryScreen from './screens/AttendanceSummaryScreen';
import TakeAttendanceScreen from './screens/TakeAttendanceScreen';
import StudentManagementScreen from './screens/StudentManagementScreen';
import ReportsScreen from './screens/ReportsScreen';
import RequestsScreen from './screens/RequestsScreen';
import RequestDetailScreen from './screens/RequestDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import StudentProfileScreen from './screens/StudentProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import SchoolCalendarScreen from './screens/SchoolCalendarScreen';
import EventManagementScreen from './screens/EventManagementScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EventQRCodeScreen from './screens/EventQRCodeScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import CreateCommunicationScreen from './screens/CreateCommunicationScreen';
import NotificationDetailScreen from './screens/NotificationDetailScreen';
import SplashScreen from './screens/SplashScreen';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterIdentifyScreen from './screens/auth/RegisterIdentifyScreen';
import RegisterAccessScreen from './screens/auth/RegisterAccessScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

// Student Screens
import StudentDashboardScreen from './screens/student/StudentDashboardScreen';
import MySubjectsScreen from './screens/student/MySubjectsScreen';
import SubjectDetailScreen from './screens/student/SubjectDetailScreen';
import StudentAttendanceScreen from './screens/student/StudentAttendanceScreen';
import StudentAttendanceRecordScreen from './screens/student/StudentAttendanceRecordScreen';
import JustifyAbsenceScreen from './screens/student/JustifyAbsenceScreen';
import JustifyAbsenceDetailScreen from './screens/student/JustifyAbsenceDetailScreen';
import JustificationStatusScreen from './screens/student/JustificationStatusScreen';
import StudentSchoolCalendarScreen from './screens/student/SchoolCalendarScreen';
import EventAttendanceScreen from './screens/student/EventAttendanceScreen';
import CertificatesScreen from './screens/student/CertificatesScreen';
import NewCertificateRequestScreen from './screens/student/NewCertificateRequestScreen';
import SuggestionsScreen from './screens/student/SuggestionsScreen';
import NewSuggestionScreen from './screens/student/NewSuggestionScreen';
import SuggestionDetailScreen from './screens/student/SuggestionDetailScreen';
import StudentMyProfileScreen from './screens/student/StudentMyProfileScreen';

type UserRole = 'preceptor' | 'student';
interface User {
    role: UserRole;
}

interface PreceptorAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const PreceptorApp: React.FC<PreceptorAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

    const { career: dynamicTitle } = location.state || {};
    const isDashboard = location.pathname === '/';

    const screenTitles: { [key: string]: string } = {
        '/asistencia': 'Asistencia',
        '/tomar-asistencia': 'Tomar Asistencia',
        '/gestion-estudiantes': 'Gestión de Estudiantes',
        '/reportes': 'Ver Reportes',
        '/solicitudes': 'Gestión de Solicitudes',
        '/solicitud-detalle': 'Detalle de Solicitud',
        '/calendario': 'Calendario Institucional',
        '/gestion-eventos': 'Eventos (QR)',
        '/crear-evento': 'Crear Nuevo Evento',
        '/evento-qr': 'Código QR del Evento',
        '/evento-detalle': 'Detalle del Evento',
        '/crear-comunicado': 'Crear Comunicado',
        '/notificaciones': 'Notificaciones',
        '/notificacion-detalle/:notificationId': 'Detalle de Notificación',
        '/perfil': 'Mi Perfil',
        '/estudiante-perfil': 'Perfil del Estudiante',
        '/configuracion': 'Configuración',
        '/ayuda': 'Ayuda y Feedback',
    };

    let title = isDashboard ? '' : (screenTitles[location.pathname] || 'Inicio');
    if (location.pathname === '/tomar-asistencia' && dynamicTitle) {
        title = dynamicTitle;
    }
    
    const matchSolicitudDetalle = useMatch('/solicitud-detalle');
    const matchEstudiantePerfil = useMatch('/estudiante-perfil');
    const matchCrearEvento = useMatch('/crear-evento');
    const matchEventoQr = useMatch('/evento-qr');
    const matchEventoDetalle = useMatch('/evento-detalle');
    const matchCrearComunicado = useMatch('/crear-comunicado');
    const matchTomarAsistencia = useMatch('/tomar-asistencia');
    const matchNotificacionDetalle = useMatch('/notificacion-detalle/:notificationId');
    
    let backPath = '/';
    if (matchSolicitudDetalle) backPath = '/solicitudes';
    else if (matchEstudiantePerfil) backPath = '/gestion-estudiantes';
    else if (matchCrearEvento) backPath = '/gestion-eventos';
    else if (matchEventoQr) backPath = '/gestion-eventos';
    else if (matchEventoDetalle) backPath = '/gestion-eventos';
    else if (matchCrearComunicado) backPath = '/notificaciones';
    else if (matchNotificacionDetalle) backPath = '/notificaciones';
    else if (matchTomarAsistencia) backPath = '/asistencia';


    const showBackButton = !isDashboard;
    const showAvatar = false;

    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
            <Drawer 
                isOpen={isDrawerOpen} 
                setIsOpen={setDrawerOpen} 
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onMenuClick={() => setDrawerOpen(true)}
                        showBackButton={showBackButton}
                        showAvatar={showAvatar}
                        isDashboard={isDashboard}
                        backPath={backPath}
                    />
                )}
                {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10">
                        <Link to="/notificaciones" className="p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                        </Link>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <Routes>
                        <Route path="/" element={<DashboardScreen />} />
                        <Route path="/asistencia" element={<AttendanceSummaryScreen />} />
                        <Route path="/tomar-asistencia" element={<TakeAttendanceScreen />} />
                        <Route path="/gestion-estudiantes" element={<StudentManagementScreen />} />
                        <Route path="/reportes" element={<ReportsScreen />} />
                        <Route path="/solicitudes" element={<RequestsScreen />} />
                        <Route path="/solicitud-detalle" element={<RequestDetailScreen />} />
                        <Route path="/calendario" element={<SchoolCalendarScreen />} />
                        <Route path="/gestion-eventos" element={<EventManagementScreen />} />
                        <Route path="/crear-evento" element={<CreateEventScreen />} />
                        <Route path="/evento-qr" element={<EventQRCodeScreen />} />
                        <Route path="/evento-detalle" element={<EventDetailScreen />} />
                        <Route path="/crear-comunicado" element={<CreateCommunicationScreen />} />
                        <Route path="/notificaciones" element={<NotificationsScreen userRole="preceptor" />} />
                        <Route path="/notificacion-detalle/:notificationId" element={<NotificationDetailScreen />} />
                        <Route path="/perfil" element={<ProfileScreen />} />
                        <Route path="/estudiante-perfil" element={<StudentProfileScreen />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

interface StudentAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const StudentApp: React.FC<StudentAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

    const isDashboard = location.pathname === '/';

    // --- Define screen titles first to use their keys for matching ---
    const screenTitles: { [key: string]: string } = {
        '/mis-materias': 'Mis Materias',
        '/asistencia': 'Asistencia',
        '/asistencia-registro': 'Registro de Asistencia',
        '/justificar-ausencia': 'Justificar Ausencia',
        '/justificar-ausencia-detalle': 'Justificar Ausencia',
        '/justificacion-estado': 'Estado de Justificación',
        '/notificaciones': 'Notificaciones',
        '/notificacion-detalle/:notificationId': 'Detalle de Notificación',
        '/certificados': 'Certificados y Constancias',
        '/solicitar-certificado': 'Solicitar Certificado',
        '/sugerencias': 'Sugerencias y Reclamos',
        '/nueva-sugerencia': 'Nuevo Envío',
        '/sugerencia-detalle/:suggestionId': 'Detalle de Envío',
        '/perfil': 'Mi Perfil',
        '/configuracion': 'Configuración',
        '/ayuda': 'Ayuda y Feedback',
        '/calendario-escolar': 'Calendario Institucional',
        '/eventos-qr': 'Asistencia a Eventos',
    };
    
    // --- Call all necessary hooks at the top level ---
    const matchMateriaDetalle = useMatch('/materia-detalle/:subjectId');
    const matchAsistencia = useMatch('/asistencia');
    const matchAsistenciaRegistro = useMatch('/asistencia-registro');
    const matchJustificarAusencia = useMatch('/justificar-ausencia');
    const matchJustificarAusenciaDetalle = useMatch('/justificar-ausencia-detalle');
    const matchJustificacionEstado = useMatch('/justificacion-estado');
    const matchSolicitarCertificado = useMatch('/solicitar-certificado');
    const matchSugerenciaDetalle = useMatch('/sugerencia-detalle/:suggestionId');
    const matchNuevaSugerencia = useMatch('/nueva-sugerencia');
    const matchNotificacionDetalle = useMatch('/notificacion-detalle/:notificationId');
    const matchEventosQR = useMatch('/eventos-qr');

    const titleMatches = Object.keys(screenTitles).reduce((acc, path) => {
        acc[path] = useMatch(path);
        return acc;
    }, {} as Record<string, ReturnType<typeof useMatch>>);

    // --- Deterministic Back Path Logic ---
    let backPath = '/';
    if (matchMateriaDetalle) {
        backPath = '/mis-materias';
    } else if (matchAsistencia) {
        if (location.state?.from === '/materia-detalle' && location.state?.subjectId) {
            backPath = `/materia-detalle/${location.state.subjectId}`;
        } else {
            backPath = '/';
        }
    } else if (matchAsistenciaRegistro) {
        backPath = '/asistencia';
    } else if (matchJustificarAusencia) {
        backPath = '/asistencia';
    } else if (matchJustificarAusenciaDetalle) {
        backPath = '/justificar-ausencia';
    } else if (matchJustificacionEstado) {
        backPath = '/justificar-ausencia';
    } else if (matchSolicitarCertificado) {
        backPath = '/certificados';
    } else if (matchSugerenciaDetalle) {
        backPath = '/sugerencias';
    } else if (matchNuevaSugerencia) {
        backPath = '/sugerencias';
    } else if (matchNotificacionDetalle) {
        backPath = '/notificaciones';
    } else if (matchEventosQR) {
        backPath = '/asistencia';
    }

    // --- Title Logic ---
    let title: string;

    if (isDashboard) {
        title = '';
    } else if (matchMateriaDetalle?.params.subjectId) {
        const subject = mockSubjectDetails[matchMateriaDetalle.params.subjectId];
        title = subject ? subject.name : 'Detalle de Materia';
    } else {
        const currentRoute = Object.keys(screenTitles).find(key => titleMatches[key] !== null);
        title = currentRoute ? screenTitles[currentRoute] : 'Inicio';
    }

    const showBackButton = !isDashboard;

    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
            <StudentDrawer 
                isOpen={isDrawerOpen} 
                setIsOpen={setDrawerOpen} 
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onMenuClick={() => setDrawerOpen(true)}
                        showBackButton={showBackButton}
                        showAvatar={false}
                        isDashboard={isDashboard}
                        backPath={backPath}
                    />
                )}
                 {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10">
                        <Link to="/notificaciones" className="p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                        </Link>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <Routes>
                        <Route path="/" element={<StudentDashboardScreen />} />
                        <Route path="/mis-materias" element={<MySubjectsScreen />} />
                        <Route path="/materia-detalle/:subjectId" element={<SubjectDetailScreen />} />
                        <Route path="/asistencia" element={<StudentAttendanceScreen />} />
                        <Route path="/asistencia-registro" element={<StudentAttendanceRecordScreen />} />
                        <Route path="/justificar-ausencia" element={<JustifyAbsenceScreen />} />
                        <Route path="/justificar-ausencia-detalle" element={<JustifyAbsenceDetailScreen />} />
                        <Route path="/justificacion-estado" element={<JustificationStatusScreen />} />
                        <Route path="/notificaciones" element={<NotificationsScreen userRole="student" />} />
                        <Route path="/notificacion-detalle/:notificationId" element={<NotificationDetailScreen />} />
                        <Route path="/certificados" element={<CertificatesScreen />} />
                        <Route path="/solicitar-certificado" element={<NewCertificateRequestScreen />} />
                        <Route path="/sugerencias" element={<SuggestionsScreen />} />
                        <Route path="/nueva-sugerencia" element={<NewSuggestionScreen />} />
                        <Route path="/sugerencia-detalle/:suggestionId" element={<SuggestionDetailScreen />} />
                        <Route path="/perfil" element={<StudentMyProfileScreen />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                        <Route path="/calendario-escolar" element={<StudentSchoolCalendarScreen />} />
                        <Route path="/eventos-qr" element={<EventAttendanceScreen />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};


const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const splashTimer = setTimeout(() => {
            setIsFadingOut(true);
            const fadeTimer = setTimeout(() => {
                setIsLoading(false);
            }, 500); // Corresponds to the fade-out duration
            return () => clearTimeout(fadeTimer);
        }, 2000); // How long the splash screen stays visible

        return () => clearTimeout(splashTimer);
    }, []);

    const handleLogin = (role: UserRole) => {
        setUser({ role });
        navigate('/');
    };

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    // This effect handles redirecting a logged-in user if they try to visit an auth page.
    useEffect(() => {
        const authPaths = ['/login', '/register', '/register-access', '/forgot-password', '/reset-password'];
        if (user && authPaths.includes(location.pathname)) {
            navigate('/', { replace: true });
        }
    }, [user, location.pathname, navigate]);

    if (isLoading) {
        return <SplashScreen isFadingOut={isFadingOut} />;
    }

    if (!user) {
        return (
             <Routes>
                <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
                <Route path="/register" element={<RegisterIdentifyScreen />} />
                <Route path="/register-access" element={<RegisterAccessScreen />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    if (user.role === 'student') {
        return <StudentApp 
            onLogout={handleLogout}
            isDrawerCollapsed={isDrawerCollapsed}
            setIsDrawerCollapsed={setIsDrawerCollapsed}
        />;
    }

    return <PreceptorApp 
        onLogout={handleLogout} 
        isDrawerCollapsed={isDrawerCollapsed} 
        setIsDrawerCollapsed={setIsDrawerCollapsed} 
    />;
};

export default App;