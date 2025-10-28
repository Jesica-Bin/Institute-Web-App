// This file simulates a connection to a database.
// In a real-world scenario, this would be part of a backend API,
// but for client-side demonstration, we simulate async calls here.

import * as data from './data';
import { Student, StudentRequest, Notification, AgendaItem, StudentUser, TeacherUser, DirectorUser, StudentSubject, SubjectDetail, StudentAttendanceRecord, Event, CertificateRequest, Suggestion, AbsenceToJustify, CalendarEvent, TeacherSubject, TeacherSubjectDetail, ManagedUser, AuditLog, ForumThread, Resource, Reservation, ClassLog } from './types';

const SIMULATED_DELAY = 300; // ms

function simulateFetch<T>(mockData: T): Promise<T> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockData)));
        }, SIMULATED_DELAY);
    });
}

// --- User Fetches ---
export const fetchUser = (): Promise<typeof data.mockUser> => simulateFetch(data.mockUser);
export const fetchStudentUser = (): Promise<StudentUser> => simulateFetch(data.mockStudentUser);
export const fetchTeacherUser = (): Promise<TeacherUser> => simulateFetch(data.mockTeacherUser);
export const fetchDirectorUser = (): Promise<DirectorUser> => simulateFetch(data.mockDirectorUser);

// --- Preceptor Fetches ---
export const fetchStudents = (): Promise<Student[]> => simulateFetch(data.mockStudents);
export const fetchAgenda = (): Promise<AgendaItem[]> => simulateFetch(data.mockAgenda);
export const fetchAllNotifications = (): Promise<Notification[]> => simulateFetch(data.mockAllNotifications);
export const fetchSystemNotifications = (): Promise<Notification[]> => simulateFetch(data.mockSystemNotifications);
export const fetchOfficialCommunications = (): Promise<Notification[]> => simulateFetch(data.mockOfficialCommunications);
export const fetchRequests = (): Promise<StudentRequest[]> => simulateFetch(data.mockRequests);
export const fetchCareers = (): Promise<string[]> => simulateFetch(data.mockCareers);
export const fetchYears = (): Promise<string[]> => simulateFetch(data.mockYears);
export const fetchCourseData = (): Promise<typeof data.courseData> => simulateFetch(data.courseData);
export const fetchProfessors = (): Promise<typeof data.mockProfessors> => simulateFetch(data.mockProfessors);


// --- Student Fetches ---
export const fetchStudentSubjects = (): Promise<StudentSubject[]> => simulateFetch(data.mockStudentSubjects);
export const fetchSubjectDetails = (): Promise<Record<string, SubjectDetail>> => simulateFetch(data.mockSubjectDetails);
export const fetchStudentAttendanceRecords = (): Promise<StudentAttendanceRecord[]> => simulateFetch(data.mockStudentAttendanceRecords);
export const fetchEvents = (): Promise<Event[]> => simulateFetch(data.mockEvents);
export const fetchCertificateRequests = (): Promise<CertificateRequest[]> => simulateFetch(data.mockCertificateRequests);
export const fetchCertificateTypes = (): Promise<string[]> => simulateFetch(data.mockCertificateTypes);
export const fetchSuggestions = (): Promise<Suggestion[]> => simulateFetch(data.mockSuggestions);
export const fetchAbsencesToJustify = (): Promise<AbsenceToJustify[]> => simulateFetch(data.mockAbsencesToJustify);
export const fetchStudentWeeklySchedule = (): Promise<typeof data.mockStudentWeeklySchedule> => simulateFetch(data.mockStudentWeeklySchedule);

// --- Teacher Fetches ---
export const fetchTeacherSubjects = (): Promise<TeacherSubject[]> => simulateFetch(data.mockTeacherSubjects);
export const fetchTeacherSubjectDetails = (): Promise<Record<string, TeacherSubjectDetail>> => simulateFetch(data.mockTeacherSubjectDetails);
export const fetchForumThreads = (): Promise<ForumThread[]> => simulateFetch(data.mockForumThreads);
export const fetchResources = (): Promise<Resource[]> => simulateFetch(data.mockResources);
export const fetchReservations = (): Promise<Reservation[]> => simulateFetch(data.mockReservations);
export const fetchClassLogs = (): Promise<ClassLog[]> => simulateFetch(data.mockClassLogs);


// --- Director Fetches ---
export const fetchManagedUsers = (): Promise<ManagedUser[]> => simulateFetch(data.mockManagedUsers);
export const fetchAuditLogs = (): Promise<AuditLog[]> => simulateFetch(data.mockAuditLogs);
export const fetchStudentStatsByCareer = (): Promise<typeof data.mockStudentStatsByCareer> => simulateFetch(data.mockStudentStatsByCareer);
export const fetchDropoutData = (): Promise<typeof data.mockDropoutData> => simulateFetch(data.mockDropoutData);


// --- Shared ---
export const fetchCalendarEvents = (): Promise<CalendarEvent[]> => simulateFetch(data.mockCalendarEvents);