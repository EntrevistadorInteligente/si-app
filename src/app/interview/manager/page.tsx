import {
  createInterviewManagerRepositoryAdapterMock
} from '@/modules/interview_manager/infrastructure/adapter/interviewManagerRepositoryAdapterMock';
import { createInterviewManagerService } from '@/modules/interview_manager/application/service/interviewManagerService';

const interviewManagerRepositoryPort = createInterviewManagerRepositoryAdapterMock();
const interviewManagerService        = createInterviewManagerService(interviewManagerRepositoryPort)

const InterviewManagerPage = async () => {
  const interview = await interviewManagerService.getById('1');

  return (
    <div>
      <h1 className='text-4xl'>Interview Id: {interview?.id}</h1>
    </div>
  );
};

export default InterviewManagerPage;