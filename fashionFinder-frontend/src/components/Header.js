'use client'

import React, { useState } from 'react';
import { useAuth } from '@/app/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const {showModal, setShowModal} = useAuth(); 
  const router = useRouter();

  const handleLogout = async () => {
    setShowModal(true); 
  };

  const confirmLogout = async () => {
    try {
      await axios.get('/api/users/logout');
      setIsLoggedIn(false);
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <header className='bg-white border-b flex justify-between p-4'>
      <div className="flex items-center gap-6">
        <Link href={'/'}>FashionFinder </Link>
        <nav className='flex gap-4'>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact Us</Link>
          <Link href={'/albums'}>Albums</Link>
        </nav>
      </div>
      <nav className='flex items-center gap-4'>
        {isLoggedIn ? (
          <>
          <Link href={'/profile'}>Profile</Link>
            <button 
              onClick={handleLogout}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold text-lg"
            >
              Logout
            </button>
            {showModal && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                <div className="bg-white p-10 rounded-md shadow-lg">
                  <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
                  <div className="flex items-center justify-center">
                    <button 
                      className="bg-black text-white px-4 py-2 rounded-md mr-2 font-semibold" 
                      onClick={confirmLogout}
                    >
                      Yes
                    </button>
                    <button 
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-semibold" 
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href={'/login'}>Sign In</Link>
            <Link href={'/register'}>Create Account</Link>
          </>
        )}
      </nav>
    </header>
  );
}
