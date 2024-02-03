import React from 'react';
import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('../components/HomeContent'), { ssr: false });

const Home = () => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HomeContent />
    </main>
  );
}

export default Home;