import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import useCurrentUser from '@/hooks/useCurrentUser';
import Billboard from '@/components/Billboard/Billboard';

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
     <Navbar />
     <Billboard />
    </>
  )
}

export default Home;
