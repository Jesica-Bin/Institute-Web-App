import { AttendanceStatus, CalendarEvent, CalendarEventType, SubjectDetail } from './types';
import { mockCalendarEvents } from './data';

// Structure: { "YYYY-MM-DD": { "Subject Name": { studentId: status } } }
type AttendanceStoreData = {
  [date: string]: {
    [subject: string]: {
      [studentId: number]: AttendanceStatus;
    }
  }
};

// Structure: { "YYYY-MM-DD": { "Subject Name": { studentId: reason } } }
type LateReasonStoreData = {
  [date: string]: {
    [subject: string]: {
      [studentId: number]: string;
    }
  }
};

// Structure: { "YYYY-MM-DD": { "Subject Name": true } }
type ClosedRegisterStoreData = {
    [date: string]: {
        [subject: string]: boolean;
    }
}

// Structure: { "YYYY-MM-DD": { "Subject Name": { studentId: true } } }
type NotifiedAbsencesStoreData = {
    [date: string]: {
        [subject: string]: {
            [studentId: number]: boolean;
        }
    }
}

const attendanceStore: AttendanceStoreData = {};
const lateReasonsStore: LateReasonStoreData = {};
const closedRegistersStore: ClosedRegisterStoreData = {};
const notifiedAbsencesStore: NotifiedAbsencesStoreData = {};


const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- School Year Configuration ---
type SchoolYearConfig = {
  startDate: string | null;
  endDate: string | null;
  winterBreakStartDate: string | null;
  winterBreakEndDate: string | null;
};

// In a real app, this would be persisted (e.g., localStorage or a backend)
const schoolYearConfig: SchoolYearConfig = {
  startDate: null,
  endDate: null,
  winterBreakStartDate: null,
  winterBreakEndDate: null,
};

export const setSchoolYear = (startDate: string, endDate: string, winterBreakStart?: string, winterBreakEnd?: string) => {
  schoolYearConfig.startDate = startDate;
  schoolYearConfig.endDate = endDate;
  schoolYearConfig.winterBreakStartDate = winterBreakStart || null;
  schoolYearConfig.winterBreakEndDate = winterBreakEnd || null;
};

export const getSchoolYear = (): SchoolYearConfig => {
  return schoolYearConfig;
};

// --- National Holiday Fetching & Caching ---
const nationalHolidaysCache: { [year: number]: CalendarEvent[] } = {};

export const fetchNationalHolidays = async (year: number): Promise<CalendarEvent[]> => {
    if (nationalHolidaysCache[year]) {
        return nationalHolidaysCache[year];
    }
    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/AR`);
        if (!response.ok) {
            console.error('Failed to fetch national holidays');
            return [];
        }
        const data: { date: string; localName: string; }[] = await response.json();
        
        const holidays: CalendarEvent[] = data.map((holiday, index) => ({
            id: `holiday-${year}-${index}`,
            date: holiday.date, // API provides "YYYY-MM-DD"
            type: CalendarEventType.HOLIDAY,
            title: holiday.localName,
            description: 'Feriado Nacional',
        }));
        
        nationalHolidaysCache[year] = holidays;
        return holidays;
    } catch (error) {
        console.error('Error fetching national holidays:', error);
        return [];
    }
};

// --- Attendance Calculation Logic ---
export const calculateTotalClassesForSubject = (
    subject: SubjectDetail, 
    startDate: string, 
    endDate: string
): { totalClasses: number, maxAbsences: number } => {
    const scheduleLines = subject.schedule.split('\n');
    const dayMap: { [key: string]: number } = { 'Dom': 0, 'Lun': 1, 'Mar': 2, 'Mie': 3, 'Jue': 4, 'Vie': 5, 'Sáb': 6 };
    
    const classDaysOfWeek = scheduleLines
        .map(line => line.substring(0, 3))
        .filter(dayStr => dayMap[dayStr] !== undefined)
        .map(dayStr => dayMap[dayStr]);

    if (classDaysOfWeek.length === 0) {
        return { totalClasses: subject.totalClasses || 0, maxAbsences: subject.maxAbsences || 0 };
    }

    let totalClasses = 0;
    let currentDate = new Date(startDate + 'T00:00:00');
    const finalDate = new Date(endDate + 'T00:00:00');
    const { winterBreakStartDate, winterBreakEndDate } = getSchoolYear();
    
    const winterBreakStart = winterBreakStartDate ? new Date(winterBreakStartDate + 'T00:00:00') : null;
    const winterBreakEnd = winterBreakEndDate ? new Date(winterBreakEndDate + 'T00:00:00') : null;

    const holidays = new Set(
        mockCalendarEvents
            .filter(e => e.type === CalendarEventType.HOLIDAY || e.type === CalendarEventType.INSTITUTIONAL)
            .map(e => e.date)
    );
    
    // Add fetched national holidays to the set
    const year = new Date(startDate).getFullYear();
    (nationalHolidaysCache[year] || []).forEach(h => holidays.add(h.date));


    while (currentDate <= finalDate) {
        const dayOfWeek = currentDate.getDay();
        const dateString = currentDate.toISOString().split('T')[0];
        
        const isWinterBreak = winterBreakStart && winterBreakEnd && currentDate >= winterBreakStart && currentDate <= winterBreakEnd;

        if (!holidays.has(dateString) && !isWinterBreak) {
            const classesOnThisDay = classDaysOfWeek.filter(d => d === dayOfWeek).length;
            totalClasses += classesOnThisDay;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const maxAbsences = Math.floor(totalClasses * 0.25);
    return { totalClasses, maxAbsences };
};


// --- Attendance ---
export const getAttendanceForSubject = (date: string, subject: string): { [studentId: number]: AttendanceStatus } | undefined => {
  return attendanceStore[date]?.[subject];
};

export const setAttendanceForSubject = (date: string, subject: string, studentStatuses: { [studentId: number]: AttendanceStatus }) => {
  if (!attendanceStore[date]) {
    attendanceStore[date] = {};
  }
  attendanceStore[date][subject] = {
      ...(attendanceStore[date][subject] || {}),
      ...studentStatuses
  };
};

export const getTodayAttendanceForSubject = (subject: string): { [studentId: number]: AttendanceStatus } | undefined => {
    const today = getTodayDateString();
    return getAttendanceForSubject(today, subject);
};

export const setTodayAttendanceForSubject = (subject: string, studentStatuses: { [studentId: number]: AttendanceStatus }) => {
    const today = getTodayDateString();
    setAttendanceForSubject(today, subject, studentStatuses);
};

// --- Late Reasons ---
export const getLateReasonsForSubject = (date: string, subject: string): { [studentId: number]: string } | undefined => {
    return lateReasonsStore[date]?.[subject];
};

export const setLateReasonForStudent = (date: string, subject: string, studentId: number, reason: string) => {
    if (!lateReasonsStore[date]) {
        lateReasonsStore[date] = {};
    }
    if (!lateReasonsStore[date][subject]) {
        lateReasonsStore[date][subject] = {};
    }
    lateReasonsStore[date][subject][studentId] = reason;
};

export const deleteLateReasonForStudent = (date: string, subject: string, studentId: number) => {
    if (lateReasonsStore[date]?.[subject]) {
        delete lateReasonsStore[date][subject][studentId];
    }
};

export const getTodayLateReasonsForSubject = (subject: string): { [studentId: number]: string } | undefined => {
    const today = getTodayDateString();
    return getLateReasonsForSubject(today, subject);
};

export const setTodayLateReasonForStudent = (subject: string, studentId: number, reason: string) => {
    const today = getTodayDateString();
    setLateReasonForStudent(today, subject, studentId, reason);
};

export const deleteTodayLateReasonForStudent = (subject: string, studentId: number) => {
    const today = getTodayDateString();
    deleteLateReasonForStudent(today, subject, studentId);
};


// --- Closed Registers ---
export const isRegisterClosed = (date: string, subject: string): boolean => {
    return !!closedRegistersStore[date]?.[subject];
};

export const setRegisterAsClosed = (date: string, subject: string) => {
    if (!closedRegistersStore[date]) {
        closedRegistersStore[date] = {};
    }
    closedRegistersStore[date][subject] = true;
};

export const setTodayRegisterAsClosed = (subject: string) => {
    const today = getTodayDateString();
    setRegisterAsClosed(today, subject);
};

// --- Absence Notifications ---
export const notifyAbsentStudents = (date: string, subject: string, studentIds: number[]) => {
    if (!notifiedAbsencesStore[date]) {
        notifiedAbsencesStore[date] = {};
    }
    if (!notifiedAbsencesStore[date][subject]) {
        notifiedAbsencesStore[date][subject] = {};
    }
    studentIds.forEach(id => {
        notifiedAbsencesStore[date][subject][id] = true;
    });
};

export const getNotifiedAbsencesForStudent = (date: string, studentId: number): string[] => {
    const subjects: string[] = [];
    if (notifiedAbsencesStore[date]) {
        for (const subject in notifiedAbsencesStore[date]) {
            if (notifiedAbsencesStore[date][subject][studentId]) {
                subjects.push(subject);
            }
        }
    }
    return subjects;
};

export const clearStudentNotification = (date: string, subject: string, studentId: number) => {
    if (notifiedAbsencesStore[date]?.[subject]) {
        delete notifiedAbsencesStore[date][subject][studentId];
    }
};


// --- Full Store Access for Reports ---
export const getFullAttendanceStore = (): AttendanceStoreData => {
    return attendanceStore;
}