// Fix: Removed self-import from './types' which was causing declaration conflicts.

// Fix: Creating types file with necessary enums and interfaces.
export enum AttendanceStatus {
  UNMARKED = 'UNMARKED',
  PRESENT = 'P',
  ABSENT = 'A',
  LATE = 'T',
}

export interface Student {
  id: number;
  name: string;
  lastName: string;
  legajo: string;
  email: string;
  phone: string;
  carrera: string;
}

export interface StudentAttendance extends Student {
  status: AttendanceStatus;
}

export interface LateStudent {
  id: number;
  name: string;
  lastName: string;
  reason: string;
}

export enum RequestStatus {
  PENDING = 'Pendiente',
  IN_PROGRESS = 'En Progreso',
  COMPLETED = 'Completada',
}

export interface StudentRequest {
  id: number;
  title: string;
  studentName: string;
  date: string;
  status: RequestStatus;
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  OFFICIAL = 'OFFICIAL',
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  imageUrl?: string;
}

export interface AgendaItem {
  id: number;
  time: string;
  subject: string;
  course: string;
}

// Student-specific types
export interface StudentUser {
  name: string;
  email: string;
  dni: string;
  dob: string;
  phone: string;
}

export interface StudentSubject {
  id: string;
  name: string;
  schedule: string;
  professor: string;
  status: 'cursando' | 'terminada';
  average?: number;
}

export interface Grade {
    type: 'Parcial 1' | 'Parcial 2' | 'Final';
    score: number | null;
}

export interface DetailedGrade {
    name: string;
    score: number | null;
}

export interface TermGrades {
    termName: string;
    isCollapsible: boolean;
    grades: DetailedGrade[];
    mainScore: number | null;
}


export interface SubjectDetail extends StudentSubject {
    description: string;
    programUrl: string;
    grades: Grade[];
    detailedGrades?: TermGrades[];
    totalClasses?: number;
    maxAbsences?: number;
    absences?: number;
    presents?: number;
    justified?: number;
}

export enum StudentAttendanceStatus {
  PRESENT = 'Presente',
  ABSENT = 'Ausente',
  JUSTIFIED = 'Justificado',
}

export interface StudentAttendanceRecord {
  id: number;
  date: string;
  subject: string;
  status: StudentAttendanceStatus;
}

export enum EventStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
}

export enum EventAttendanceStatus {
  ATTENDED = 'Presente',
  ABSENT = 'Ausente',
  JUSTIFIED = 'Justificado',
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  status: EventStatus;
  qrCodeData: string; // The data the QR code should contain
  latitude: number;
  longitude: number;
  attendanceStatus?: EventAttendanceStatus;
}

export enum CertificateStatus {
  PENDING = 'Pendiente',
  READY = 'Listo para retirar',
  DELIVERED = 'Entregado',
}

export interface CertificateRequest {
  id: number;
  type: string;
  requestDate: string;
  status: CertificateStatus;
  expiryDate?: string;
}

export enum SuggestionStatus {
    SENT = 'Enviado',
    IN_REVIEW = 'En revisión',
    ANSWERED = 'Respondido',
}

export interface Suggestion {
    id: number;
    type: 'Sugerencia' | 'Reclamo';
    title: string;
    message: string;
    date: string;
    status: SuggestionStatus;
    response?: string;
}

export enum JustificationStatus {
    PENDING = 'En revisión',
    APPROVED = 'Aprobado',
    REJECTED = 'Rechazado'
}

export interface AbsenceToJustify {
    id: number;
    date: string;
    subject: string;
    status: JustificationStatus;
    rejectionReason?: string;
}

// School Calendar Types
export enum CalendarEventType {
    CLASS = 'CLASS',
    HOLIDAY = 'HOLIDAY',
    INSTITUTIONAL = 'INSTITUTIONAL',
    EXAM = 'EXAM',
    MEETING = 'MEETING',
    FIELD_TRIP = 'FIELD_TRIP',
}

export enum ClassStatus {
    NORMAL = 'NORMAL',
    CANCELED = 'CANCELED',
    RESCHEDULED = 'RESCHEDULED',
    DICTATED = 'DICTATED',
    PENDING = 'PENDING',
}

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    type: CalendarEventType;
    title: string;
    description?: string;
    status?: ClassStatus;
    startTime?: string; // HH:MM
    endTime?: string; // HH:MM
    course?: string;
    professor?: string;
    classroom?: string;
    attendanceTaken?: boolean;
    originalDate?: string; // YYYY-MM-DD
    originalStartTime?: string; // HH:MM
    originalEndTime?: string; // HH:MM
    isSwapped?: boolean;
}