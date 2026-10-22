import {
  MOCK_USERS,
  MOCK_PROGRESS_ELIGIBLE,
  MOCK_PROGRESS_NOT_ELIGIBLE,
  MOCK_STUDENT_RESULTS,
  MOCK_ADVISER_STUDENTS,
  MOCK_ADMIN_STATS,
  MOCK_COURSES,
  MOCK_SESSIONS,
  MOCK_REQUIREMENTS,
  MOCK_AUDIT_LOGS,
} from "./mock-data";
import { ApiErrorShape, User, Course, AcademicSession, Requirements } from "./types";

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
const API_BASE_URL = rawBaseUrl.endsWith("/api/v1")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, "")}/api/v1`;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

// In-memory mock storage state for interactive editing in mock mode
const mockState = {
  currentUser: null as User | null,
  courses: [...MOCK_COURSES] as Course[],
  sessions: [...MOCK_SESSIONS] as AcademicSession[],
  requirements: { ...MOCK_REQUIREMENTS } as Requirements,
  students: [...MOCK_ADVISER_STUDENTS],
};

// Initialize default mock user if none set
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("mock_current_user");
  if (savedUser) {
    try {
      mockState.currentUser = JSON.parse(savedUser);
    } catch {
      // fallback to null
    }
  }
}

async function handleMockRequest<T>(
  method: string,
  endpoint: string,
  body?: any
): Promise<T> {
  // Simulate natural network latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const cleanEndpoint = endpoint.split("?")[0];
  const searchParams = new URLSearchParams(endpoint.includes("?") ? endpoint.split("?")[1] : "");

  // Auth Endpoints
  if (cleanEndpoint === "/auth/login" && method === "POST") {
    const { email, password } = body || {};
    const found = Object.values(MOCK_USERS).find(
      (u) => u.email.toLowerCase() === (email || "").toLowerCase()
    );
    if (!found || found.password !== password) {
      throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }
    const { password: _, ...userSafe } = found;
    mockState.currentUser = userSafe;
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_current_user", JSON.stringify(userSafe));
      document.cookie = "access_token=mock_jwt_token; path=/; max-age=86400; SameSite=Lax";
    }
    return { user: userSafe } as T;
  }

  if (cleanEndpoint === "/auth/logout" && method === "POST") {
    mockState.currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_current_user");
      document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
    }
    return { success: true } as T;
  }

  if (cleanEndpoint === "/auth/me" && method === "GET") {
    if (!mockState.currentUser) {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("mock_current_user");
        if (saved) {
          mockState.currentUser = JSON.parse(saved);
        }
      }
    }
    if (!mockState.currentUser) {
      throw new ApiError(401, "UNAUTHORIZED", "Not authenticated");
    }
    return { user: mockState.currentUser } as T;
  }

  if (cleanEndpoint === "/auth/change-password" && method === "POST") {
    const { currentPassword, newPassword } = body || {};
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "VALIDATION_ERROR", "Current and new password are required");
    }
    return { message: "Password updated successfully" } as T;
  }

  // Student Endpoints
  if (cleanEndpoint === "/me/progress" && method === "GET") {
    const user = mockState.currentUser;
    if (user?.matricNumber === "CSC/2020/002") {
      return MOCK_PROGRESS_NOT_ELIGIBLE as T;
    }
    return MOCK_PROGRESS_ELIGIBLE as T;
  }

  if (cleanEndpoint === "/me/results" && method === "GET") {
    return MOCK_STUDENT_RESULTS as T;
  }

  // Adviser Endpoints
  if (cleanEndpoint === "/adviser/students" && method === "GET") {
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "";
    const levelStr = searchParams.get("level") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    let filtered = mockState.students.filter((s) => {
      const matchSearch =
        !search ||
        s.fullName.toLowerCase().includes(search) ||
        s.matricNumber.toLowerCase().includes(search);
      const matchStatus = !status || s.status === status;
      const matchLevel = !levelStr || s.level.toString() === levelStr;
      return matchSearch && matchStatus && matchLevel;
    });

    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      items: paginated,
      page,
      pageSize,
      total: filtered.length,
    } as T;
  }

  const studentProgressMatch = cleanEndpoint.match(/^\/adviser\/students\/([^/]+)\/progress$/);
  if (studentProgressMatch && method === "GET") {
    const studentId = studentProgressMatch[1];
    if (studentId === "user-std-2" || studentId === "user-std-4" || studentId === "user-std-5") {
      return MOCK_PROGRESS_NOT_ELIGIBLE as T;
    }
    return MOCK_PROGRESS_ELIGIBLE as T;
  }

  const studentResultsMatch = cleanEndpoint.match(/^\/adviser\/students\/([^/]+)\/results$/);
  if (studentResultsMatch && method === "GET") {
    return MOCK_STUDENT_RESULTS as T;
  }

  // Admin Endpoints
  if (cleanEndpoint === "/admin/stats" && method === "GET") {
    return MOCK_ADMIN_STATS as T;
  }

  if (cleanEndpoint === "/admin/users" && method === "GET") {
    const role = searchParams.get("role");
    const search = searchParams.get("search")?.toLowerCase() || "";
    let users = Object.values(MOCK_USERS).map(({ password: _, ...u }) => u);
    if (role) {
      users = users.filter((u) => u.role === role);
    }
    if (search) {
      users = users.filter((u) => u.fullName.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    }
    return { items: users, total: users.length } as T;
  }

  if (cleanEndpoint === "/admin/users" && method === "POST") {
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      fullName: body.fullName,
      role: body.role || (body.matricNumber ? "STUDENT" : "ADVISER"),
      matricNumber: body.matricNumber,
      level: body.level,
      entryYear: body.entryYear,
      entryMode: body.entryMode,
      department: "Computer Science",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    return newUser as T;
  }

  if (cleanEndpoint.startsWith("/admin/users/") && cleanEndpoint.endsWith("/reset-password") && method === "POST") {
    return { message: "Password reset instructions generated" } as T;
  }

  if (cleanEndpoint.startsWith("/admin/users/") && cleanEndpoint.endsWith("/deactivate") && method === "PATCH") {
    return { message: "User account deactivated" } as T;
  }

  if (cleanEndpoint.startsWith("/admin/users/") && method === "PATCH") {
    return { message: "User account updated successfully" } as T;
  }

  if (cleanEndpoint.startsWith("/admin/students/") && cleanEndpoint.endsWith("/adviser") && method === "POST") {
    return { message: "Adviser successfully assigned to student" } as T;
  }

  // Courses
  if (cleanEndpoint === "/admin/courses") {
    if (method === "GET") {
      return mockState.courses as T;
    }
    if (method === "POST") {
      const newCourse: Course = {
        id: `crs-${Date.now()}`,
        code: body.code,
        title: body.title,
        units: Number(body.units),
        level: Number(body.level),
        semester: Number(body.semester) as 1 | 2,
        isCompulsory: Boolean(body.isCompulsory),
      };
      mockState.courses.unshift(newCourse);
      return newCourse as T;
    }
  }

  const courseIdMatch = cleanEndpoint.match(/^\/admin\/courses\/([^/]+)$/);
  if (courseIdMatch) {
    const id = courseIdMatch[1];
    if (method === "PATCH") {
      const idx = mockState.courses.findIndex((c) => c.id === id);
      if (idx !== -1) {
        mockState.courses[idx] = { ...mockState.courses[idx], ...body };
        return mockState.courses[idx] as T;
      }
    }
    if (method === "DELETE") {
      mockState.courses = mockState.courses.filter((c) => c.id !== id);
      return { success: true } as T;
    }
  }

  // Sessions
  if (cleanEndpoint === "/admin/sessions") {
    if (method === "GET") {
      return mockState.sessions as T;
    }
    if (method === "POST") {
      const newSession: AcademicSession = {
        id: `ses-${Date.now()}`,
        name: body.name,
        startYear: Number(body.startYear),
        endYear: Number(body.endYear),
      };
      mockState.sessions.unshift(newSession);
      return newSession as T;
    }
  }

  // Requirements
  if (cleanEndpoint === "/admin/requirements") {
    if (method === "GET") {
      return mockState.requirements as T;
    }
    if (method === "PUT") {
      mockState.requirements = { ...mockState.requirements, ...body };
      return mockState.requirements as T;
    }
  }

  // Results
  if (cleanEndpoint === "/admin/results") {
    if (method === "GET") {
      return MOCK_STUDENT_RESULTS.sessions[0].semesters[0].results as T;
    }
    if (method === "POST") {
      return { id: `res-${Date.now()}`, ...body, passed: body.score >= 40 } as T;
    }
  }

  if (cleanEndpoint === "/admin/results/import" && method === "POST") {
    return {
      imported: 24,
      skipped: 2,
      errors: [
        { row: 7, message: "Course CMP 999 does not exist in curriculum" },
        { row: 15, message: "Invalid score 115 (must be 0-100)" },
      ],
    } as T;
  }

  // Audit Logs
  if (cleanEndpoint === "/admin/audit-logs" && method === "GET") {
    return {
      items: MOCK_AUDIT_LOGS,
      page: 1,
      pageSize: 10,
      total: MOCK_AUDIT_LOGS.length,
    } as T;
  }

  throw new ApiError(404, "NOT_FOUND", `Endpoint ${method} ${cleanEndpoint} not found`);
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  if (USE_MOCKS) {
    try {
      const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!res.ok) {
        let errData: ApiErrorShape | null = null;
        try {
          errData = await res.json();
        } catch {
          // ignore json parse error
        }
        throw new ApiError(
          res.status,
          errData?.error?.code || `HTTP_${res.status}`,
          errData?.error?.message || res.statusText || "Request failed",
          errData?.error?.details
        );
      }

      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      // If network unreachable or backend not running yet, fallback seamlessly to mock handlers
      const method = options.method || "GET";
      let parsedBody: any = undefined;
      if (options.body && typeof options.body === "string") {
        try {
          parsedBody = JSON.parse(options.body);
        } catch {
          parsedBody = options.body;
        }
      }
      return handleMockRequest<T>(method, endpoint, parsedBody);
    }
  }

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    let errData: ApiErrorShape | null = null;
    try {
      errData = await res.json();
    } catch {
      // ignore json parse error
    }
    throw new ApiError(
      res.status,
      errData?.error?.code || `HTTP_${res.status}`,
      errData?.error?.message || res.statusText || "Request failed",
      errData?.error?.details
    );
  }

  return (await res.json()) as T;
}

export const api = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }).then((res: any) => {
      if (typeof window !== "undefined") {
        if (endpoint.includes("/auth/login") && res?.token) {
          localStorage.setItem("access_token", res.token);
        }
        if (endpoint.includes("/auth/logout")) {
          localStorage.removeItem("access_token");
        }
      }
      return res;
    });
  },

  patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, { ...options, method: "DELETE" });
  },

  upload<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    return fetchWithAuth<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
    });
  },
};
