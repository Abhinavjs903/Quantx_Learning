/**
 * Service layer abstraction for academic resources and portal data
 */

import { ApiResponse } from "@/types";

export interface ServiceOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

/**
 * Base fetch wrapper with standard error handling
 */
export async function fetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          typeof errorData.message === "string"
            ? errorData.message
            : `HTTP error ${response.status}`,
      };
    }

    const data = (await response.json()) as T;
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
