import { Interview } from '@/modules/interview/domain/model/interview';

export interface InterviewRepositoryPort {
  getById: (id: string) => Promise<Interview>;
}