"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b flex justify-between p-4">
      <div className="flex items-center gap-6">
        <Link href="/">FashionFinder</Link>
        <nav id="menu" className="hidden md:flex gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/albums">Albums</Link>
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
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto">
            <div className="fixed top-0 right-0 w-1/2 h-screen bg-black flex flex-col items-center justify-center overflow-y-auto">
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
                <Link href="/" onClick={handleMenuItemClick}>Home</Link>
                <Link href="/about" onClick={handleMenuItemClick}>About</Link>
                <Link href="/contact" onClick={handleMenuItemClick}>Contact</Link>
                <Link href="/albums" onClick={handleMenuItemClick}>Albums</Link>
                <Link href="/login" onClick={handleMenuItemClick}>Sign In</Link>
                <Link href="/register" onClick={handleMenuItemClick}>Create Account</Link>
              </nav>
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:flex gap-4">
        <Link href="/login">Sign In</Link>
        <Link href="/register">Create Account</Link>
      </div>
    </header>
  );
}
