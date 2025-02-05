import axios from '../utils/api';  // Using configured axios instance

export const postQuestion = async (payload: any) => {
  try {
    const response = await axios.post('/questions', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPendingQuestions = async (questionIds: string[]) => {
  try {
    const response = await axios.get(`/questions/pending?questionIds=${questionIds.join(',')}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};