import axios from '../utils/api';

export const postAnswer = async (questionId: string, payload: { content: string; }) => {
  try {
    const response = await axios.post(`/${questionId}/answer`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};