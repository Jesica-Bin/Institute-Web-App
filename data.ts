// Fix: Creating data.ts with all mock data to resolve import errors across the application.
import {
  Student,
  AttendanceStatus,
  StudentRequest,
  RequestStatus,
  Notification,
  NotificationType,
  AgendaItem,
  StudentUser,
  TeacherUser,
  DirectorUser,
  StudentSubject,
  SubjectDetail,
  Grade,
  TermGrades,
  StudentAttendanceRecord,
  StudentAttendanceStatus,
  Event,
  EventStatus,
  EventAttendanceStatus,
  CertificateRequest,
  CertificateStatus,
  Suggestion,
  SuggestionStatus,
  AbsenceToJustify,
  JustificationStatus,
  CalendarEvent,
  CalendarEventType,
  ClassStatus,
  TeacherSubject,
  TeacherSubjectDetail,
  ManagedUser,
  UserRole,
  AuditLog,
  ForumThread,
  ForumPost,
  Resource,
  ResourceType,
  Reservation,
  ClassLog,
} from './types';

export const mockUser = {
  name: 'Juana Perez',
  email: 'juana.perez@instituto.edu.ar',
  phone: '11-3456-7890',
  legajo: 'PRE-001',
};

export const mockStudentUser: StudentUser = {
  name: 'Juan Perez',
  email: 'juan.perez@instituto.edu.ar',
  dni: '40.123.456',
  dob: '2002-05-15',
  phone: '11-1234-5678',
};

export const mockTeacherUser: TeacherUser = {
  name: 'Ricardo Molina',
  email: 'ricardo.molina@instituto.edu.ar',
  legajo: 'DOC-015',
};

export const mockDirectorUser: DirectorUser = {
    name: 'Susana Gimenez',
    email: 'susana.gimenez@instituto.edu.ar',
    role: 'Director',
}

export const mockProfessors = [
  { id: 1, name: 'Ricardo Molina' },
  { id: 2, name: 'Susana Gimenez' },
  { id: 3, name: 'Mariana Rodriguez' },
  { id: 4, name: 'Alberto Garcia' },
];

export const mockCareers: string[] = [
  'Tecnicatura Superior en Programación',
  'Tecnicatura Superior en Redes',
  'Tecnicatura Superior en Diseño Gráfico',
  'Tecnicatura Superior en Administración',
];

export const mockYears: string[] = ['1º Año', '2º Año', '3º Año'];

export const courseData = {
  [mockCareers[0]]: {
    '1º Año': ['Programación I', 'Álgebra Lineal', 'Inglés Técnico I', 'Análisis Matemático'],
    '2º Año': ['Programación Web Avanzada', 'Bases de Datos', 'Sistemas Operativos', 'Análisis Matemático II'],
    '3º Año': ['Práctica Profesional'],
  },
  [mockCareers[1]]: {
    '1º Año': ['Redes de Computadoras', 'Laboratorio de Hardware', 'Sistemas Operativos'],
    '2º Año': ['Seguridad Informática', 'Práctica Profesional'],
  },
  [mockCareers[2]]: {
    '1º Año': ['Diseño Web', 'Ética y Deontología Profesional'],
    '2º Año': ['Producción I'],
  },
  [mockCareers[3]]: {
    '1º Año': ['Administración General'],
  },
};


export const mockStudents: Student[] = [
  { id: 1, name: 'Juan', lastName: 'Perez', legajo: 'PROG-1-001', email: 'juan.perez@mail.com', phone: '11-1111-1111', carrera: mockCareers[0] },
  { id: 2, name: 'Maria', lastName: 'Garcia', legajo: 'PROG-1-002', email: 'maria.garcia@mail.com', phone: '11-2222-2222', carrera: mockCareers[0] },
  { id: 3, name: 'Carlos', lastName: 'Rodriguez', legajo: 'PROG-2-001', email: 'carlos.r@mail.com', phone: '11-3333-3333', carrera: mockCareers[0] },
  { id: 4, name: 'Ana', lastName: 'Martinez', legajo: 'RED-1-001', email: 'ana.m@mail.com', phone: '11-4444-4444', carrera: mockCareers[1] },
  { id: 5, name: 'Lucia', lastName: 'Lopez', legajo: 'RED-2-001', email: 'lucia.l@mail.com', phone: '11-5555-5555', carrera: mockCareers[1] },
  { id: 6, name: 'Pedro', lastName: 'Sanchez', legajo: 'DG-1-001', email: 'pedro.s@mail.com', phone: '11-6666-6666', carrera: mockCareers[2] },
];

export const mockAgenda: AgendaItem[] = [
    { id: 1, time: '08:00 - 10:00', subject: 'Programación I', course: 'Tecnicatura Superior en Programación - 1º Año' },
    { id: 2, time: '10:15 - 12:15', subject: 'Redes de Computadoras', course: 'Tecnicatura Superior en Redes - 1º Año' },
    { id: 3, time: '14:00 - 16:00', subject: 'Diseño Web', course: 'Tecnicatura Superior en Diseño Gráfico - 1º Año' },
];

export const mockSystemNotifications: Notification[] = [
  { id: 1, title: 'Actualización del sistema', description: 'El sistema estará en mantenimiento el Sábado de 02:00 a 04:00.', time: 'Hace 2 horas', read: false, type: NotificationType.SYSTEM },
  { id: 2, title: 'Recordatorio de contraseña', description: 'Recuerda cambiar tu contraseña cada 90 días para mantener tu cuenta segura.', time: 'Hace 1 día', read: true, type: NotificationType.SYSTEM },
];

export const mockOfficialCommunications: Notification[] = [
    { id: 3, title: 'Inscripción a finales', description: 'Se abren las inscripciones a las mesas de examen final a partir del Lunes 25.', time: 'Hace 5 horas', read: false, type: NotificationType.OFFICIAL },
    { id: 4, title: 'Feriado Nacional', description: 'El próximo Viernes no habrá actividades académicas por feriado nacional.', time: 'Hace 3 días', read: true, type: NotificationType.OFFICIAL },
    { id: 5, title: 'Charla de IA en la industria', description: 'Invitamos a todos los alumnos a la charla sobre IA que se dará en el SUM.', time: 'Hace 1 semana', read: true, type: NotificationType.OFFICIAL, imageUrl: 'https://placehold.co/600x400/a3bfb8/ffffff?text=Charla+IA' }
];

export const mockAllNotifications: Notification[] = [...mockSystemNotifications, ...mockOfficialCommunications].sort((a,b) => b.id - a.id);

export const mockRequests: StudentRequest[] = [
    { id: 1, title: 'Certificado de Alumno Regular', studentName: 'Juan Perez', date: '2023-10-25', status: RequestStatus.PENDING },
    { id: 2, title: 'Justificación de Inasistencia', studentName: 'Maria Garcia', date: '2023-10-24', status: RequestStatus.COMPLETED },
    { id: 3, title: 'Solicitud de Analítico', studentName: 'Carlos Rodriguez', date: '2023-10-23', status: RequestStatus.IN_PROGRESS },
];

export const mockStudentSubjects: StudentSubject[] = [
    { id: 'prog1', name: 'Programación I', schedule: 'Lunes 08:00 - 12:00\nMiércoles 08:00 - 10:00', professor: 'Ricardo Molina', status: 'cursando', average: 8 },
    { id: 'algebra', name: 'Álgebra Lineal', schedule: 'Martes 10:00 - 12:00', professor: 'Susana Gimenez', status: 'cursando', average: 7 },
    { id: 'ingles1', name: 'Inglés Técnico I', schedule: 'Jueves 09:00 - 11:00', professor: 'Mariana Rodriguez', status: 'terminada', average: 9 },
];

const detailedGradesProg1: TermGrades[] = [
    { termName: "Primer Cuatrimestre", isCollapsible: true, grades: [{name: "TP 1", score: 8}, {name: "TP 2", score: 9}, {name: "Parcial 1", score: 7}], mainScore: 8},
    { termName: "Segundo Cuatrimestre", isCollapsible: true, grades: [{name: "TP 3", score: 10}, {name: "TP 4", score: 8}, {name: "Parcial 2", score: 9}], mainScore: 9},
];

export const mockSubjectDetails: Record<string, SubjectDetail> = {
    'prog1': { ...mockStudentSubjects[0], description: 'Materia introductoria a la programación estructurada y orientada a objetos.', programUrl: '#', grades: [{type: 'Parcial 1', score: 7}, {type: 'Parcial 2', score: 9}, {type: 'Final', score: 8}], detailedGrades: detailedGradesProg1, totalClasses: 32, maxAbsences: 8, absences: 2, presents: 28, justified: 2 },
    'algebra': { ...mockStudentSubjects[1], description: 'Conceptos fundamentales de álgebra lineal y geometría analítica.', programUrl: '#', grades: [{type: 'Parcial 1', score: 6}, {type: 'Parcial 2', score: 8}, {type: 'Final', score: 7}], totalClasses: 16, maxAbsences: 4, absences: 1, presents: 15, justified: 0 },
    'ingles1': { ...mockStudentSubjects[2], description: 'Comprensión de textos técnicos en inglés.', programUrl: '#', grades: [{type: 'Parcial 1', score: 9}, {type: 'Parcial 2', score: 9}, {type: 'Final', score: 9}] },
};

export const mockStudentAttendanceRecords: StudentAttendanceRecord[] = [
    { id: 1, date: '2023-10-25', subject: 'Programación I', status: StudentAttendanceStatus.PRESENT },
    { id: 2, date: '2023-10-24', subject: 'Álgebra Lineal', status: StudentAttendanceStatus.PRESENT },
    { id: 3, date: '2023-10-23', subject: 'Programación I', status: StudentAttendanceStatus.ABSENT },
    { id: 4, date: '2023-10-20', subject: 'Programación I', status: StudentAttendanceStatus.JUSTIFIED },
];

export const mockEvents: Event[] = [
    { id: 'evt1', name: 'Charla de IA en la industria', description: 'Una charla sobre el impacto de la IA generativa en el desarrollo de software.', date: '2023-11-15T18:00:00Z', location: 'Salón de Actos (SUM)', status: EventStatus.ACTIVE, qrCodeData: 'EVENT-IA-2023', latitude: -34.6037, longitude: -58.3816 },
    { id: 'evt2', name: 'Feria de Proyectos Anual', description: 'Exposición de los mejores proyectos de los alumnos de todas las carreras.', date: '2023-12-01T10:00:00Z', location: 'Patio Central', status: EventStatus.ACTIVE, qrCodeData: 'EVENT-FERIA-2023', latitude: -34.6037, longitude: -58.3816 },
    { id: 'evt3', name: 'Taller de Docker', description: 'Taller introductorio a la containerización con Docker.', date: '2023-09-30T14:00:00Z', location: 'Laboratorio 3', status: EventStatus.INACTIVE, qrCodeData: 'EVENT-DOCKER-2023', latitude: -34.6037, longitude: -58.3816, attendanceStatus: EventAttendanceStatus.ATTENDED },
];

export const mockCertificateRequests: CertificateRequest[] = [
    { id: 1, type: 'Certificado de Alumno Regular', requestDate: '2023-10-20', status: CertificateStatus.READY, expiryDate: '2024-04-20', pdfUrl: '#' },
    { id: 2, type: 'Certificado de Asistencia a Examen', requestDate: '2023-08-02', status: CertificateStatus.DELIVERED, pdfUrl: '#' },
    { id: 3, type: 'Certificado de Alumno Regular', requestDate: '2023-10-28', status: CertificateStatus.PENDING },
];

export const mockCertificateTypes: string[] = ['Certificado de Alumno Regular', 'Certificado de Asistencia a Examen', 'Certificado de Porcentaje de Materias Aprobadas', 'Solicitud de Analítico Parcial'];

export const mockSuggestions: Suggestion[] = [
    { id: 1, type: 'Sugerencia', title: 'Más opciones vegetarianas en la cafetería', message: 'Sería genial tener más variedad de comida vegetariana en el menú de la cafetería.', date: '2023-10-15', status: SuggestionStatus.ANSWERED, response: 'Gracias por tu sugerencia. Ya estamos hablando con el proveedor para incluir más opciones a partir del próximo mes.' },
    { id: 2, type: 'Reclamo', title: 'Proyector del Aula 10 no funciona', message: 'El proyector del Aula 10 no enciende. Tuvimos que dar la clase sin poder mostrar las diapositivas.', date: '2023-10-26', status: SuggestionStatus.IN_REVIEW },
];

export const mockAbsencesToJustify: AbsenceToJustify[] = [
    { id: 1, date: '23/10/2023', subject: 'Programación I', status: JustificationStatus.PENDING },
    { id: 2, date: '18/10/2023', subject: 'Álgebra Lineal', status: JustificationStatus.APPROVED },
    { id: 3, date: '16/10/2023', subject: 'Programación I', status: JustificationStatus.REJECTED, rejectionReason: 'El certificado médico no es legible.' },
];

export const mockStudentWeeklySchedule: { [key: string]: { id: string, time: string, subject: string }[] } = {
    'Lunes': [{ id: 's1', time: '08:00 - 12:00', subject: 'Programación I' }],
    'Martes': [{ id: 's2', time: '10:00 - 12:00', subject: 'Álgebra Lineal' }],
    'Miércoles': [{ id: 's1-2', time: '08:00 - 10:00', subject: 'Programación I' }],
    'Jueves': [],
    'Viernes': [],
};

export const mockWeeklyAttendance: { [key: string]: string } = {
    'Lunes': 'Presente',
    'Martes': 'Presente',
    'Miércoles': 'Ausente',
    'Jueves': 'Presente',
    'Viernes': 'Presente',
};

export const mockTeacherSubjects: TeacherSubject[] = [
    { id: 'prog1-ts', name: 'Programación I', course: '1º Año - Tec. en Programación', studentCount: 35, nextClass: 'Lunes 08:00' },
    { id: 'redes1', name: 'Redes de Computadoras', course: '1º Año - Tec. en Redes', studentCount: 28, nextClass: 'Martes 10:15' },
    { id: 'dw', name: 'Diseño Web', course: '1º Año - Tec. en Diseño Gráfico', studentCount: 31, nextClass: 'Miércoles 14:00' },
];

export const mockTeacherSubjectDetails: Record<string, TeacherSubjectDetail> = {
    'prog1-ts': { ...mockTeacherSubjects[0], description: 'Materia introductoria a la programación estructurada y orientada a objetos usando Java.', programUrl: '#', enrolledStudents: mockStudents.filter(s => s.carrera === mockCareers[0]) },
    'redes1': { ...mockTeacherSubjects[1], description: 'Fundamentos de redes de datos, modelo OSI y TCP/IP.', programUrl: '#', enrolledStudents: mockStudents.filter(s => s.carrera === mockCareers[1]) },
    'dw': { ...mockTeacherSubjects[2], description: 'Introducción a HTML, CSS y JavaScript para el diseño y desarrollo de sitios web estáticos.', programUrl: '#', enrolledStudents: mockStudents.filter(s => s.carrera === mockCareers[2]) },
};

export const mockForumThreads: ForumThread[] = [
    { id: 1, subjectId: 'prog1', title: 'Duda sobre el ciclo de vida de un Activity', question: 'No entiendo bien cuándo se llama a onPause() vs onStop(). ¿Alguien podría explicar la diferencia con un ejemplo práctico?', authorName: 'Juan Perez', createdAt: '2023-10-25T10:00:00Z', replies: [{ id: 101, threadId: 1, authorName: 'Ricardo Molina', authorRole: 'teacher', content: '¡Buena pregunta, Juan! onPause() se llama cuando la Activity está a punto de pasar a segundo plano pero todavía es parcialmente visible. onStop() se llama cuando la Activity ya no es visible para el usuario. Piensa en una ventana de diálogo semi-transparente que aparece sobre tu app (onPause) vs. cuando cambias a otra app (onStop).', createdAt: '2023-10-25T11:30:00Z' }], status: 'answered', isPinned: true },
    { id: 2, subjectId: 'prog1', title: 'Error al conectar con la base de datos', question: 'Estoy intentando conectar mi aplicación a una base de datos local pero me da un error de "Connection refused". ¿Qué puede ser?', authorName: 'Maria Garcia', createdAt: '2023-10-26T14:00:00Z', replies: [], status: 'open', isPinned: false },
    { id: 3, subjectId: 'redes1', title: 'Diferencia entre switch y router', question: '¿Cuál es la diferencia fundamental entre un switch y un router?', authorName: 'Ana Martinez', createdAt: '2023-10-24T09:00:00Z', replies: [{ id: 102, threadId: 3, authorName: 'Ricardo Molina', authorRole: 'teacher', content: 'Un switch opera en la Capa 2 (Enlace de datos) y conecta dispositivos en la misma red local (LAN). Un router opera en la Capa 3 (Red) y conecta diferentes redes entre sí.', createdAt: '2023-10-24T10:00:00Z' }], status: 'answered', isPinned: false },
];

export const mockManagedUsers: ManagedUser[] = [
    { id: 1, name: 'Juan Perez', email: 'juan.perez@instituto.edu.ar', role: 'student', status: 'activo', lastLogin: '2023-10-28 10:15' },
    { id: 2, name: 'Ricardo Molina', email: 'ricardo.molina@instituto.edu.ar', role: 'teacher', status: 'activo', lastLogin: '2023-10-28 09:30' },
    { id: 3, name: 'Juana Perez', email: 'juana.perez@instituto.edu.ar', role: 'preceptor', status: 'activo', lastLogin: '2023-10-28 08:45' },
    { id: 4, name: 'Carlos Gomez', email: 'carlos.gomez@instituto.edu.ar', role: 'student', status: 'inactivo', lastLogin: '2023-09-15 14:00' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 1, user: 'Juana Perez', role: 'preceptor', action: 'Cerró el registro de asistencia para "Programación I"', timestamp: '2023-10-28 10:05:12' },
    { id: 2, user: 'Ricardo Molina', role: 'teacher', action: 'Cargó notas para el "Parcial 1" de "Redes de Computadoras"', timestamp: '2023-10-27 18:30:45' },
    { id: 3, user: 'Susana Gimenez', role: 'director', action: 'Generó un reporte de deserción anual', timestamp: '2023-10-27 15:00:00' },
    { id: 4, user: 'Juan Perez', role: 'student', action: 'Solicitó un "Certificado de Alumno Regular"', timestamp: '2023-10-26 11:20:33' },
];

export const mockStudentStatsByCareer = [
    { name: 'Programación', value: 450, color: 'bg-indigo-500' },
    { name: 'Redes', value: 220, color: 'bg-blue-500' },
    { name: 'Diseño', value: 150, color: 'bg-purple-500' },
    { name: 'Admin', value: 33, color: 'bg-sky-500' },
];

export const mockDropoutData = [
    { year: 2021, rate: 15 },
    { year: 2022, rate: 12 },
    { year: 2023, rate: 10 },
];

// Mock calendar events
export const mockCalendarEvents: CalendarEvent[] = [
  // Clases
  { id: 'c1', date: '2024-08-05', type: CalendarEventType.CLASS, title: 'Programación I', startTime: '08:00', endTime: '12:00', course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Ricardo Molina', classroom: 'Aula 10', status: ClassStatus.PENDING },
  { id: 'c2', date: '2024-08-06', type: CalendarEventType.CLASS, title: 'Álgebra Lineal', startTime: '10:00', endTime: '12:00', course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Susana Gimenez', classroom: 'Aula 12', status: ClassStatus.PENDING },
  { id: 'c3', date: '2024-08-07', type: CalendarEventType.CLASS, title: 'Programación I', startTime: '08:00', endTime: '10:00', course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Ricardo Molina', classroom: 'Aula 10', status: ClassStatus.PENDING },
  // Evento Institucional
  { id: 'e1', date: '2024-08-09', type: CalendarEventType.INSTITUTIONAL, title: 'Jornada Docente', description: 'No se dictarán clases.'},
  // Added classes for October 2025
  {
    id: 'c4', date: '2025-10-08', type: CalendarEventType.CLASS,
    title: 'Práctica Profesional', startTime: '18:20', endTime: '19:20',
    course: 'Tecnicatura Superior en Programación - 3º Año', professor: 'Prof. Rodriguez', classroom: 'Aula 1',
    status: ClassStatus.PENDING
  },
  {
    id: 'c5', date: '2025-10-08', type: CalendarEventType.CLASS,
    title: 'Programación I', startTime: '19:20', endTime: '20:30',
    course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Prof. Lopez', classroom: 'Lab 1',
    status: ClassStatus.PENDING
  },
  {
    id: 'c6', date: '2025-10-08', type: CalendarEventType.CLASS,
    title: 'Producción I', startTime: '20:30', endTime: '21:30',
    course: 'Tecnicatura Superior en Diseño Gráfico - 2º Año', professor: 'Prof. Martinez', classroom: 'Aula 12',
    status: ClassStatus.DICTATED,
    attendanceTaken: true,
  },
  {
    id: 'c7', date: '2025-10-08', type: CalendarEventType.CLASS,
    title: 'Práctica Profesional', startTime: '21:30', endTime: '22:30',
    course: 'Tecnicatura Superior en Programación - 3º Año', professor: 'Prof. Rodriguez', classroom: 'Aula 1',
    status: ClassStatus.PENDING
  },
  {
    id: 'c8', date: '2025-10-06', type: CalendarEventType.CLASS,
    title: 'Álgebra Lineal', startTime: '18:00', endTime: '20:00',
    course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Susana Gimenez', classroom: 'Aula 5',
    status: ClassStatus.PENDING
  },
  {
    id: 'c9', date: '2025-10-07', type: CalendarEventType.CLASS,
    title: 'Sistemas Operativos', startTime: '19:00', endTime: '21:00',
    course: 'Tecnicatura Superior en Programación - 2º Año', professor: 'Prof. Gomez', classroom: 'Lab 2',
    status: ClassStatus.PENDING
  },
  {
    id: 'c10', date: '2025-10-09', type: CalendarEventType.CLASS,
    title: 'Inglés Técnico I', startTime: '20:00', endTime: '22:00',
    course: 'Tecnicatura Superior en Programación - 1º Año', professor: 'Mariana Rodriguez', classroom: 'Aula 3',
    status: ClassStatus.PENDING
  },
];

// --- Teacher Class Logbook Data ---
export const mockClassLogs: ClassLog[] = [
    {
        id: 'c6-2025-10-08',
        eventId: 'c6',
        date: '2025-10-08',
        topic: 'Introducción a la Tipografía',
        activities: 'Se realizó una presentación sobre los conceptos básicos de la tipografía y su historia. Los alumnos comenzaron a trabajar en el TP1.',
        observations: 'La mayoría de los alumnos mostraron interés. Recordar traer materiales para la próxima clase.'
    }
];


// --- Resource Reservation Data ---
export const mockResources: Resource[] = [
  { id: 'proj-1', name: 'Proyector Epson A (Móvil)', type: ResourceType.PROJECTOR },
  { id: 'proj-2', name: 'Proyector BenQ B (Móvil)', type: ResourceType.PROJECTOR },
  { id: 'proj-3', name: 'Proyector Aula 10 (Fijo)', type: ResourceType.PROJECTOR },
  { id: 'lab-a', name: 'Sala de Computadoras A (20 PCs)', type: ResourceType.COMPUTER_LAB },
  { id: 'lab-b', name: 'Sala de Computadoras B (15 PCs)', type: ResourceType.COMPUTER_LAB },
];

const getFutureDate = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().split('T')[0];
}

export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    resourceId: 'proj-1',
    teacherId: 'DOC-015', // Ricardo Molina
    teacherName: 'Ricardo Molina',
    subject: 'Programación I',
    date: getFutureDate(2),
    startTime: '08:00',
    endTime: '10:00',
  },
  {
    id: 'res-2',
    resourceId: 'lab-a',
    teacherId: 'DOC-015', // Ricardo Molina
    teacherName: 'Ricardo Molina',
    subject: 'Programación I',
    date: getFutureDate(4),
    startTime: '10:00',
    endTime: '12:00',
  },
  {
    id: 'res-3',
    resourceId: 'proj-1',
    teacherId: 'DOC-016', // Other teacher
    teacherName: 'Mariana Rodriguez',
    subject: 'Inglés Técnico I',
    date: getFutureDate(2), // Same day as res-1, different time
    startTime: '14:00',
    endTime: '16:00',
  },
];