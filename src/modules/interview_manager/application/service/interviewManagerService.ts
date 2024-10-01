import { InterviewManagerRepositoryPort } from '@/modules/interview_manager/domain/port/interviewManagerRepositoryPort';
import { InterviewManager, Question } from '@/modules/interview_manager/domain/model/interviewManager';

export const createInterviewManagerService = (interviewManagerRepositoryPort: InterviewManagerRepositoryPort) => {
  return {
    getById: async (interviewId: string): Promise<InterviewManager> => {
      return interviewManagerRepositoryPort.getById(interviewId);
    },
    getQuestionsByRole: async (role: string): Promise<Question[]> => {
      return interviewManagerRepositoryPort.getQuestionsByRole(role);
    }
  }
}