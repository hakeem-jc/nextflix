import React from 'react';
import Head from 'next/head';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard/Billboard';
import MovieList from '@/components/MovieList/MovieList';
import InfoModal from '@/components/InfoModal';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import Loading from '@/components/Loading';
import useLoadingStore from '@/hooks/useLoadingStore';

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
  const { data: movies = [] } = useMovieList();
  const { data: favorites = [] } = useFavorites();
  const {isOpen, closeModal} = useInfoModalStore();
  const loading = useLoadingStore((state) => state.loading);

  return (
    <>
      {loading  && <Loading />}
      <Head>
        <title>Nextflix</title>
        <meta property="og:title" content="Nextflix" key="title-home" />
        <meta property="og:description" content="Home page" key="home" />
        <meta property="og:author" content="Hakeem Clarke" key="author" />
      </Head>

     <InfoModal visible={isOpen} onClose={closeModal} />
     <Navbar />
     <Billboard />
     <div className="pb-40">
        <MovieList title="Trending Now" data={movies} />
        <MovieList title="My List" data={favorites} />
      </div>
    </>
  )
}

export default Home;
