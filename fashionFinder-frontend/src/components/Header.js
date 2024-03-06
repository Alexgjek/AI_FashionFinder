import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {isLoggedIn, setIsLoggedIn} = useAuth();
  const {showModal, setShowModal} = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    grabEmail();
  }, []);

  const grabEmail = async () => {
    try {
      const response = await axios.get('api/users/grabUserEmail');
      setIsLoggedIn(true); 
    } catch (error) {
      setIsLoggedIn(false); 
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = async () => {
    try {
      await axios.get('/api/users/logout');
      setIsLoggedIn(false); 
      setIsMobileMenuOpen(false); 
      router.push('/login');
      setShowModal(false); 
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
        <nav className='hidden md:flex gap-4'>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact Us</Link>
          <Link href={'/albums'}>Albums</Link>
        </nav>
      </div>
      <div className="relative md:hidden">
        <button
          id="menu-toggle"
          className="outline-none focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto z-50">
            <div className="fixed top-0 right-0 w-1/2 h-screen bg-gray-800 flex flex-col items-center justify-center overflow-y-auto">
              <button
                className="absolute top-4 left-4 outline-none focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <nav className="flex flex-col items-center gap-4 text-white">
                <Link href="/about" onClick={handleMenuItemClick}>About</Link>
                <Link href="/contact" onClick={handleMenuItemClick}>Contact</Link>
                <Link href="/albums" onClick={handleMenuItemClick}>Albums</Link>
                {isLoggedIn ? (
                  <>
                    <Link href="/profile" onClick={handleMenuItemClick}>Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="text-white"
                    >
                      Logout
                    </button>
                    
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={handleMenuItemClick}>Sign In</Link>
                    <Link href="/register" onClick={handleMenuItemClick}>Create Account</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
      {/* Full-screen logout modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
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
      <nav className='hidden md:flex items-center gap-4'>
        {isLoggedIn ? (
          <>
            <Link href={'/profile'}>Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-transparent text-black px-5 text-md"
            >
              Logout
            </button>
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
