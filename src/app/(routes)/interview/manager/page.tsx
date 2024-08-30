'use client';

import {
  createInterviewManagerRepositoryAdapterMock
} from '@/modules/interview_manager/infrastructure/adapter/interviewManagerRepositoryAdapterMock';
import { createInterviewManagerService } from '@/modules/interview_manager/application/service/interviewManagerService';
import { useEffect, useState } from 'react';
import { InterviewManager } from '@/modules/interview_manager/domain/model/interviewManager';
import Link from 'next/link';

const interviewRepositoryPort = createInterviewManagerRepositoryAdapterMock();
const interviewService        = createInterviewManagerService(interviewRepositoryPort)

const InterviewPage = () => {
  const [interview, setInterview] = useState<InterviewManager>()

  const loadInterview = async () => {
    const interview = await interviewService.getById('1');
    setInterview(interview);
  }

  useEffect(() => {
    loadInterview();
  }, []);

  return (
    <div>
      <h1 className='text-4xl'>Interview Id: {interview?.id}</h1>
      <Link href={'/'} className="animate-fade-up animate-ease-in-out">Home</Link>
    </div>
  );
};

export default InterviewPage;