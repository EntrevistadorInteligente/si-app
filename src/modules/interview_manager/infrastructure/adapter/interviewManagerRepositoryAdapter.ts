import { InterviewManagerRepositoryPort } from '@/modules/interview_manager/domain/port/interviewManagerRepositoryPort';
import { InterviewManager, Question } from '@/modules/interview_manager/domain/model/interviewManager';

export const createInterviewManagerRepositoryAdapter = (): InterviewManagerRepositoryPort => {
  return {
    getById: async (id: string): Promise<InterviewManager> => {
      // TODO: Implementar la lógica real para obtener una entrevista por ID
      return { id: "1", questions: [] };
    },
    getQuestionsByRole: async (role: string): Promise<Question[]> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_DEMO_PREGUNTAS}?rol=${role}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Question[] = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching questions: ', error);
        throw error;
      }
    }
  }
}