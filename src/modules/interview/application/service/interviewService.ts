import { InterviewRepositoryPort } from '@/modules/interview/domain/port/interviewRepositoryPort';

export const createInterviewService = (interviewRepositoryPort: InterviewRepositoryPort) => {
  return {
    async getById(interviewId: string) {
      return interviewRepositoryPort.getById(interviewId);
    }
  }
}