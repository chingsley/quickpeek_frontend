import UserType from './user';

type QuestionType = {
  id: string;
  title: string;
  content: string;
  location: string;
  address: string;
  userId: string; // question creator id
  createdAt: Date;
};

export default QuestionType;