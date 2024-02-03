'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShirt, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import NextButton from '@/components/buttons/SignInPageButton';

export default function LoginPage() {
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });

  const onLogin = async () => {
  };

  return (
    <main>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mt-10 mb-5">Enter your email</h1>
        <input
          className="border border-black py-4 px-3 outline-none w-full mb-2"
          type="text"
          id="email"
          placeholder="E-mail address"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          className="border border-black py-4 px-3 outline-none w-full"
          type="text"
          id="password"
          placeholder="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <NextButton onLogin={onLogin} />
        <div className='flex gap-1 text-sm py-2'>
          <span>Don't have an account?</span>
          <Link href={'/register'} className='hover:underline hover:text-purple-800'>Create account</Link>
        </div>
        <span className="text-sm">Make your experience even more fun when signing in</span>

        <div className="p-5 text-xs space-y-3">
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faHeart} className="w-5 h-5" />
            <p>Save outfits to albums you create</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faShirt} className="w-5 h-5" />
            <p>Set your brand preferences</p>
          </div>
          <div className="flex gap-4 items-center">
            <FontAwesomeIcon icon={faSackDollar} className="w-5 h-5" />
            <p>Set your budget</p>
          </div>
        </div>
      </div>
    </main>
  );
}
