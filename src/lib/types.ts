export type Role = "STUDENT" | "ADVISER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  matricNumber?: string;
  level?: number;
  entryYear?: number;
  entryMode?: "UTME" | "DIRECT_ENTRY";
  department?: string;
  adviserId?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export type Result = {
  id: string;
  course: {
    code: string;
    title: string;
    units: number;
    isCompulsory: boolean;
  };
  score: number;
  grade: "A" | "B" | "C" | "D" | "E" | "F";
  gradePoint: number;
  passed: boolean;
};

export type Check = {
  key: "TOTAL_UNITS" | "CGPA" | "COMPULSORY_COURSES";
  label: string;
  passed: boolean;
  required: number | string;
  actual: number | string;
  detail: string;
};

export type ProgressSummary = {
  student: {
    id: string;
    fullName: string;
    matricNumber: string;
    level: number;
    entryYear: number;
    entryMode: "UTME" | "DIRECT_ENTRY";
    department: string;
  };
  cgpa: number; // CPE / CCC, 2 decimal places, 0 if nothing registered
  classOfDegree: string | null; // class of degree the current CGPA points to, null if nothing attempted
  totalUnitsCarried: number; // CCC: units of every registration, failed attempts and re-sits included
  totalPointsEarned: number; // CPE
  totalUnitsEarned: number; // CCE: units of courses passed, each course counted once
  totalUnitsRequired: number;
  status: "ELIGIBLE" | "NOT_YET_ELIGIBLE";
  checks: Check[]; // always all three, in this order
  outstandingCompulsory: {
    code: string;
    title: string;
    units: number;
    reason: "NOT_TAKEN" | "FAILED";
  }[];
  carryovers: {
    code: string;
    title: string;
    units: number;
    lastScore: number;
  }[]; // failed courses not yet passed
  byLevel: {
    level: number;
    unitsCarried: number;
    unitsEarned: number;
    gpa: number;
  }[];
};

export type SemesterResults = {
  semester: 1 | 2;
  results: Result[];
  tcc: number; // Total Credit Units Carried
  tce: number; // Total Credit Units Earned
  tpe: number; // Total Points Earned
  gpa: number; // tpe / tcc
};

export type SessionResults = {
  session: {
    id: string;
    name: string;
  };
  semesters: SemesterResults[];
};

export type StudentResultsResponse = {
  sessions: SessionResults[];
};

export type StudentListItem = {
  studentId: string;
  fullName: string;
  matricNumber: string;
  level: number;
  cgpa: number;
  totalUnitsEarned: number;
  status: "ELIGIBLE" | "NOT_YET_ELIGIBLE";
};

export type AdviserStudentsResponse = {
  items: StudentListItem[];
  page: number;
  pageSize: number;
  total: number;
};

export type AdminStats = {
  totalStudents: number;
  byStatus: {
    ELIGIBLE: number;
    NOT_YET_ELIGIBLE: number;
  };
  averageCgpa: number;
  studentsWithCarryovers: number;
};

export type Course = {
  id: string;
  code: string;
  title: string;
  units: number;
  level: number;
  semester: 1 | 2;
  isCompulsory: boolean;
};

export type AcademicSession = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
};

export type GradeScaleRow = {
  minScore: number;
  grade: string;
  point: number;
};

export type DegreeClassRow = {
  minCgpa: number;
  label: string;
};

export type Requirements = {
  departmentId: string;
  minTotalUnits: {
    UTME: number;
    DIRECT_ENTRY: number;
  }; // 166 and 121
  minCgpa: number; // default 1.00
  passMark: number; // default 40
  gradeScale: GradeScaleRow[]; // default A70/5, B60/4, C50/3, D45/2, E40/1, F0/0
  maxOutstandingCompulsory: number; // default 0
  degreeClasses: DegreeClassRow[]; // First Class 4.50, Second Class Upper 3.50, etc.
};

export type AuditLog = {
  id: string;
  action: string;
  actorId?: string;
  actor?: {
    id: string;
    fullName: string;
    email: string;
    role?: string;
  } | null;
  performedBy?: {
    id: string;
    fullName: string;
    email: string;
    role?: string;
  } | null;
  entity?: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
  details?: string;
  createdAt?: string;
  timestamp?: string;
};

export type AuditLogsResponse = {
  items: AuditLog[];
  page: number;
  pageSize: number;
  total: number;
};

export type CsvImportResponse = {
  imported: number;
  skipped: number;
  errors: {
    row: number;
    message: string;
  }[];
};

export type ApiErrorShape = {
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message: string }> | unknown;
  };
};
