import {
  createEntrevistaRepositoryAdapterMock
} from '@/modules/interview/infrastructure/adapter/interviewRepositoryAdapterMock';
import { createInterviewService } from '@/modules/interview/application/service/interviewService';

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