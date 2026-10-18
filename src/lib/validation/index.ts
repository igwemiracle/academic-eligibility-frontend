import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const studentUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid institutional email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  matricNumber: z.string().min(3, "Matric number is required (e.g., CSC/2020/001)"),
  level: z.coerce.number().int().min(100).max(500),
  entryYear: z.coerce.number().int().min(2000).max(2030),
  entryMode: z.enum(["UTME", "DIRECT_ENTRY"]),
});

export type StudentUserFormData = z.infer<typeof studentUserSchema>;

export const adviserUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid institutional email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdviserUserFormData = z.infer<typeof adviserUserSchema>;

export const courseSchema = z.object({
  code: z.string().min(3, "Course code is required (e.g. CMP 111)"),
  title: z.string().min(3, "Course title is required"),
  units: z.coerce.number().int().min(1, "Units must be at least 1").max(6, "Units cannot exceed 6"),
  level: z.coerce.number().int().min(100).max(500),
  semester: z.union([z.literal(1), z.literal(2)]),
  isCompulsory: z.boolean().default(true),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const sessionSchema = z.object({
  name: z.string().regex(/^\d{4}\/\d{4}$/, "Session name must be in format YYYY/YYYY (e.g. 2023/2024)"),
  startYear: z.coerce.number().int().min(2000).max(2050),
  endYear: z.coerce.number().int().min(2000).max(2050),
});

export type SessionFormData = z.infer<typeof sessionSchema>;

export const singleResultSchema = z.object({
  studentId: z.string().min(1, "Student is required"),
  courseId: z.string().min(1, "Course is required"),
  sessionId: z.string().min(1, "Session is required"),
  score: z.coerce.number().min(0, "Score cannot be negative").max(100, "Score cannot exceed 100"),
});

export type SingleResultFormData = z.infer<typeof singleResultSchema>;

export const editResultSchema = z.object({
  score: z.coerce.number().min(0, "Score cannot be negative").max(100, "Score cannot exceed 100"),
});

export type EditResultFormData = z.infer<typeof editResultSchema>;

export const assignAdviserSchema = z.object({
  adviserId: z.string().min(1, "Please select an adviser"),
});

export type AssignAdviserFormData = z.infer<typeof assignAdviserSchema>;

export const gradeScaleRowSchema = z.object({
  grade: z.string().min(1),
  minScore: z.coerce.number().min(0).max(100),
  point: z.coerce.number().min(0).max(5),
});

export const degreeClassRowSchema = z.object({
  label: z.string().min(1),
  minCgpa: z.coerce.number().min(0).max(5),
});

export const requirementsSchema = z.object({
  minTotalUnits: z.object({
    UTME: z.coerce.number().int().min(100),
    DIRECT_ENTRY: z.coerce.number().int().min(80),
  }),
  minCgpa: z.coerce.number().min(0).max(5),
  passMark: z.coerce.number().min(0).max(100),
  maxOutstandingCompulsory: z.coerce.number().int().min(0),
  gradeScale: z.array(gradeScaleRowSchema),
  degreeClasses: z.array(degreeClassRowSchema),
});

export type RequirementsFormData = z.infer<typeof requirementsSchema>;
