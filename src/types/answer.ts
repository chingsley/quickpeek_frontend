import UserType from './user';

type AnswerType = {
  id: string;
  content: string;
  questionId: string;
  userId: string;
  createdAt: Date;
};

export default AnswerType;