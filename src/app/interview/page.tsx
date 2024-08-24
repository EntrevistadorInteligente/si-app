'use client';

import {
  createEntrevistaRepositoryAdapterMock
} from '@/modules/interview/infrastructure/adapter/interviewRepositoryAdapterMock';
import { createInterviewService } from '@/modules/interview/application/service/interviewService';
import { getUser, signinRedirect, signoutRedirect } from '@/modules/auth/authService';
import { useEffect, useState } from 'react';
import { Interview } from '@/modules/interview/domain/model/interview';
import { User } from 'oidc-client-ts';

const interviewRepositoryPort = createEntrevistaRepositoryAdapterMock();
const interviewService        = createInterviewService(interviewRepositoryPort)

const InterviewPage = () => {
  const [interview, setInterview] = useState<Interview>()
  const [user, setUser]           = useState<User | null>()

  const loadInterview = async () => {
    const interview = await interviewService.getById('1');
    setInterview(interview);
  }

  const loadUser = async () => {
    const user = await getUser();
    setUser(user);
  }

  useEffect(() => {
    loadInterview();
    loadUser()
  }, []);

  return (
    <div>
      <h1 className='text-4xl'>Interview Id: {interview?.id}</h1>
      <button type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100
                 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800
                 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={signinRedirect}>
        Login
      </button>
      {user && (
        <button type="button"
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100
                 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800
                 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={signoutRedirect}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default InterviewPage;