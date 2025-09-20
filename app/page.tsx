import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Home() {
  // 1. Fetch the session on the server
  const session = await auth();

  // 2. If no session, redirect to the login page
  if (!session?.user) {
    redirect('/login');
  }

  // 3. If a session exists, redirect based on the user's role
  // @ts-ignore
  switch (session.user.role) {
    case 'admin':
      redirect('/admin/dashboard');
      break;
    case 'agent':
      redirect('/agent/dashboard');
      break;
    default:
      // Fallback: if user has a session but no recognized role, send to login
      redirect('/login');
      break;
  }

  // This part will not be rendered because a redirect will always occur,
  // but it's good practice to have a return statement.
  return null;
}