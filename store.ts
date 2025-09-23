import { AttendanceStatus } from './types';

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