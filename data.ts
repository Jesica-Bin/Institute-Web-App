import { 
    Student, AgendaItem, StudentRequest, RequestStatus, Notification, NotificationType, 
    StudentUser, StudentSubject, SubjectDetail, StudentAttendanceRecord, StudentAttendanceStatus, Grade,
    Event, EventStatus, EventAttendanceStatus, CertificateRequest, CertificateStatus,
    Suggestion, SuggestionStatus,
    AbsenceToJustify, JustificationStatus, TermGrades,
    CalendarEvent, CalendarEventType, ClassStatus, LateStudent
} from './types';

export const mockUser = {
  name: 'Juana Pérez',
  email: 'juana.perez@instituto.edu.ar',
  phone: '11-3456-7890',
  legajo: 'JP-12345',
};

export const mockAgenda: AgendaItem[] = [
  { id: 1, time: '18:20 - 20:20', subject: 'Práctica Profesional I', course: 'Desarrollo de software - 2º Año' },
  { id: 2, time: '18:20 - 19:20', subject: 'Laboratorio de Hardware', course: 'Diseño, imagen y sonido - 1º Año' },
  { id: 3, time: '19:20 - 20:20', subject: 'Análisis Matemático II', course: 'Desarrollo de software - 2º Año' },
  { id: 4, time: '20:30 - 21:30', subject: 'Sistemas Operativos', course: 'Diseño y produccion de indumentaria - 3º Año' },
  { id: 5, time: '20:30 - 22:30', subject: 'Programación Web Avanzada', course: 'Desarrollo de software - 3º Año' },
  { id: 6, time: '21:30 - 22:30', subject: 'Seguridad Informática', course: 'Turismo - 2º Año' },
];

export const mockCareers: string[] = [
  'Desarrollo de software',
  'Diseño y produccion de indumentaria',
  'Diseño, imagen y sonido',
  'Turismo',
];

export const mockYears: string[] = ['1º Año', '2º Año', '3º Año'];

export const mockSubjects: string[] = [
  'Práctica Profesional',
  'Laboratorio de Hardware',
  'Análisis Matemático',
  'Sistemas Operativos',
  'Programación Web',
];

export const courseData: { [career: string]: { [year: string]: string[] } } = {
    'Desarrollo de software': {
        '1º Año': ['Programación I', 'Álgebra Lineal', 'Inglés Técnico I'],
        '2º Año': ['Análisis Matemático II', 'Sistemas Operativos', 'Bases de Datos'],
        '3º Año': ['Práctica Profesional', 'Programación Web Avanzada', 'Seguridad Informática']
    },
    'Diseño y produccion de indumentaria': {
        '1º Año': ['Diseño I', 'Materiales Textiles'],
        '2º Año': ['Moldería I', 'Producción I'],
        '3º Año': ['Moldería II', 'Gestión de la Producción', 'Marketing de Moda']
    },
    'Diseño, imagen y sonido': {
        '1º Año': ['Laboratorio de Hardware', 'Teoría de la Imagen', 'Guion'],
        '2º Año': ['Sonido I', 'Edición Audiovisual', 'Cámara e Iluminación'],
        '3º Año': ['Postproducción', 'Dirección de Arte', 'Proyecto Final']
    },
    'Turismo': {
        '1º Año': ['Geografía Turística', 'Introducción al Turismo', 'Portugués I'],
        '2º Año': ['Servicios Turísticos', 'Patrimonio Cultural', 'Portugués II'],
        '3º Año': ['Gestión de Agencias', 'Marketing Turístico', 'Práctica Profesional']
    }
};

const desarrolloSoftware = 'Desarrollo de software';
const disenoIndumentaria = 'Diseño y produccion de indumentaria';
const disenoImagenSonido = 'Diseño, imagen y sonido';
const turismo = 'Turismo';

export const mockStudents: Student[] = [
  { id: 1, name: 'Carlos', lastName: 'Gomez', legajo: 'DS-201', email: 'carlos.gomez@email.com', phone: '11-1111-1111', carrera: desarrolloSoftware },
  { id: 2, name: 'Ana', lastName: 'Martinez', legajo: 'RT-101', email: 'ana.martinez@email.com', phone: '11-2222-2222', carrera: disenoIndumentaria },
  { id: 3, name: 'Luis', lastName: 'Fernandez', legajo: 'DS-202', email: 'luis.fernandez@email.com', phone: '11-3333-3333', carrera: desarrolloSoftware },
  { id: 4, name: 'Maria', lastName: 'Rodriguez', legajo: 'DS-301', email: 'maria.rodrigues@email.com', phone: '11-4444-4444', carrera: disenoImagenSonido },
  { id: 5, name: 'Jorge', lastName: 'Lopez', legajo: 'RT-201', email: 'jorge.lopez@email.com', phone: '11-5555-5555', carrera: turismo },
  { id: 6, name: 'Laura', lastName: 'Diaz', legajo: 'DS-101', email: 'laura.diaz@email.com', phone: '11-6666-6666', carrera: disenoIndumentaria },
  { id: 7, name: 'Pedro', lastName: 'Sanchez', legajo: 'RT-301', email: 'pedro.sanchez@email.com', phone: '11-7777-7777', carrera: turismo },
  { id: 8, name: 'Sofia', lastName: 'Perez', legajo: 'DS-203', email: 'sofia.perez@email.com', phone: '11-8888-8888', carrera: desarrolloSoftware },
  { id: 9, name: 'Miguel', lastName: 'Garcia', legajo: 'RT-102', email: 'miguel.garcia@email.com', phone: '11-9999-9999', carrera: disenoImagenSonido },
  { id: 10, name: 'Valentina', lastName: 'Romero', legajo: 'DS-302', email: 'valentina.romero@email.com', phone: '11-0000-0000', carrera: disenoIndumentaria },
];

export const mockLateStudents: LateStudent[] = [
  { id: 1, name: 'Carlos', lastName: 'Gomez', reason: 'Tráfico en la autopista.' },
  { id: 3, name: 'Luis', lastName: 'Fernandez', reason: 'Turno médico, llego en 20 mins.' },
  { id: 8, name: 'Sofia', lastName: 'Perez', reason: 'Problemas con el transporte público.' },
];

const mockLateReasons: string[] = [
    'Tráfico en la autopista.',
    'Turno médico, llego en 20 mins.',
    'Problemas con el transporte público.',
    'Se quedó dormido.',
    'El colectivo no pasó a horario.',
    'Tuvo que ayudar a un familiar.',
    'Está con un cuadro gripal, pero viene igual.',
];

// New function to generate dynamic late students
export const getLateStudentsForCareer = (career: string): LateStudent[] => {
    // 1. Filter students by career
    const studentsInCareer = mockStudents.filter(s => s.carrera === career);
    if (studentsInCareer.length === 0) {
        return [];
    }

    // 2. Shuffle the array to get random students
    const shuffled = [...studentsInCareer].sort(() => 0.5 - Math.random());

    // 3. Determine a random number of late students (e.g., 0 to 3, but not more than available)
    const maxLate = Math.min(3, studentsInCareer.length);
    const numberOfLateStudents = Math.floor(Math.random() * (maxLate + 1));
    
    if (numberOfLateStudents === 0) {
        return [];
    }

    // 4. Take the first N students from the shuffled array
    const selectedStudents = shuffled.slice(0, numberOfLateStudents);

    // 5. Map them to the LateStudent format with a random reason
    return selectedStudents.map(student => ({
        id: student.id,
        name: student.name,
        lastName: student.lastName,
        reason: mockLateReasons[Math.floor(Math.random() * mockLateReasons.length)],
    }));
};


export const mockRequests: StudentRequest[] = [
    { id: 1, title: 'Justificación de inasistencia', studentName: 'Carlos Gomez', date: '2024-05-20', status: RequestStatus.PENDING },
    { id: 2, title: 'Solicitud de mesa de examen', studentName: 'Ana Martinez', date: '2024-05-18', status: RequestStatus.COMPLETED },
    { id: 3, title: 'Cambio de comisión', studentName: 'Luis Fernandez', date: '2024-05-15', status: RequestStatus.IN_PROGRESS },
    { id: 4, title: 'Justificación de inasistencia', studentName: 'Maria Rodriguez', date: '2024-05-21', status: RequestStatus.PENDING },
    { id: 5, title: 'Solicitud de Alumno Regular', studentName: 'Sofia Perez', date: '2024-06-02', status: RequestStatus.PENDING },
    { id: 6, title: 'Solicitud Constancia de Examen', studentName: 'Pedro Sanchez', date: '2024-05-28', status: RequestStatus.IN_PROGRESS },
];

export const mockSystemNotifications: Notification[] = [
    { id: 1, title: 'Actualización de la plataforma', description: 'El sistema estará en mantenimiento el día Sábado de 02:00 a 04:00. Durante este período, el acceso a la plataforma podría verse interrumpido. Agradecemos su comprensión.', time: 'Hace 2 horas', read: false, type: NotificationType.SYSTEM },
    { id: 2, title: 'Nueva versión de la app disponible', description: 'Hemos lanzado una nueva versión de la aplicación con mejoras de rendimiento y correcciones de errores. Por favor, actualiza desde la tienda de aplicaciones para obtener la mejor experiencia.', time: 'Hace 1 día', read: true, type: NotificationType.SYSTEM },
    { id: 10, title: 'Recordatorio de contraseña', description: 'Por seguridad, te recomendamos cambiar tu contraseña cada 6 meses. Puedes hacerlo desde la sección de Configuración de tu perfil.', time: 'Hace 1 semana', read: true, type: NotificationType.SYSTEM },
];

export const mockOfficialCommunications: Notification[] = [
    { id: 3, title: 'Inscripción a finales', description: 'Se informa a todos los estudiantes que la inscripción a las mesas de examen finaliza el día 30/05. No se aceptarán inscripciones fuera de término.', time: 'Hace 3 días', read: false, type: NotificationType.OFFICIAL },
    { id: 4, title: 'Feriado Nacional', description: 'El próximo Lunes no habrá actividades académicas ni administrativas en la institución debido al feriado nacional. Las clases se reanudarán el día Martes en sus horarios habituales.', time: 'Hace 1 semana', read: true, type: NotificationType.OFFICIAL },
    { id: 5, title: 'Campaña de vacunación', description: 'El centro de estudiantes organiza una campaña de vacunación antigripal el próximo Miércoles en el SUM. Acércate con tu carnet de vacunación.', time: 'Hace 2 semanas', read: true, type: NotificationType.OFFICIAL },
    { id: 6, title: 'Charla sobre salida laboral', description: 'Invitamos a todos los alumnos de 3er año a la charla sobre "Herramientas para la inserción laboral" que se dará el Viernes en el Auditorio.', time: 'Hace 2 semanas', read: true, type: NotificationType.OFFICIAL },
];

export const mockAllNotifications = [...mockSystemNotifications, ...mockOfficialCommunications];


// New Student Mock Data
export const mockStudentUser: StudentUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@instituto.edu.ar',
  dni: '12.345.678',
  dob: '1999-07-15',
  phone: '11-9876-5432',
};

// Data for Student Dashboard Screen
export const mockStudentWeeklySchedule: { [key: string]: { id: number; subject: string; time: string }[] } = {
    'Lunes': [
        { id: 1, subject: 'Álgebra Lineal', time: '18:00 a 19:30' },
        { id: 2, subject: 'Programación I', time: '19:45 a 21:15' },
    ],
    'Martes': [
        { id: 3, subject: 'Análisis Matemático', time: '18:20 a 19:20' },
        { id: 4, subject: 'Análisis Matemático', time: '19:30 a 20:20' },
        { id: 5, subject: 'Diseño Web', time: '20:30 a 21:30' },
        { id: 6, subject: 'Diseño Web', time: '21:30 a 22:20' },
    ],
    'Miércoles': [
        { id: 7, subject: 'Inglés Técnico I', time: '18:00 a 19:30' },
        { id: 8, subject: 'Bases de Datos', time: '19:45 a 21:15' },
    ],
    'Jueves': [
         { id: 9, subject: 'Sistemas Operativos', time: '18:20 a 20:20' },
         { id: 10, subject: 'Redes de Computadoras', time: '20:30 a 22:20' },
    ],
    'Viernes': [
        { id: 11, subject: 'Ética y Deontología Profesional', time: '18:00 a 19:30' },
    ]
};


export const mockWeeklyAttendance = [
    { day: 'Lun', status: 'P' },
    { day: 'Mar', status: 'P' },
    { day: 'Mie', status: 'A' },
    { day: 'Jue', status: 'P' },
    { day: 'Vie', status: 'J' },
];

export const mockRecentNotifications = [
    { id: 1, title: 'Asistencia registrada', time: '10 min' },
    { id: 2, title: 'Suspensión de clases', time: '1d' },
    { id: 3, title: 'Inscripción a mesas de examen', time: '05/09' },
];


export const mockStudentSubjects: StudentSubject[] = [
  { id: 'mat1', name: 'Análisis Matemático', schedule: 'Lun 18:30 a 20:30', professor: 'Dr. Smith', status: 'cursando' },
  { id: 'prog-web', name: 'Diseño Web', schedule: 'Mar 19:00 a 21:00', professor: 'Lic. Garcia', status: 'cursando' },
  { id: 'bdd1', name: 'Bases de Datos', schedule: 'Jue 20:00 a 22:00', professor: 'Ing. Rodriguez', status: 'cursando' },
  { id: 'so1', name: 'Sistemas Operativos', schedule: 'Vie 18:30 a 20:30', professor: 'Lic. Martinez', status: 'cursando' },
  { id: 'is1', name: 'Ingenieria de Software', schedule: 'Mier 18:30 a 20:30', professor: 'Lic. Martinez', status: 'terminada', average: 9 },
  { id: 'alg1', name: 'Álgebra Lineal', schedule: 'Lun 18:00 a 19:30', professor: 'Dr. Gauss', status: 'cursando' },
  { id: 'prog1', name: 'Programación I', schedule: 'Lun 19:45 a 21:15', professor: 'Ing. Kernighan', status: 'cursando' },
  { id: 'ing1', name: 'Inglés Técnico I', schedule: 'Mié 18:00 a 19:30', professor: 'Trad. Jones', status: 'cursando' },
  { id: 'redes1', name: 'Redes de Computadoras', schedule: 'Jue 20:30 a 22:20', professor: 'Lic. Tanenbaum', status: 'cursando' },
  { id: 'etica1', name: 'Ética y Deontología Profesional', schedule: 'Vie 18:00 a 19:30', professor: 'Dr. Kant', status: 'cursando' },
];

const mat1Grades: Grade[] = [ { type: 'Parcial 1', score: 8 }, { type: 'Parcial 2', score: 7 }, { type: 'Final', score: null } ];
const progWebGrades: Grade[] = [ { type: 'Parcial 1', score: 9 }, { type: 'Parcial 2', score: null }, { type: 'Final', score: null } ];
const bdd1Grades: Grade[] = [ { type: 'Parcial 1', score: 6 }, { type: 'Parcial 2', score: 8 }, { type: 'Final', score: null } ];
const so1Grades: Grade[] = [ { type: 'Parcial 1', score: 6 }, { type: 'Parcial 2', score: 6 }, { type: 'Final', score: 7 } ];
const is1Grades: Grade[] = [ { type: 'Parcial 1', score: 8 }, { type: 'Parcial 2', score: 9 }, { type: 'Final', score: 9 } ];
const placeholderGrades: Grade[] = [ { type: 'Parcial 1', score: null }, { type: 'Parcial 2', score: null }, { type: 'Final', score: null } ];


const mat1DetailedGrades: TermGrades[] = [
    {
        termName: 'Primer cuatrimestre',
        isCollapsible: true,
        mainScore: 9,
        grades: [
            { name: 'Trabajo Practico', score: 8 },
            { name: 'Parcial', score: 9 },
            { name: 'Promedio', score: 9 },
        ]
    },
    {
        termName: 'Segundo cuatrimestre',
        isCollapsible: true,
        mainScore: 10,
        grades: []
    },
    {
        termName: 'Final',
        isCollapsible: false,
        mainScore: null,
        grades: []
    }
];

export const mockSubjectDetails: { [key: string]: SubjectDetail } = {
    'mat1': { 
        ...mockStudentSubjects[0], 
        description: 'Lorem ipsum facilisis mauris purus maecenas in aliquam laoreet turpis tempus convallis nibh eget orci consectetur sem.', 
        programUrl: '#', 
        grades: mat1Grades,
        schedule: 'Lun 18:20 a 20:20\nMie 19:20 a 20:20',
        detailedGrades: mat1DetailedGrades,
        totalClasses: 32,
        maxAbsences: 8,
        presents: 24,
        absences: 6,
        justified: 2
    },
    'prog-web': { 
        ...mockStudentSubjects[1], 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis.', 
        programUrl: '#', 
        grades: progWebGrades,
        totalClasses: 32,
        maxAbsences: 8,
        presents: 28,
        absences: 2,
        justified: 0
    },
    'bdd1': { 
        ...mockStudentSubjects[2], 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis.', 
        programUrl: '#', 
        grades: bdd1Grades,
        totalClasses: 32,
        maxAbsences: 8,
        presents: 22,
        absences: 8,
        justified: 1
    },
    'so1': { 
        ...mockStudentSubjects[3], 
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis.', 
        programUrl: '#', 
        grades: so1Grades,
        totalClasses: 32,
        maxAbsences: 8,
        presents: 29,
        absences: 1,
        justified: 0
     },
    'is1': { ...mockStudentSubjects[4], description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget nunc lobortis.', programUrl: '#', grades: is1Grades },
    'alg1': { ...mockStudentSubjects[5], description: 'Estudio de vectores, matrices, espacios vectoriales y transformaciones lineales.', programUrl: '#', grades: placeholderGrades },
    'prog1': { ...mockStudentSubjects[6], description: 'Fundamentos de la programación, algoritmos y estructuras de datos.', programUrl: '#', grades: placeholderGrades },
    'ing1': { ...mockStudentSubjects[7], description: 'Comprensión de textos técnicos y académicos en inglés.', programUrl: '#', grades: placeholderGrades },
    'redes1': { ...mockStudentSubjects[8], description: 'Estudio de arquitecturas, protocolos y modelos de redes de computadoras.', programUrl: '#', grades: placeholderGrades },
    'etica1': { ...mockStudentSubjects[9], description: 'Análisis de los principios éticos y responsabilidades en el ejercicio profesional.', programUrl: '#', grades: placeholderGrades },
};

export const mockStudentAgenda: AgendaItem[] = [
    { id: 1, time: '18:30 - 20:30', subject: 'Análisis Matemático', course: 'Aula 5' },
    { id: 2, time: '19:00 - 21:00', subject: 'Programación Web', course: 'Laboratorio 2' },
    { id: 3, time: '20:00 - 22:00', subject: 'Bases de Datos', course: 'Aula 12' },
];

export const mockStudentAttendanceRecords: StudentAttendanceRecord[] = [
    // Data for 'Análisis Matemático' to match summary (6 Absences, 2 Justified)
    { id: 1, date: '2024-05-20', subject: 'Análisis Matemático', status: StudentAttendanceStatus.PRESENT },
    { id: 4, date: '2024-05-17', subject: 'Análisis Matemático', status: StudentAttendanceStatus.PRESENT },
    { id: 12, date: '2024-05-16', subject: 'Análisis Matemático', status: StudentAttendanceStatus.PRESENT },
    { id: 7, date: '2024-05-14', subject: 'Análisis Matemático', status: StudentAttendanceStatus.PRESENT },
    { id: 10, date: '2024-05-11', subject: 'Análisis Matemático', status: StudentAttendanceStatus.PRESENT },
    { id: 13, date: '2024-05-09', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 14, date: '2024-05-07', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 15, date: '2024-05-04', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 16, date: '2024-05-02', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 17, date: '2024-04-30', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 18, date: '2024-04-28', subject: 'Análisis Matemático', status: StudentAttendanceStatus.ABSENT },
    { id: 19, date: '2024-04-26', subject: 'Análisis Matemático', status: StudentAttendanceStatus.JUSTIFIED },
    { id: 20, date: '2024-04-24', subject: 'Análisis Matemático', status: StudentAttendanceStatus.JUSTIFIED },

    // Data for other subjects
    { id: 2, date: '2024-05-19', subject: 'Diseño Web', status: StudentAttendanceStatus.PRESENT },
    { id: 5, date: '2024-05-16', subject: 'Diseño Web', status: StudentAttendanceStatus.PRESENT },
    { id: 8, date: '2024-05-13', subject: 'Diseño Web', status: StudentAttendanceStatus.ABSENT },
    { id: 11, date: '2024-05-10', subject: 'Diseño Web', status: StudentAttendanceStatus.PRESENT },
    { id: 3, date: '2024-05-18', subject: 'Bases de Datos', status: StudentAttendanceStatus.ABSENT },
    { id: 6, date: '2024-05-15', subject: 'Bases de Datos', status: StudentAttendanceStatus.PRESENT },
    { id: 9, date: '2024-05-12', subject: 'Bases de Datos', status: StudentAttendanceStatus.PRESENT },
];

export const mockAbsencesToJustify: AbsenceToJustify[] = [
    { id: 1, date: '12 de septiembre', subject: 'Análisis Matemático', status: JustificationStatus.PENDING },
    { 
        id: 2, 
        date: '1 de septiembre', 
        subject: 'Análisis Matemático', 
        status: JustificationStatus.REJECTED,
        rejectionReason: 'El certificado presentado no es legible. Por favor, sube una imagen más clara.'
    },
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    name: 'Charla de Introducción a la IA',
    description: 'Una charla sobre los fundamentos de la Inteligencia Artificial y sus aplicaciones.',
    date: '2024-08-15',
    location: 'Auditorio Principal',
    status: EventStatus.ACTIVE,
    qrCodeData: 'EVENT-IA-2024-CHECKIN',
    latitude: -34.6037, // Example coords for Buenos Aires
    longitude: -58.3816,
  },
  {
    id: 'evt2',
    name: 'Feria de Proyectos de Software',
    description: 'Exposición de los proyectos finales de los alumnos de 3er año.',
    date: '2024-08-20',
    location: 'SUM',
    status: EventStatus.ACTIVE,
    qrCodeData: 'EVENT-FERIA-2024-CHECKIN',
    latitude: -34.6037,
    longitude: -58.3816,
  },
  {
    id: 'evt3',
    name: 'Seminario de Diseño Gráfico',
    description: 'Un seminario intensivo sobre las nuevas tendencias en diseño.',
    date: '2024-05-10',
    location: 'Aula Magna',
    status: EventStatus.INACTIVE,
    qrCodeData: 'EVENT-SEMINARIO-2024-CHECKIN',
    latitude: -34.6037,
    longitude: -58.3816,
    attendanceStatus: EventAttendanceStatus.ATTENDED,
  },
  {
    id: 'evt4',
    name: 'Taller de Oratoria',
    description: 'Taller práctico para mejorar las habilidades de comunicación.',
    date: '2024-04-22',
    location: 'Sala de Conferencias',
    status: EventStatus.INACTIVE,
    qrCodeData: 'EVENT-ORATORIA-2024-CHECKIN',
    latitude: -34.6037,
    longitude: -58.3816,
    attendanceStatus: EventAttendanceStatus.ABSENT,
  },
  {
    id: 'evt5',
    name: 'Encuentro de Egresados',
    description: 'Reunión anual de egresados de todas las carreras.',
    date: '2024-03-15',
    location: 'Patio Central',
    status: EventStatus.INACTIVE,
    qrCodeData: 'EVENT-EGRESADOS-2024-CHECKIN',
    latitude: -34.6037,
    longitude: -58.3816,
    attendanceStatus: EventAttendanceStatus.JUSTIFIED,
  }
];

export const mockCertificateTypes: string[] = [
  'Certificado de Alumno Regular',
  'Constancia de Examen',
  'Certificado Analítico Parcial',
  'Constancia de Asistencia a Cursada',
];

export const mockCertificateRequests: CertificateRequest[] = [
  { id: 1, type: 'Certificado de Alumno Regular', requestDate: '2024-03-10', status: CertificateStatus.DELIVERED, expiryDate: '2024-05-10' },
  { id: 2, type: 'Constancia de Examen', requestDate: '2024-05-28', status: CertificateStatus.READY },
  { id: 3, type: 'Certificado Analítico Parcial', requestDate: '2024-06-02', status: CertificateStatus.PENDING },
];

export const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    type: 'Sugerencia',
    title: 'Más enchufes en la biblioteca',
    message: 'Sería muy útil si pudieran instalar más enchufes en las mesas de la biblioteca. A veces es difícil encontrar un lugar para cargar la notebook.',
    date: '2024-05-15',
    status: SuggestionStatus.ANSWERED,
    response: '¡Hola! Gracias por tu sugerencia. Ya hemos elevado el pedido al departamento de infraestructura. Esperamos tener novedades pronto. Saludos, Centro de Estudiantes.'
  },
  {
    id: 2,
    type: 'Reclamo',
    title: 'Dispensador de agua sin funcionar',
    message: 'El dispensador de agua del segundo piso lleva una semana sin funcionar. ¿Podrían revisarlo?',
    date: '2024-06-01',
    status: SuggestionStatus.IN_REVIEW,
  },
  {
    id: 3,
    type: 'Sugerencia',
    title: 'Tutorías de programación',
    message: 'Quería proponer la idea de organizar tutorías entre pares para las materias de programación de primer año. Creo que ayudaría mucho a los ingresantes.',
    date: '2024-06-03',
    status: SuggestionStatus.SENT,
  }
];

// --- Mock Calendar Data ---
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

function getDayInCurrentMonth(day: number) {
    return new Date(year, month, day).toISOString().split('T')[0];
}

const existingEvents: CalendarEvent[] = [
    // Holiday
    { id: 'e1', date: getDayInCurrentMonth(9), type: CalendarEventType.HOLIDAY, title: 'Feriado Nacional' },
    // Institutional
    { id: 'e2', date: getDayInCurrentMonth(10), type: CalendarEventType.INSTITUTIONAL, title: 'Jornada Institucional' },
    // Exam
    { id: 'e3', date: getDayInCurrentMonth(16), type: CalendarEventType.EXAM, title: 'Mesa de Examen Final: Álgebra', description: 'Inscripción requerida. Se rinde en el Aula Magna.', startTime: '18:00' },
    { id: 'e4', date: getDayInCurrentMonth(17), type: CalendarEventType.EXAM, title: 'Mesa de Examen Final: Programación', description: 'Inscripción requerida. Se rinde en el Laboratorio 3.', startTime: '18:00' },
];

// --- GENERATE MORE MOCK CLASS DATA ---
const professors = ['García', 'Martinez', 'Rodriguez', 'Fernandez', 'Lopez', 'Perez', 'Gomez', 'Diaz'];
const classrooms = ['Aula 5', 'Lab 2', 'Aula 12', 'Aula 1', 'Aula 3', 'Lab 1', 'SUM', 'Auditorio'];
const timeSlots = [
    { start: '18:20', end: '19:20' },
    { start: '19:20', end: '20:20' },
    { start: '20:30', end: '21:30' },
    { start: '21:30', end: '22:30' },
];

const generatedClasses: CalendarEvent[] = [];
let classIdCounter = 100;
const todayDay = today.getDate();

// Loop through weekdays of the current month
for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();

    if (dayOfWeek > 0 && dayOfWeek < 6) { // Monday to Friday
        const dateStr = getDayInCurrentMonth(day);
        const usedSlotsForDay: { [key: string]: boolean } = {}; // Classroom-time combo

        const isToday = day === todayDay;
        // Aim for ~15 classes per hour slot, resulting in ~60 classes per day.
        const targetClassCount = isToday ? 70 : Math.floor(Math.random() * 15) + 50;
        
        let i = 0;
        // Keep adding classes until we hit the target for the day
        while (generatedClasses.filter(c => c.date === dateStr).length < targetClassCount && i < targetClassCount * 2) {
            i++;
            
            const career = mockCareers[Math.floor(Math.random() * mockCareers.length)];
            const yearKey = mockYears[Math.floor(Math.random() * mockYears.length)];
            const subjects = courseData[career]?.[yearKey] || [];
            if (subjects.length === 0) continue;

            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            const timeSlotIndex = Math.floor(Math.random() * timeSlots.length);
            const time = timeSlots[timeSlotIndex];
            const classroom = classrooms[Math.floor(Math.random() * classrooms.length)];
            
            // A classroom can only have one class at a time
            const uniqueSlotKey = `${classroom}-${time.start}`;
            if (usedSlotsForDay[uniqueSlotKey]) continue;

            // Logic for consecutive classes
            const canBeDouble = timeSlotIndex < timeSlots.length - 1;
            let isDouble = canBeDouble && Math.random() < 0.3; // 30% chance for a double-hour class

            let nextTime;
            let nextUniqueSlotKey;
            if (isDouble) {
                nextTime = timeSlots[timeSlotIndex + 1];
                nextUniqueSlotKey = `${classroom}-${nextTime.start}`;
                // A double class should be contiguous. Check if the next slot is taken or not contiguous.
                if (usedSlotsForDay[nextUniqueSlotKey] || nextTime.start !== time.end) {
                    isDouble = false;
                }
            }
            
            const professor = `Prof. ${professors[Math.floor(Math.random() * professors.length)]}`;
            // For today, make more classes pending. For other days, make most registered.
            const attendanceTaken = isToday ? Math.random() > 0.7 : Math.random() > 0.1;

            const baseEvent: Omit<CalendarEvent, 'id' | 'startTime' | 'endTime'> = {
                date: dateStr,
                type: CalendarEventType.CLASS,
                title: subject,
                professor,
                classroom,
                course: `${career} - ${yearKey}`,
                status: ClassStatus.NORMAL,
                attendanceTaken, // This status is shared for both hours of a double class
            };

            // Add the first hour
            usedSlotsForDay[uniqueSlotKey] = true;
            generatedClasses.push({
                ...baseEvent,
                id: `c${classIdCounter++}`,
                startTime: time.start,
                endTime: time.end,
            });

            // Add the second hour if it's a double class
            if (isDouble && nextTime && nextUniqueSlotKey) {
                usedSlotsForDay[nextUniqueSlotKey] = true;
                generatedClasses.push({
                    ...baseEvent,
                    id: `c${classIdCounter++}`,
                    startTime: nextTime.start,
                    endTime: nextTime.end,
                });
            }
        }
    }
}

// Add some canceled/rescheduled classes for variety
if (generatedClasses.length > 10) {
    // find 3 random, non-consecutive classes to change status
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * (generatedClasses.length - 1));
        // Avoid changing consecutive classes to prevent weird states
        if (generatedClasses[randomIndex].title === generatedClasses[randomIndex + 1]?.title) {
            continue;
        }
        const newStatus = i % 2 === 0 ? ClassStatus.CANCELED : ClassStatus.RESCHEDULED;
        generatedClasses[randomIndex].status = newStatus;
    }
}


export const mockCalendarEvents: CalendarEvent[] = [
    ...existingEvents,
    ...generatedClasses,
];