import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Login from '@/app/auth/components/login';
import Logout from '@/app/auth/components/logout';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log("Session in Home page: ", session)

  if (session) {
    return (
      <div>
        <div>Your name is {session.user?.name}</div>
        <Link href={'/interview/manager'} className="animate-fade-up animate-ease-in-out">Interview Manager</Link>
        <div>
          <Logout/>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Login/>
    </div>
  )
}
