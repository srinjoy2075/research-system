import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for request initialization
});

export interface ResearchResponse {
  search_results: string;
  scraped_content: string;
  report: string;
  feedback: string;
}

/**
 * Start the research pipeline on the backend.
 * @param topic The research topic
 * @returns Object containing the task_id
 */
export const startResearch = async (topic: string): Promise<string> => {
  const response = await api.post<{ task_id: string }>('/api/research', { topic });
  return response.data.task_id;
};

/**
 * Returns the SSE stream URL for the research task.
 * @param taskId The task ID
 * @returns The full URL to stream events
 */
export const getStreamUrl = (taskId: string): string => {
  return `${API_BASE_URL}/api/research/stream/${taskId}`;
};
