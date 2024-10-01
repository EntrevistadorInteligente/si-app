export interface Question {
  idPregunta: string;
  pregunta: string;
}

export interface InterviewManager {
  id: string;
  questions: Question[];
}