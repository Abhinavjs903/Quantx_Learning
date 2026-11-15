import { fetchJson } from "./index";
import type { ApiResponse, Topic } from "@/types";

/**
 * Service methods for Topic and Tagging Administration
 */

export async function fetchSubjectTopics(
  subjectId: string
): Promise<ApiResponse<Topic[]>> {
  return fetchJson<Topic[]>(`/api/admin/subjects/${subjectId}/topics`);
}

export async function createSubjectTopic(
  subjectId: string,
  name: string
): Promise<ApiResponse<Topic>> {
  return fetchJson<Topic>(`/api/admin/subjects/${subjectId}/topics`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateTopic(
  topicId: string,
  name: string
): Promise<ApiResponse<Topic>> {
  return fetchJson<Topic>(`/api/admin/topics/${topicId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function deleteTopic(
  topicId: string
): Promise<ApiResponse<{ message: string }>> {
  return fetchJson<{ message: string }>(`/api/admin/topics/${topicId}`, {
    method: "DELETE",
  });
}

export async function fetchPYQTags(
  pyqId: string
): Promise<ApiResponse<Topic[]>> {
  return fetchJson<Topic[]>(`/api/admin/pyqs/${pyqId}/tags`);
}

export async function updatePYQTags(
  pyqId: string,
  topicIds: string[]
): Promise<
  ApiResponse<{
    questionId: string;
    topics: Topic[];
    topicTags?: string | null;
  }>
> {
  return fetchJson<{
    questionId: string;
    topics: Topic[];
    topicTags?: string | null;
  }>(`/api/admin/pyqs/${pyqId}/tags`, {
    method: "POST",
    body: JSON.stringify({ topicIds }),
  });
}
