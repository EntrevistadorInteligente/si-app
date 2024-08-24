import { InterviewManagerRepositoryPort } from '@/modules/interview_manager/domain/port/interviewManagerRepositoryPort';

export const createInterviewManagerService = (interviewManagerRepositoryPort: InterviewManagerRepositoryPort) => {
  return {
    getById: async (interviewId: string) => {
      return interviewManagerRepositoryPort.getById(interviewId);
    }
  }
}