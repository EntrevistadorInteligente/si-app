import { InterviewManager } from '@/modules/interview_manager/domain/model/interviewManager';

export interface InterviewManagerRepositoryPort {
  getById: (id: string) => Promise<InterviewManager>;
}