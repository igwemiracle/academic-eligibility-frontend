import {
  AdminStats,
  AcademicSession,
  Course,
  ProgressSummary,
  Requirements,
  StudentResultsResponse,
  User,
  AuditLog,
  StudentListItem,
} from "./types";

export const MOCK_USERS: Record<string, User & { password: string }> = {
  "student_a_eligible@cs.edu.ng": {
    id: "user-std-1",
    email: "student_a_eligible@cs.edu.ng",
    password: "Password123!",
    fullName: "Adebayo Olawale",
    role: "STUDENT",
    matricNumber: "CSC/2020/001",
    level: 400,
    entryYear: 2020,
    entryMode: "UTME",
    department: "Computer Science",
    adviserId: "user-adv-1",
    isActive: true,
  },
  "student_b_shortunits@cs.edu.ng": {
    id: "user-std-2",
    email: "student_b_shortunits@cs.edu.ng",
    password: "Password123!",
    fullName: "Chioma Okoli",
    role: "STUDENT",
    matricNumber: "CSC/2020/002",
    level: 400,
    entryYear: 2020,
    entryMode: "UTME",
    department: "Computer Science",
    adviserId: "user-adv-1",
    isActive: true,
  },
  "student_j_de_eligible@cs.edu.ng": {
    id: "user-std-3",
    email: "student_j_de_eligible@cs.edu.ng",
    password: "Password123!",
    fullName: "Lukman Gbadamosi",
    role: "STUDENT",
    matricNumber: "CSC/2021/DE01",
    level: 400,
    entryYear: 2021,
    entryMode: "DIRECT_ENTRY",
    department: "Computer Science",
    adviserId: "user-adv-1",
    isActive: true,
  },
  "adviser1@cs.edu.ng": {
    id: "user-adv-1",
    email: "adviser1@cs.edu.ng",
    password: "Password123!",
    fullName: "Dr. Ngozi Okonjo",
    role: "ADVISER",
    department: "Computer Science",
    isActive: true,
  },
  "admin@cs.edu.ng": {
    id: "user-adm-1",
    email: "admin@cs.edu.ng",
    password: "Password123!",
    fullName: "Dr. Ibrahim Musa",
    role: "ADMIN",
    department: "Computer Science",
    isActive: true,
  },
};

export const MOCK_SESSIONS: AcademicSession[] = [
  { id: "ses-1", name: "2020/2021", startYear: 2020, endYear: 2021 },
  { id: "ses-2", name: "2021/2022", startYear: 2021, endYear: 2022 },
  { id: "ses-3", name: "2022/2023", startYear: 2022, endYear: 2023 },
  { id: "ses-4", name: "2023/2024", startYear: 2023, endYear: 2024 },
];

export const MOCK_COURSES: Course[] = [
  { id: "crs-101", code: "CMP 111", title: "Introduction to Computer Science I", units: 3, level: 100, semester: 1, isCompulsory: true },
  { id: "crs-102", code: "MAT 111", title: "Elementary Mathematics I", units: 3, level: 100, semester: 1, isCompulsory: true },
  { id: "crs-103", code: "PHY 111", title: "General Physics I", units: 3, level: 100, semester: 1, isCompulsory: true },
  { id: "crs-104", code: "GST 111", title: "Communication in English I", units: 2, level: 100, semester: 1, isCompulsory: true },
  { id: "crs-105", code: "CMP 121", title: "Introduction to Computer Science II", units: 3, level: 100, semester: 2, isCompulsory: true },
  { id: "crs-106", code: "MAT 121", title: "Elementary Mathematics II", units: 3, level: 100, semester: 2, isCompulsory: true },
  { id: "crs-201", code: "CMP 211", title: "Data Structures and Algorithms", units: 3, level: 200, semester: 1, isCompulsory: true },
  { id: "crs-202", code: "CMP 212", title: "Computer Organization and Architecture", units: 3, level: 200, semester: 1, isCompulsory: true },
  { id: "crs-203", code: "CMP 221", title: "Object-Oriented Programming (Java)", units: 3, level: 200, semester: 2, isCompulsory: true },
  { id: "crs-204", code: "CMP 241", title: "Operating Systems I", units: 3, level: 200, semester: 2, isCompulsory: true },
  { id: "crs-301", code: "CMP 311", title: "Database Design and Management", units: 3, level: 300, semester: 1, isCompulsory: true },
  { id: "crs-302", code: "CMP 313", title: "Software Engineering Principles", units: 3, level: 300, semester: 1, isCompulsory: true },
  { id: "crs-303", code: "CMP 399", title: "Industrial Training (SIWES)", units: 6, level: 300, semester: 2, isCompulsory: true },
  { id: "crs-401", code: "CMP 411", title: "Artificial Intelligence", units: 3, level: 400, semester: 1, isCompulsory: true },
  { id: "crs-402", code: "CMP 413", title: "Computer Networks & Security", units: 3, level: 400, semester: 1, isCompulsory: true },
  { id: "crs-403", code: "CMP 499", title: "Final Year Project", units: 6, level: 400, semester: 2, isCompulsory: true },
];

export const MOCK_REQUIREMENTS: Requirements = {
  departmentId: "dept-cs-1",
  minTotalUnits: {
    UTME: 166,
    DIRECT_ENTRY: 121,
  },
  minCgpa: 1.0,
  passMark: 40,
  maxOutstandingCompulsory: 0,
  gradeScale: [
    { minScore: 70, grade: "A", point: 5 },
    { minScore: 60, grade: "B", point: 4 },
    { minScore: 50, grade: "C", point: 3 },
    { minScore: 45, grade: "D", point: 2 },
    { minScore: 40, grade: "E", point: 1 },
    { minScore: 0, grade: "F", point: 0 },
  ],
  degreeClasses: [
    { minCgpa: 4.5, label: "First Class Honours" },
    { minCgpa: 3.5, label: "Second Class Honours (Upper Division)" },
    { minCgpa: 2.4, label: "Second Class Honours (Lower Division)" },
    { minCgpa: 1.5, label: "Third Class Honours" },
    { minCgpa: 1.0, label: "Pass" },
  ],
};

export const MOCK_PROGRESS_ELIGIBLE: ProgressSummary = {
  student: {
    id: "user-std-1",
    fullName: "Adebayo Olawale",
    matricNumber: "CSC/2020/001",
    level: 400,
    entryYear: 2020,
    entryMode: "UTME",
    department: "Computer Science",
  },
  cgpa: 4.7,
  classOfDegree: "First Class Honours",
  totalUnitsCarried: 171,
  totalPointsEarned: 803.7,
  totalUnitsEarned: 171,
  totalUnitsRequired: 166,
  status: "ELIGIBLE",
  checks: [
    {
      key: "TOTAL_UNITS",
      label: "Total Credit Units Earned",
      passed: true,
      required: 166,
      actual: 171,
      detail: "You have earned 171 credit units, meeting the minimum graduation requirement of 166 units for UTME entry mode.",
    },
    {
      key: "CGPA",
      label: "Cumulative Grade Point Average (CGPA)",
      passed: true,
      required: 1.0,
      actual: 4.7,
      detail: "Your current CGPA is 4.70, satisfying the minimum academic threshold of 1.00.",
    },
    {
      key: "COMPULSORY_COURSES",
      label: "Compulsory Courses Status",
      passed: true,
      required: "0 outstanding",
      actual: "0 outstanding",
      detail: "All departmental and faculty compulsory courses have been successfully passed.",
    },
  ],
  outstandingCompulsory: [],
  carryovers: [],
  byLevel: [
    { level: 100, unitsCarried: 42, unitsEarned: 42, gpa: 4.8 },
    { level: 200, unitsCarried: 45, unitsEarned: 45, gpa: 4.65 },
    { level: 300, unitsCarried: 42, unitsEarned: 42, gpa: 4.72 },
    { level: 400, unitsCarried: 42, unitsEarned: 42, gpa: 4.63 },
  ],
};

export const MOCK_PROGRESS_NOT_ELIGIBLE: ProgressSummary = {
  student: {
    id: "user-std-2",
    fullName: "Chioma Okoli",
    matricNumber: "CSC/2020/002",
    level: 400,
    entryYear: 2020,
    entryMode: "UTME",
    department: "Computer Science",
  },
  cgpa: 3.42,
  classOfDegree: "Second Class Honours (Lower Division)",
  totalUnitsCarried: 164,
  totalPointsEarned: 560.88,
  totalUnitsEarned: 161,
  totalUnitsRequired: 166,
  status: "NOT_YET_ELIGIBLE",
  checks: [
    {
      key: "TOTAL_UNITS",
      label: "Total Credit Units Earned",
      passed: false,
      required: 166,
      actual: 161,
      detail: "You currently have 161 earned credit units. You require 5 more credit units to reach the minimum 166 units required for graduation.",
    },
    {
      key: "CGPA",
      label: "Cumulative Grade Point Average (CGPA)",
      passed: true,
      required: 1.0,
      actual: 3.42,
      detail: "Your CGPA of 3.42 meets the minimum graduation threshold of 1.00.",
    },
    {
      key: "COMPULSORY_COURSES",
      label: "Compulsory Courses Status",
      passed: false,
      required: "0 outstanding",
      actual: "1 outstanding",
      detail: "You have 1 compulsory course still outstanding that must be passed before graduation clearance.",
    },
  ],
  outstandingCompulsory: [
    { code: "CMP 499", title: "Final Year Project", units: 6, reason: "NOT_TAKEN" },
  ],
  carryovers: [
    { code: "CMP 241", title: "Operating Systems I", units: 3, lastScore: 34 },
  ],
  byLevel: [
    { level: 100, unitsCarried: 42, unitsEarned: 42, gpa: 3.8 },
    { level: 200, unitsCarried: 45, unitsEarned: 42, gpa: 3.2 },
    { level: 300, unitsCarried: 40, unitsEarned: 40, gpa: 3.5 },
    { level: 400, unitsCarried: 37, unitsEarned: 37, gpa: 3.3 },
  ],
};

export const MOCK_STUDENT_RESULTS: StudentResultsResponse = {
  sessions: [
    {
      session: { id: "ses-1", name: "2020/2021" },
      semesters: [
        {
          semester: 1,
          results: [
            { id: "res-1", course: { code: "CMP 111", title: "Introduction to Computer Science I", units: 3, isCompulsory: true }, score: 75, grade: "A", gradePoint: 5, passed: true },
            { id: "res-2", course: { code: "MAT 111", title: "Elementary Mathematics I", units: 3, isCompulsory: true }, score: 68, grade: "B", gradePoint: 4, passed: true },
            { id: "res-3", course: { code: "PHY 111", title: "General Physics I", units: 3, isCompulsory: true }, score: 62, grade: "B", gradePoint: 4, passed: true },
            { id: "res-4", course: { code: "GST 111", title: "Communication in English I", units: 2, isCompulsory: true }, score: 81, grade: "A", gradePoint: 5, passed: true },
          ],
          tcc: 11,
          tce: 11,
          tpe: 49,
          gpa: 4.45,
        },
        {
          semester: 2,
          results: [
            { id: "res-5", course: { code: "CMP 121", title: "Introduction to Computer Science II", units: 3, isCompulsory: true }, score: 72, grade: "A", gradePoint: 5, passed: true },
            { id: "res-6", course: { code: "MAT 121", title: "Elementary Mathematics II", units: 3, isCompulsory: true }, score: 64, grade: "B", gradePoint: 4, passed: true },
          ],
          tcc: 6,
          tce: 6,
          tpe: 27,
          gpa: 4.5,
        },
      ],
    },
    {
      session: { id: "ses-2", name: "2021/2022" },
      semesters: [
        {
          semester: 1,
          results: [
            { id: "res-7", course: { code: "CMP 211", title: "Data Structures and Algorithms", units: 3, isCompulsory: true }, score: 82, grade: "A", gradePoint: 5, passed: true },
            { id: "res-8", course: { code: "CMP 212", title: "Computer Organization and Architecture", units: 3, isCompulsory: true }, score: 70, grade: "A", gradePoint: 5, passed: true },
          ],
          tcc: 6,
          tce: 6,
          tpe: 30,
          gpa: 5.0,
        },
        {
          semester: 2,
          results: [
            { id: "res-9", course: { code: "CMP 221", title: "Object-Oriented Programming (Java)", units: 3, isCompulsory: true }, score: 78, grade: "A", gradePoint: 5, passed: true },
            { id: "res-10", course: { code: "CMP 241", title: "Operating Systems I", units: 3, isCompulsory: true }, score: 65, grade: "B", gradePoint: 4, passed: true },
          ],
          tcc: 6,
          tce: 6,
          tpe: 27,
          gpa: 4.5,
        },
      ],
    },
  ],
};

export const MOCK_ADVISER_STUDENTS: StudentListItem[] = [
  {
    studentId: "user-std-1",
    fullName: "Adebayo Olawale",
    matricNumber: "CSC/2020/001",
    level: 400,
    cgpa: 4.7,
    totalUnitsEarned: 171,
    status: "ELIGIBLE",
  },
  {
    studentId: "user-std-2",
    fullName: "Chioma Okoli",
    matricNumber: "CSC/2020/002",
    level: 400,
    cgpa: 3.42,
    totalUnitsEarned: 161,
    status: "NOT_YET_ELIGIBLE",
  },
  {
    studentId: "user-std-3",
    fullName: "Lukman Gbadamosi",
    matricNumber: "CSC/2021/DE01",
    level: 400,
    cgpa: 3.88,
    totalUnitsEarned: 122,
    status: "ELIGIBLE",
  },
  {
    studentId: "user-std-4",
    fullName: "Emeka Eze",
    matricNumber: "CSC/2020/003",
    level: 400,
    cgpa: 0.94,
    totalUnitsEarned: 95,
    status: "NOT_YET_ELIGIBLE",
  },
  {
    studentId: "user-std-5",
    fullName: "Grace Danjuma",
    matricNumber: "CSC/2020/005",
    level: 400,
    cgpa: 2.75,
    totalUnitsEarned: 158,
    status: "NOT_YET_ELIGIBLE",
  },
  {
    studentId: "user-std-6",
    fullName: "Hassan Bello",
    matricNumber: "CSC/2020/006",
    level: 400,
    cgpa: 3.65,
    totalUnitsEarned: 168,
    status: "ELIGIBLE",
  },
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalStudents: 148,
  byStatus: {
    ELIGIBLE: 94,
    NOT_YET_ELIGIBLE: 54,
  },
  averageCgpa: 3.28,
  studentsWithCarryovers: 21,
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    action: "UPDATE_REQUIREMENTS",
    performedBy: {
      id: "user-adm-1",
      fullName: "Dr. Ibrahim Musa",
      email: "admin@cs.edu.ng",
    },
    details: "Updated minimum credit units required for Direct Entry to 121 units.",
    timestamp: "2026-10-14T14:32:00Z",
  },
  {
    id: "log-2",
    action: "BATCH_IMPORT_RESULTS",
    performedBy: {
      id: "user-adm-1",
      fullName: "Dr. Ibrahim Musa",
      email: "admin@cs.edu.ng",
    },
    details: "Batch imported 42 semester results for session 2023/2024 via CSV.",
    timestamp: "2026-10-12T10:15:00Z",
  },
  {
    id: "log-3",
    action: "ASSIGN_ADVISER",
    performedBy: {
      id: "user-adm-1",
      fullName: "Dr. Ibrahim Musa",
      email: "admin@cs.edu.ng",
    },
    details: "Assigned Dr. Ngozi Okonjo as academic adviser to 18 Level 400 students.",
    timestamp: "2026-10-10T09:40:00Z",
  },
];
