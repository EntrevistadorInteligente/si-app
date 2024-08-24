import { InterviewManagerRepositoryPort } from '@/modules/interview_manager/domain/port/interviewManagerRepositoryPort';
import { interviewManagerMock } from '@/modules/interview_manager/domain/model/__mocks__/interviewManagerMock';
import { InterviewManager } from '@/modules/interview_manager/domain/model/interviewManager';

export const createInterviewManagerRepositoryAdapterMock = (): InterviewManagerRepositoryPort => {
  return {
    getById: async (id: string): Promise<InterviewManager> => {
      return interviewManagerMock;
    }
  }
}