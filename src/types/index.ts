/**
 * Core domain types for IPU Student Portal
 */

export type UserRole = "STUDENT" | "MODERATOR" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
}

export type ResourceType =
  "NOTES" | "PYQ" | "LAB_MANUAL" | "SYLLABUS" | "QUESTION_BANK" | "BOOK";

export interface AcademicResource {
  id: string;
  title: string;
  description?: string | null;
  courseId: string;
  semesterNumber: number;
  subjectId: string;
  unitNumber?: number | null;
  resourceType: ResourceType;
  fileUrl: string;
  fileSize?: number | null;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
