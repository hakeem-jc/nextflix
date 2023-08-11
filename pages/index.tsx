import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import useCurrentUser from '@/hooks/useCurrentUser';
import Billboard from '@/components/Billboard/Billboard';
import Head from 'next/head';

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
       <Head>
        <title>Nextflix</title>
        <meta property="og:title" content="Nextflix" key="title-home" />
        <meta property="og:description" content="Home page" key="home" />
        <meta property="og:author" content="Hakeem Clarke" key="author" />
      </Head>

     <Navbar />
     <Billboard />
    </>
  )
}

export default Home;
