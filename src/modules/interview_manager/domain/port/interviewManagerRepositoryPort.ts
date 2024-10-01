import { InterviewManager, Question } from '../model/interviewManager';

export interface InterviewManagerRepositoryPort {
  getById: (id: string) => Promise<InterviewManager>;
  getQuestionsByRole: (role: string) => Promise<Question[]>;
}