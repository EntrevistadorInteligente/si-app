import { InterviewRepositoryPort } from '@/modules/interview_manager/domain/port/interviewRepositoryPort';
import { interviewMock } from '@/modules/interview_manager/domain/model/__mocks__/interviewMock';
import { Interview } from '@/modules/interview_manager/domain/model/interview';

export const createEntrevistaRepositoryAdapterMock = (): InterviewRepositoryPort => {
  return {
    getById: async (id: string): Promise<Interview> => {
      return interviewMock;
    }
  }
}