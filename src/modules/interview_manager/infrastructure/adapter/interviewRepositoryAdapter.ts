import { InterviewRepositoryPort } from '@/modules/interview_manager/domain/port/interviewRepositoryPort';
import { Interview } from '@/modules/interview_manager/domain/model/interview';

export const createEntrevistaRepositoryAdapter = (): InterviewRepositoryPort => {
  return {
    getById: async (id: string): Promise<Interview> => {
      //TODO: Llamar a la API
      return { id: "1" };
    }
  }
}