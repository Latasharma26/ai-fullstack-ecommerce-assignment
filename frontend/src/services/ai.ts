import apiClient from './api';

export interface ChatMessageResponse {
  response: string;
  tools_used: string[];
  metadata?: Record<string, unknown>;
}

export const sendChatMessage = async (
  message: string,
  sessionId?: string
): Promise<ChatMessageResponse> => {
  const response = await apiClient.post<ChatMessageResponse>('/api/v1/ai/chat', {
    message,
    session_id: sessionId,
  });
  return response.data;
};
