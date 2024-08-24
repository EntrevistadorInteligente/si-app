import { InterviewManagerRepositoryPort } from '@/modules/interview_manager/domain/port/interviewManagerRepositoryPort';
import { InterviewManager } from '@/modules/interview_manager/domain/model/interviewManager';

export const createInterviewManagerRepositoryAdapter = (): InterviewManagerRepositoryPort => {
  return {
    getById: async (id: string): Promise<InterviewManager> => {
      //TODO: Llamar a la API
      return { id: "1" };
    }
  }
}