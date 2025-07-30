'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pacifico } from 'next/font/google';
import Lottie from 'lottie-react';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // cookies → redirect
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const u = getCookie('user');
    const id = getCookie('userId');
    if (u && id) router.push('/notes');

    // respect reduced-motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) setShouldAnimate(false);

    // load lottie JSON from /public (served at site root)
    fetch('/animations/welcome.json') // ✅ remove "/public"
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setAnimationData(data))
      .catch((err) => {
        console.error('Failed to load Lottie JSON', err);
      });
  }, [router]);

  return (
    <main
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#6B7280',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Lottie animation */}
      {animationData && (
        <div
          aria-hidden={!shouldAnimate}
          style={{ margin: '0 auto 1rem', width: '260px', maxWidth: '90vw' }}
        >
          <Lottie
            animationData={animationData}
            loop={shouldAnimate}
            autoplay={shouldAnimate}
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </div>
      )}

      <h1 className={pacifico.className} style={{ marginBottom: '0.5rem', color: '#374151' }}>
        Welcome to Notes App
      </h1>

      <p>
        Please{' '}
        <a href="/auth/login" style={{ color: 'blue', fontFamily: 'sans-serif' }}>
          Login
        </a>{' '}
        or{' '}
        <a href="/auth/register" style={{ color: 'blue', fontFamily: 'sans-serif' }}>
          Register
        </a>{' '}
        to get started.
      </p>
    </main>
  );
}
