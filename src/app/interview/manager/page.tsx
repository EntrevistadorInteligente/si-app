import {
  createEntrevistaRepositoryAdapterMock
} from '@/modules/interview_manager/infrastructure/adapter/interviewRepositoryAdapterMock';
import { createInterviewService } from '@/modules/interview_manager/application/service/interviewService';

const interviewRepositoryPort = createEntrevistaRepositoryAdapterMock();
const interviewService        = createInterviewService(interviewRepositoryPort)

const InterviewPage = async () => {
  const interview = await interviewService.getById('1');

  return (
    <div>
      <h1 className='text-4xl'>Interview Id: {interview?.id}</h1>
    </div>
  );
};

export default InterviewPage;