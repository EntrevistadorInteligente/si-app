import { InterviewRepositoryPort } from '@/modules/interview/domain/port/interviewRepositoryPort';
import { interviewMock } from '@/modules/interview/domain/model/__mocks__/interviewMock';
import { Interview } from '@/modules/interview/domain/model/interview';

export const createEntrevistaRepositoryAdapterMock = (): InterviewRepositoryPort => {
  return {
    getById: async (id: string): Promise<Interview> => {
      return interviewMock;
    }
  }
}