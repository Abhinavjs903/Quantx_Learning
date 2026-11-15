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

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    questions: number;
  };
}

export interface QuestionTopic {
  id: string;
  questionId: string;
  topicId: string;
  topic?: Topic;
}

export interface SubjectSummary {
  id: string;
  name: string;
  code?: string | null;
  semesterId: string;
  semester?: {
    id: string;
    number: number;
    course?: {
      id: string;
      name: string;
      code?: string | null;
    };
  };
  _count?: {
    topics?: number;
    pyqs?: number;
  };
}

export type ExamType = "MID_SEM" | "END_SEM" | "PRACTICAL" | "OTHER";

export interface PYQQuestion {
  id: string;
  subjectId: string;
  subject?: SubjectSummary;
  year: number;
  examType: ExamType;
  fileUrl: string;
  topicTags?: string | null;
  topics?: (QuestionTopic & { topic: Topic })[];
  createdAt: Date | string;
}
