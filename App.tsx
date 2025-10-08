import * as React from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate, useMatch, Link, NavLink } from 'react-router-dom';
import { mockSubjectDetails, mockCertificateRequests, mockTeacherSubjects } from './data';
import { BellIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, HomeIcon, CheckBadgeIcon, UsersIcon, DocumentTextIcon, CalendarDaysIcon, BookOpenIcon, ChatBubbleLeftRightIcon, BriefcaseIcon, DocumentChartBarIcon, ShieldCheckIcon, MegaphoneIcon } from './components/Icons';
import { hasUnreadNotifications } from './store';

// Layout Components
import Header from './components/Header';
import Drawer from './components/Drawer';
import StudentDrawer from './components/StudentDrawer';
import TeacherDrawer from './components/TeacherDrawer';
import DirectorDrawer from './components/DirectorDrawer';

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
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PersonalNotesScreen from './screens/PersonalNotesScreen';

// Auth Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterIdentifyScreen from './screens/auth/RegisterIdentifyScreen';
import RegisterAccessScreen from './screens/auth/RegisterAccessScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

// Student Screens
// FIX: StudentDashboardScreen is a default export, so it should be imported directly.
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
import CertificateDetailScreen from './screens/student/CertificateDetailScreen';
import SuggestionsScreen from './screens/student/SuggestionsScreen';
import NewSuggestionScreen from './screens/student/NewSuggestionScreen';
import SuggestionDetailScreen from './screens/student/SuggestionDetailScreen';
import StudentMyProfileScreen from './screens/student/StudentMyProfileScreen';
import NewThreadScreen from './screens/student/NewThreadScreen';


// Teacher Screens
import TeacherDashboardScreen from './screens/teacher/TeacherDashboardScreen';
import TeacherSubjectsScreen from './screens/teacher/TeacherSubjectsScreen';
import TeacherSubjectDetailScreen from './screens/teacher/TeacherSubjectDetailScreen';
import ForumHubScreen from './screens/teacher/ForumHubScreen';
import ManageGradesScreen from './screens/teacher/ManageGradesScreen';

// Director Screens
import DirectorDashboardScreen from './screens/director/DirectorDashboardScreen';
import UserManagementScreen from './screens/director/UserManagementScreen';
import AcademicManagementScreen from './screens/director/AcademicManagementScreen';
import DirectorCommunicationsScreen from './screens/director/DirectorCommunicationsScreen';
import ClaimsManagementScreen from './screens/director/ClaimsManagementScreen';
import AuditScreen from './screens/director/AuditScreen';

// Shared Screens
import ForumSubjectScreen from './screens/shared/ForumSubjectScreen';
import ForumThreadScreen from './screens/shared/ForumThreadScreen';

// Generic Placeholder
import PlaceholderScreen from './screens/PlaceholderScreen';

// --- INLINED COMPONENTS TO SATISFY CONSTRAINTS ---

// Profile Popover Component
interface ProfilePopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}
const ProfilePopover: React.FC<ProfilePopoverProps> = ({ isOpen, onClose, onLogout }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />
            <div
                className="absolute top-16 right-4 w-64 bg-white rounded-lg shadow-xl z-50 border border-slate-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="p-2">
                    <Link to="/perfil" onClick={onClose} className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 rounded-md hover:bg-slate-100">
                        <UserCircleIcon className="w-5 h-5" />
                        <span>Mi Perfil</span>
                    </Link>
                    <Link to="/configuracion" onClick={onClose} className="flex items-center space-x-3 px-3 py-2.5 text-slate-700 rounded-md hover:bg-slate-100">
                        <Cog6ToothIcon className="w-5 h-5" />
                        <span>Configuración</span>
                    </Link>
                    <hr className="my-1" />
                    <button onClick={() => { onLogout(); onClose(); }} className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 rounded-md hover:bg-red-50">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </>
    );
};


// Bottom Navigation Component
interface BottomNavProps {
    userRole: 'preceptor' | 'student' | 'teacher' | 'director';
}
const preceptorNavLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { to: '/gestion-estudiantes', text: 'Estudiantes', icon: UsersIcon },
    { to: '/solicitudes', text: 'Solicitudes', icon: DocumentTextIcon },
    { to: '/calendario', text: 'Calendario', icon: CalendarDaysIcon },
];
const studentNavLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/mis-materias', text: 'Materias', icon: DocumentTextIcon },
    { to: '/asistencia', text: 'Asistencia', icon: CheckBadgeIcon },
    { to: '/calendario-escolar', text: 'Calendario', icon: CalendarDaysIcon },
    { to: '/certificados', text: 'Certificados', icon: UsersIcon },
];
const teacherNavLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/materias', text: 'Materias', icon: BookOpenIcon },
    { to: '/reservas', text: 'Reservas', icon: CalendarDaysIcon },
    { to: '/foro', text: 'Foro', icon: ChatBubbleLeftRightIcon },
    { to: '/calendario', text: 'Calendario', icon: CalendarDaysIcon },
];
const directorNavLinks = [
    { to: '/', text: 'Inicio', icon: HomeIcon },
    { to: '/gestion-academica', text: 'Académico', icon: BriefcaseIcon },
    { to: '/usuarios', text: 'Usuarios', icon: UsersIcon },
    { to: '/gestion-reclamos', text: 'Reclamos', icon: ChatBubbleLeftRightIcon },
    { to: '/auditoria', text: 'Auditoría', icon: ShieldCheckIcon },
];

const NavItem: React.FC<{ to: string; text: string; icon: React.ElementType; }> = ({ to, text, icon: Icon }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
                isActive ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-600'
            }`
        }
    >
        <Icon className="w-6 h-6" />
        <span className="text-xs font-medium">{text}</span>
    </NavLink>
);
const BottomNav: React.FC<BottomNavProps> = ({ userRole }) => {
    let links;
    switch(userRole) {
        case 'student': links = studentNavLinks; break;
        case 'teacher': links = teacherNavLinks; break;
        case 'director': links = directorNavLinks; break;
        default: links = preceptorNavLinks;
    }
    return (
        <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] lg:hidden z-20">
            <nav className="h-full flex items-center justify-around">
                {links.map(link => (
                    <NavItem key={link.to} to={link.to} text={link.text} icon={link.icon} />
                ))}
            </nav>
        </footer>
    );
};

// --- END INLINED COMPONENTS ---

type UserRole = 'preceptor' | 'student' | 'teacher' | 'director';
interface User {
    role: UserRole;
}

interface PreceptorAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const PreceptorApp: React.FC<PreceptorAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isProfilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => { setProfilePopoverOpen(false); }, [location.pathname]);

    React.useEffect(() => {
        setHasUnread(hasUnreadNotifications());
    }, [location.pathname]);

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
        '/mis-notas': 'Mis Notas',
        '/cambiar-contrasena': 'Cambiar Contraseña',
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
    const matchChangePassword = useMatch('/cambiar-contrasena');
    const matchGestionEventos = useMatch('/gestion-eventos');
    const matchAyuda = useMatch('/ayuda');
    const matchReportes = useMatch('/reportes');
    const matchMisNotas = useMatch('/mis-notas');
    
    let backPath = '/';
    if (matchSolicitudDetalle) backPath = '/solicitudes';
    else if (matchEstudiantePerfil) backPath = '/gestion-estudiantes';
    else if (matchCrearEvento) backPath = '/gestion-eventos';
    else if (matchEventoQr) backPath = '/gestion-eventos';
    else if (matchEventoDetalle) backPath = '/gestion-eventos';
    else if (matchGestionEventos) backPath = '/asistencia';
    else if (matchCrearComunicado) backPath = '/notificaciones';
    else if (matchNotificacionDetalle) backPath = '/notificaciones';
    else if (matchTomarAsistencia) backPath = '/asistencia';
    else if (matchReportes) backPath = '/asistencia';
    else if (matchChangePassword) backPath = '/configuracion';
    else if (matchAyuda) backPath = '/configuracion';
    else if (matchMisNotas) backPath = '/';


    const showBackButton = !isDashboard;
    
    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
             <ProfilePopover
                isOpen={isProfilePopoverOpen}
                onClose={() => setProfilePopoverOpen(false)}
                onLogout={() => { setProfilePopoverOpen(false); onLogout(); }}
            />
            <Drawer 
                isOpen={false} 
                setIsOpen={() => {}} 
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8 pb-24 lg:pb-0`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onProfileClick={() => setProfilePopoverOpen(true)}
                        showBackButton={showBackButton}
                        isDashboard={isDashboard}
                        backPath={backPath}
                    />
                )}
                {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
                        <Link to="/notificaciones" className="relative p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                            {hasUnread && <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-red-500 rounded-full" />}
                        </Link>
                         <button onClick={() => setProfilePopoverOpen(true)} className="p-2 rounded-full text-slate-600 hover:bg-slate-200">
                            <UserCircleIcon className="w-7 h-7" />
                        </button>
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
                        <Route path="/perfil" element={<ProfileScreen userRole="preceptor" />} />
                        <Route path="/estudiante-perfil" element={<StudentProfileScreen />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/cambiar-contrasena" element={<ChangePasswordScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                        <Route path="/mis-notas" element={<PersonalNotesScreen />} />
                    </Routes>
                </div>
            </main>
            <BottomNav userRole="preceptor" />
        </div>
    );
};

interface StudentAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const StudentApp: React.FC<StudentAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isProfilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    React.useEffect(() => { setProfilePopoverOpen(false); }, [location.pathname]);

    React.useEffect(() => {
        setHasUnread(hasUnreadNotifications());
    }, [location.pathname]);

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
        '/certificados/:requestId': 'Detalle de Solicitud',
        '/solicitar-certificado': 'Solicitar Certificado',
        '/sugerencias': 'Sugerencias y Reclamos',
        '/nueva-sugerencia': 'Nuevo Envío',
        '/sugerencia-detalle/:suggestionId': 'Detalle de Envío',
        '/perfil': 'Mi Perfil',
        '/configuracion': 'Configuración',
        '/cambiar-contrasena': 'Cambiar Contraseña',
        '/ayuda': 'Ayuda y Feedback',
        '/calendario-escolar': 'Calendario Institucional',
        '/eventos-qr': 'Asistencia a Eventos',
        '/materias/:subjectId/foro': 'Foro',
        '/materias/:subjectId/foro/thread/:threadId': 'Foro',
        '/materias/:subjectId/foro/nueva-pregunta': 'Nueva Pregunta',
    };
    
    // --- Call all necessary hooks at the top level ---
    const matchMateriaDetalle = useMatch('/materia-detalle/:subjectId');
    const matchAsistencia = useMatch('/asistencia');
    const matchAsistenciaRegistro = useMatch('/asistencia-registro');
    const matchJustificarAusencia = useMatch('/justificar-ausencia');
    const matchJustificarAusenciaDetalle = useMatch('/justificar-ausencia-detalle');
    const matchJustificacionEstado = useMatch('/justificacion-estado');
    const matchCertificadoDetalle = useMatch('/certificados/:requestId');
    const matchSolicitarCertificado = useMatch('/solicitar-certificado');
    const matchSugerenciaDetalle = useMatch('/sugerencia-detalle/:suggestionId');
    const matchNuevaSugerencia = useMatch('/nueva-sugerencia');
    const matchNotificacionDetalle = useMatch('/notificacion-detalle/:notificationId');
    const matchEventosQR = useMatch('/eventos-qr');
    const matchChangePassword = useMatch('/cambiar-contrasena');
    const matchAyuda = useMatch('/ayuda');
    const matchForo = useMatch('/materias/:subjectId/foro');
    const matchForoThread = useMatch('/materias/:subjectId/foro/thread/:threadId');
    const matchForoNew = useMatch('/materias/:subjectId/foro/nueva-pregunta');


    const titleMatches = Object.keys(screenTitles).reduce((acc, path) => {
        acc[path] = useMatch(path);
        return acc;
    }, {} as Record<string, ReturnType<typeof useMatch>>);

    // --- Deterministic Back Path Logic ---
    let backPath = '/';
    if (matchMateriaDetalle) backPath = '/mis-materias';
    else if (matchForo) backPath = `/materia-detalle/${matchForo.params.subjectId}`;
    else if (matchForoThread) backPath = `/materias/${matchForoThread.params.subjectId}/foro`;
    else if (matchForoNew) backPath = `/materias/${matchForoNew.params.subjectId}/foro`;
    else if (matchAsistencia) {
        if (location.state?.from === '/materia-detalle' && location.state?.subjectId) {
            backPath = `/materia-detalle/${location.state.subjectId}`;
        } else {
            backPath = '/';
        }
    } 
    else if (matchAsistenciaRegistro) backPath = '/asistencia';
    else if (matchJustificarAusencia) backPath = '/asistencia';
    else if (matchJustificarAusenciaDetalle) backPath = '/justificar-ausencia';
    else if (matchJustificacionEstado) backPath = '/justificar-ausencia';
    else if (matchCertificadoDetalle) backPath = '/certificados';
    else if (matchSolicitarCertificado) backPath = '/certificados';
    else if (matchSugerenciaDetalle) backPath = '/sugerencias';
    else if (matchNuevaSugerencia) backPath = '/sugerencias';
    else if (matchNotificacionDetalle) backPath = '/notificaciones';
    else if (matchEventosQR) backPath = '/asistencia';
    else if (matchChangePassword) backPath = '/configuracion';
    else if (matchAyuda) backPath = '/configuracion';

    // --- Title Logic ---
    let title: string;

    if (isDashboard) {
        title = '';
    } else if (matchMateriaDetalle?.params.subjectId) {
        const subject = mockSubjectDetails[matchMateriaDetalle.params.subjectId];
        title = subject ? subject.name : 'Detalle de Materia';
    } else if (matchCertificadoDetalle?.params.requestId) {
        const request = mockCertificateRequests.find(r => r.id.toString() === matchCertificadoDetalle?.params.requestId);
        title = request ? request.type : 'Detalle de Solicitud';
    } else {
        const currentRoute = Object.keys(screenTitles).find(key => titleMatches[key] !== null);
        title = currentRoute ? screenTitles[currentRoute] : 'Inicio';
    }

    const showBackButton = !isDashboard;

    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
             <ProfilePopover
                isOpen={isProfilePopoverOpen}
                onClose={() => setProfilePopoverOpen(false)}
                onLogout={() => { setProfilePopoverOpen(false); onLogout(); }}
            />
            <StudentDrawer 
                isOpen={false} 
                setIsOpen={() => {}}
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8 pb-24 lg:pb-0`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onProfileClick={() => setProfilePopoverOpen(true)}
                        showBackButton={showBackButton}
                        isDashboard={isDashboard}
                        backPath={backPath}
                    />
                )}
                 {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
                        <Link to="/notificaciones" className="relative p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                            {hasUnread && <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-red-500 rounded-full" />}
                        </Link>
                        <button onClick={() => setProfilePopoverOpen(true)} className="p-2 rounded-full text-slate-600 hover:bg-slate-200">
                            <UserCircleIcon className="w-7 h-7" />
                        </button>
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
                        <Route path="/certificados/:requestId" element={<CertificateDetailScreen />} />
                        <Route path="/solicitar-certificado" element={<NewCertificateRequestScreen />} />
                        <Route path="/sugerencias" element={<SuggestionsScreen />} />
                        <Route path="/nueva-sugerencia" element={<NewSuggestionScreen />} />
                        <Route path="/sugerencia-detalle/:suggestionId" element={<SuggestionDetailScreen />} />
                        <Route path="/perfil" element={<StudentMyProfileScreen />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/cambiar-contrasena" element={<ChangePasswordScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                        <Route path="/calendario-escolar" element={<StudentSchoolCalendarScreen />} />
                        <Route path="/eventos-qr" element={<EventAttendanceScreen />} />
                        <Route path="/materias/:subjectId/foro" element={<ForumSubjectScreen userRole="student" />} />
                        <Route path="/materias/:subjectId/foro/thread/:threadId" element={<ForumThreadScreen userRole="student" />} />
                        <Route path="/materias/:subjectId/foro/nueva-pregunta" element={<NewThreadScreen />} />
                    </Routes>
                </div>
            </main>
            <BottomNav userRole="student" />
        </div>
    );
};

interface TeacherAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const TeacherApp: React.FC<TeacherAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isProfilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => { setProfilePopoverOpen(false); }, [location.pathname]);

    React.useEffect(() => { setHasUnread(hasUnreadNotifications()); }, [location.pathname]);

    const isDashboard = location.pathname === '/';
    
    const screenTitles: { [key: string]: string } = {
        '/materias': 'Mis Materias',
        '/reservas': 'Reserva de Recursos',
        '/calendario': 'Calendario Institucional',
        '/foro': 'Foro de Intercambio',
        '/perfil': 'Mi Perfil',
        '/configuracion': 'Configuración',
        '/ayuda': 'Ayuda y Feedback',
        '/cambiar-contrasena': 'Cambiar Contraseña',
        '/notificaciones': 'Notificaciones',
        '/materias/detalle/:subjectId/calificaciones': 'Cargar Notas',
    };

    const matchMateriaDetalle = useMatch('/materias/detalle/:subjectId');
    const matchManageGrades = useMatch('/materias/detalle/:subjectId/calificaciones');
    const matchForoSubject = useMatch('/foro/materias/:subjectId');
    const matchForoThread = useMatch('/foro/materias/:subjectId/thread/:threadId');

    let title = isDashboard ? '' : (screenTitles[location.pathname] || 'Inicio');
    if (matchMateriaDetalle?.params.subjectId) {
        const subject = mockTeacherSubjects.find(s => s.id === matchMateriaDetalle.params.subjectId);
        title = subject ? subject.name : 'Detalle de Materia';
    } else if (matchForoSubject) {
        title = 'Foro';
    } else if (matchForoThread) {
        title = 'Detalle de Consulta';
    } else if (matchManageGrades) {
        title = 'Cargar Notas';
    }
    
    let backPath = '/';
    if (matchMateriaDetalle) {
        backPath = '/materias';
    } else if (matchManageGrades) {
        backPath = `/materias/detalle/${matchManageGrades.params.subjectId}`;
    } else if (matchForoSubject) {
        backPath = '/foro';
    } else if (matchForoThread) {
        backPath = `/foro/materias/${matchForoThread.params.subjectId}`;
    }

    const showBackButton = !isDashboard;
    
    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
             <ProfilePopover
                isOpen={isProfilePopoverOpen}
                onClose={() => setProfilePopoverOpen(false)}
                onLogout={() => { setProfilePopoverOpen(false); onLogout(); }}
            />
            <TeacherDrawer 
                isOpen={false} 
                setIsOpen={() => {}}
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8 pb-24 lg:pb-0`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onProfileClick={() => setProfilePopoverOpen(true)}
                        showBackButton={showBackButton}
                        isDashboard={isDashboard}
                        backPath={backPath}
                    />
                )}
                {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
                        <Link to="/notificaciones" className="relative p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                            {hasUnread && <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-red-500 rounded-full" />}
                        </Link>
                         <button onClick={() => setProfilePopoverOpen(true)} className="p-2 rounded-full text-slate-600 hover:bg-slate-200">
                            <UserCircleIcon className="w-7 h-7" />
                        </button>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <Routes>
                        <Route path="/" element={<TeacherDashboardScreen />} />
                        <Route path="/materias" element={<TeacherSubjectsScreen />} />
                        <Route path="/materias/detalle/:subjectId" element={<TeacherSubjectDetailScreen />} />
                        <Route path="/materias/detalle/:subjectId/calificaciones" element={<ManageGradesScreen />} />
                        <Route path="/reservas" element={<PlaceholderScreen title="Reserva de Recursos" />} />
                        <Route path="/calendario" element={<SchoolCalendarScreen />} />
                        <Route path="/foro" element={<ForumHubScreen />} />
                        <Route path="/foro/materias/:subjectId" element={<ForumSubjectScreen userRole="teacher" />} />
                        <Route path="/foro/materias/:subjectId/thread/:threadId" element={<ForumThreadScreen userRole="teacher" />} />
                        <Route path="/perfil" element={<ProfileScreen userRole="teacher" />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                        <Route path="/cambiar-contrasena" element={<ChangePasswordScreen />} />
                        <Route path="/notificaciones" element={<NotificationsScreen userRole="student" />} />
                        <Route path="/notificacion-detalle/:notificationId" element={<NotificationDetailScreen />} />
                    </Routes>
                </div>
            </main>
            <BottomNav userRole="teacher" />
        </div>
    );
};

interface DirectorAppProps {
    onLogout: () => void;
    isDrawerCollapsed: boolean;
    setIsDrawerCollapsed: (collapsed: boolean) => void;
}

const DirectorApp: React.FC<DirectorAppProps> = ({ onLogout, isDrawerCollapsed, setIsDrawerCollapsed }) => {
    const [isProfilePopoverOpen, setProfilePopoverOpen] = React.useState(false);
    const location = useLocation();
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);
    const [hasUnread, setHasUnread] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => { setProfilePopoverOpen(false); }, [location.pathname]);

    React.useEffect(() => { setHasUnread(hasUnreadNotifications()); }, [location.pathname]);
    
    const isDashboard = location.pathname === '/';

    const screenTitles: { [key: string]: string } = {
        '/gestion-academica': 'Gestión Académica',
        '/usuarios': 'Usuarios y Roles',
        '/reportes': 'Reportes y Estadísticas',
        '/comunicados-director': 'Comunicados',
        '/gestion-reclamos': 'Gestión de Reclamos',
        '/auditoria': 'Auditorías y Backups',
        '/perfil': 'Mi Perfil',
        '/configuracion': 'Configuración',
        '/ayuda': 'Ayuda y Feedback',
        '/cambiar-contrasena': 'Cambiar Contraseña',
    };
    
    let title = isDashboard ? '' : (screenTitles[location.pathname] || 'Inicio');
    const showBackButton = !isDashboard;

    return (
        <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-100">
             <ProfilePopover
                isOpen={isProfilePopoverOpen}
                onClose={() => setProfilePopoverOpen(false)}
                onLogout={() => { setProfilePopoverOpen(false); onLogout(); }}
            />
            <DirectorDrawer 
                isOpen={false} 
                setIsOpen={() => {}}
                onLogout={onLogout}
                isCollapsed={isDrawerCollapsed}
                setIsCollapsed={setIsDrawerCollapsed}
            />
            <main className={`relative transition-all duration-300 ease-in-out ${isDrawerCollapsed ? 'lg:ml-20' : 'lg:ml-64'} lg:pt-8 pb-24 lg:pb-0`}>
                {!isDesktop && (
                    <Header 
                        title={title} 
                        onProfileClick={() => setProfilePopoverOpen(true)}
                        showBackButton={showBackButton}
                        isDashboard={isDashboard}
                        backPath={'/'}
                        notificationsPath="/comunicados-director"
                    />
                )}
                {isDesktop && isDashboard && (
                    <div className="absolute top-6 right-6 z-10 flex items-center space-x-2">
                        <Link to="/comunicados-director" className="relative p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors">
                            <BellIcon className="w-7 h-7" />
                            {hasUnread && <span className="absolute top-2 right-2 block w-2.5 h-2.5 bg-red-500 rounded-full" />}
                        </Link>
                         <button onClick={() => setProfilePopoverOpen(true)} className="p-2 rounded-full text-slate-600 hover:bg-slate-200">
                            <UserCircleIcon className="w-7 h-7" />
                        </button>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <Routes>
                        <Route path="/" element={<DirectorDashboardScreen />} />
                        <Route path="/gestion-academica" element={<AcademicManagementScreen />} />
                        <Route path="/usuarios" element={<UserManagementScreen />} />
                        <Route path="/reportes" element={<ReportsScreen />} />
                        <Route path="/comunicados-director" element={<DirectorCommunicationsScreen />} />
                        <Route path="/gestion-reclamos" element={<ClaimsManagementScreen />} />
                        <Route path="/auditoria" element={<AuditScreen />} />
                        <Route path="/perfil" element={<ProfileScreen userRole="director" />} />
                        <Route path="/configuracion" element={<SettingsScreen />} />
                        <Route path="/ayuda" element={<HelpScreen />} />
                        <Route path="/cambiar-contrasena" element={<ChangePasswordScreen />} />
                    </Routes>
                </div>
            </main>
            <BottomNav userRole="director" />
        </div>
    );
};


const App: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isFadingOut, setIsFadingOut] = React.useState(false);
    const [user, setUser] = React.useState<User | null>(null);
    const [isDrawerCollapsed, setIsDrawerCollapsed] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
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
    React.useEffect(() => {
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

    if (user.role === 'teacher') {
        return <TeacherApp
            onLogout={handleLogout}
            isDrawerCollapsed={isDrawerCollapsed}
            setIsDrawerCollapsed={setIsDrawerCollapsed}
        />;
    }

    if (user.role === 'director') {
        return <DirectorApp
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