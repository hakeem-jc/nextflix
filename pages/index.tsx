import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import useCurrentUser from '@/hooks/useCurrentUser';


export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Home = () => {
  const { data: user} = useCurrentUser();

  return (
    <>
      <p className='text-4xl'>Logged in as : {user?.email}</p>
      <div onClick={() => signOut()} className="px-3 text-center text-white text-sm hover:underline">
        Sign out of Netflix
      </div>
    </>
  )
}

export default Home;
